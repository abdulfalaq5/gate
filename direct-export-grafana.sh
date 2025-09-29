#!/bin/bash

echo "🚀 Export Metrics Langsung ke Prometheus Server Existing"
echo "====================================================="
echo "📊 Tidak perlu setup Prometheus lokal, langsung scrape ke server existing"
echo ""

# Konfigurasi untuk export langsung ke Prometheus server existing
setup_direct_export() {
    echo "⚙️  Konfigurasi direct export..."
    
    # Tanya Prometheus server endpoint
    echo "🔍 Apa endpoint Prometheus server yang sudah ada?"
    echo "   Contoh: http://prometheus.motorsights.com:9090"
    echo "   Contoh: http://grafana.motorsights.com/prometheus"
    echo ""
    
    read -p "💡 Masukkan Prometheus server URL: " PROMETHEUS_SERVER_URL
    
    if [ -z "$PROMETHEUS_SERVER_URL" ]; then
        echo "❌ Prometheus server URL harus diisi!"
        exit 1
    fi
    
    echo "✅ Prometheus server: $PROMETHEUS_SERVER_URL"
    
    # Cek apakah Express.js metadata bisa diakses via Prometheus server
    echo "🔍 Cek konektivitas ke Prometheus server..."
    if curl -s --connect-timeout 10 "$PROMETHEUS_SERVER_URL/api/v1/targets" > /dev/null; then
        echo "✅ Prometheus server dapat diakses"
    else
        echo "⚠️  Prometheus server tidak dapat diakses, tapi akan tetap lanjutkan"
    fi
}

# Buat konfigurasi untuk Prometheus server existing
create_pushgateway_config() {
    echo "📝 Membuat konfigurasi Push Gateway..."
    
    mkdir -p "./export-config"
    
    # Buat konfigurasi untuk push metrics
    cat > "./export-config/push-config.js" << EOF
const PushGateway = require('prom-client').pushgateway.RewritePushGateway;
const promClient = require('prom-client');

// Setup metrics yang sama dengan Express.js
const register = new promClient.Registry();

// Default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDuration = new promClient.Histogram({
  name: 'gate_http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestTotal = new promClient.Counter({
  name: 'gate_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
  name: 'gate_active_connections',
  help: 'Number of active connections'
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);
register.registerMetric(activeConnections);

// Export ke Prometheus server
function exportToPrometheus() {
  const gateway = new PushGateway('$PROMETHEUS_SERVER_URL');
  const jobName = 'gate-express-web-' + process.env.APP_PORT || '9588';
  
  gateway.pushAdd(register, { jobName }, (err, resp, body) => {
    if (err) {
      console.error('Push Gateway Error:', err);
    } else {
      console.log('✅ Metrics exported to Prometheus:', body);
    }
  });
}

// Export setiap 15 detik
setInterval(exportToPrometheus, 15000);

module.exports = { register, exportToPrometheus };
EOF

    echo "✅ Konfigurasi direct export selesai di ./export-config/push-config.js"
}

# Buat alternatif dengan scrape configuration  
create_scrape_config() {
    echo "📝 Membuat scrape configuration untuk external Prometheus..."
    
    cat > "./export-config/external-prometheus-config.yml" << EOF
# Konfigurasi untuk ditambahkan ke Prometheus server existing
# Berikan konfigurasi ini ke administrator Prometheus server

scrape_configs:
  - job_name: 'gate-express-web'
    static_configs:
      - targets: ['YOUR_SERVER_IP:9588']  # Ganti dengan IP server Express.js
    metrics_path: '/metrics'
    scrape_interval: 15s
    scrape_timeout: 10s
    honor_labels: false
    honor_timestamps: true
    
  - job_name: 'gate-express-api'
    static_configs:
      - targets: ['YOUR_SERVER_IP:9588']
    metrics_path: '/metrics'
    scrape_interval: 15s
    relabel_configs:
      - source_labels: [__address__]
        replacement: 'express-gate-${APP_PORT:-9588}'
        target_label: instance
EOF

    echo "✅ Scrape configuration dibuat di ./export-config/external-prometheus-config.yml"
}

# Install push gateway dependency
install_pushgateway() {
    echo "📦 Menginstall push gateway dependency..."
    
    if npm list prom-client > /dev/null 2>&1; then
        echo "✅ prom-client sudah terinstall"
    else
        echo "📥 Installing prom-client..."
        npm install prom-client
    fi
}

# Buat dokumentasi untuk administrator Prometheus server
create_admin_docs() {
    echo "📚 Membuat dokumentasi untuk administrator Prometheus server..."
    
    cat > "./export-config/PROMETHEUS_SERVER_SETUP.md" << EOF
# 📋 Instruksi untuk Administrator Prometheus Server

## 🎯 Tujuan
Menambahkan scraping target Express.js Gate ke Prometheus server existing

## 📝 Konfigurasi yang Perlu Ditambahkan

Tambahkan konfigurasi berikut ke prometheus.yml di server Prometheus:

\`\`\`yaml
scrape_configs:
  # Existing configurations...
  
  # Gate Express.js Application
  - job_name: 'gate-express-web'
    static_configs:
      - targets: ['EXPRESS_SERVER_IP:9588']  # IP server Express.js Gate
    metrics_path: '/metrics'
    scrape_interval: 15s
    scrape_timeout: 10s
    honor_labels: false
    honor_timestamps: true
    
  - job_name: 'gate-express-api'
    static_configs:
      - targets: ['EXPRESS_SERVER_IP:9588']
    metrics_path: '/metrics'
    scrape_interval: 15s
    relabel_configs:
      - source_labels: [__address__]
        replacement: 'express-gate-web'
        target_label: instance
\`\`\`

## 🔄 Restart Prometheus

Setelah menambahkan konfigurasi:

\`\`\`bash
# Reload Prometheus configuration
curl -X POST http://prometheus-server:9090/-/reload

# Atau restart service
sudo systemctl restart prometheus
\`\`\`

## ✅ Verify Setup

1. **Check Targets**: http://prometheus-server:9090/targets
2. **Look for**: gate-express-web and gate-express-api targets
3. **Status**: UP (green)
4. **Last Scrape**: Recent timestamp

## 🔍 Test Metrics

Ketik query berikut di Prometheus UI:

\`\`\`
# HTTP request rate
rate(gate_http_requests_total[5m])

# Response time 95th percentile
histogram_quantile(0.95, rate(gate_http_request_duration_seconds_bucket[5m]))

# Active connections
gate_active_connections
\`\`\`

## 📊 Expected Metrics

Express.js Gate akan export metrics berikut:

- \`gate_http_requests_total\` - Total HTTP requests
- \`gate_http_request_duration_seconds\` - Request duration histogram
- \`gate_active_connections\` - Active connections gauge
- \`process_cpu_seconds_total\` - CPU usage
- \`process_resident_memory_bytes\` - Memory usage
- \`nodejs_heap_size_bytes\` - Heap size
- Dan lain-lain default Node.js metrics

## 🚨 Troubleshooting

### Target tidak muncul di targets list:
- Cek network connectivity ke Express.js server
- Verify port 9588 terbuka
- Check metrics endpoint: http://EXPRESS_SERVER_IP:9588/metrics

### Target status DOWN:
- Verify Express.js application running
- Check metrics endpoint accessibility
- Check firewall/security group rules

### No metrics muncul:
- Verify Express.js metrics customization aktif
- Check prometheus scraping interval (15s)
- Restart Express.js application
EOF

    echo "✅ Dokumentasi admin dibuat di ./export-config/PROMETHEUS_SERVER_SETUP.md"
}

# Main execution
main() {
    echo "🔍 Setup untuk export langsung ke Prometheus server existing..."
    
    setup_direct_export
    install_pushgateway
    create_pushgateway_config
    create_scrape_config
    create_admin_docs
    
    echo ""
    echo "🎉 Setup Direct Export selesai!"
    echo ""
    echo "📋 Langkah berikutnya:"
    echo "1. Berikan file './export-config/PROMETHEUS_SERVER_SETUP.md' ke administrator Prometheus server"
    echo "2. Administrator menambahkan scraping configuration"
    echo "3. Restart/reload Prometheus server"
    echo "4. Verify targets di Prometheus UI"
    echo "5. Import dashboard template ke Grafana existing"
    echo ""
    echo "📊 Prometheus server: $PROMETHEUS_SERVER_URL"
    echo "📚 Dokumentasi admin: ./export-config/PROMETHEUS_SERVER_SETUP.md"
}

# Jalankan fungsi utama
main "$@"
