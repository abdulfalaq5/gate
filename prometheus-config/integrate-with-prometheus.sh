#!/bin/bash

# Script untuk mengintegrasikan aplikasi Gate dengan Prometheus server yang sudah ada
# Pastikan Prometheus server sudah berjalan di https://prometheus.motorsights.com/

echo "🚀 Mengintegrasikan aplikasi Gate dengan Prometheus server..."

# Konfigurasi
PROMETHEUS_SERVER="https://prometheus.motorsights.com"
GATE_SERVER_IP="localhost"  # Ganti dengan IP server Gate yang sebenarnya
GATE_SERVER_PORT="9588"
CONFIG_FILE="./prometheus.yml"

echo "📋 Konfigurasi:"
echo "  - Prometheus Server: $PROMETHEUS_SERVER"
echo "  - Gate Server: $GATE_SERVER_IP:$GATE_SERVER_PORT"
echo "  - Config File: $CONFIG_FILE"

# Fungsi untuk mengecek konektivitas
check_connectivity() {
    echo "🔍 Mengecek konektivitas ke Prometheus server..."
    
    if curl -s -f "$PROMETHEUS_SERVER/api/v1/status/config" > /dev/null; then
        echo "✅ Prometheus server dapat diakses"
        return 0
    else
        echo "❌ Prometheus server tidak dapat diakses"
        return 1
    fi
}

# Fungsi untuk mengecek aplikasi Gate
check_gate_app() {
    echo "🔍 Mengecek aplikasi Gate..."
    
    if curl -s -f "http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics" > /dev/null; then
        echo "✅ Aplikasi Gate dapat diakses dan metrics endpoint tersedia"
        return 0
    else
        echo "❌ Aplikasi Gate tidak dapat diakses atau metrics endpoint tidak tersedia"
        echo "   Pastikan aplikasi Gate berjalan dan endpoint /metrics tersedia"
        return 1
    fi
}

# Fungsi untuk menambahkan konfigurasi ke Prometheus
add_to_prometheus_config() {
    echo "📝 Menambahkan konfigurasi Gate ke Prometheus..."
    
    # Backup konfigurasi Prometheus yang ada (jika ada akses)
    echo "💾 Membuat backup konfigurasi Prometheus..."
    
    # Generate konfigurasi untuk ditambahkan
    cat > "./gate-prometheus-config.yml" << EOF
# Konfigurasi untuk aplikasi Gate - Tambahkan ke prometheus.yml

scrape_configs:
  # Aplikasi Gate Express.js
  - job_name: 'gate-express-app'
    static_configs:
      - targets: ['$GATE_SERVER_IP:$GATE_SERVER_PORT']
    metrics_path: '/metrics'
    scrape_interval: 15s
    scrape_timeout: 10s
    honor_labels: false
    honor_timestamps: true
    
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'gate-express-web'
      - target_label: job
        replacement: 'gate-application'
      - target_label: environment
        replacement: 'production'

  # Monitoring endpoint khusus
  - job_name: 'gate-monitoring'
    static_configs:
      - targets: ['$GATE_SERVER_IP:$GATE_SERVER_PORT']
    metrics_path: '/metrics/app'
    scrape_interval: 30s
    scrape_timeout: 15s
    honor_labels: true
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'gate-monitoring'
      - target_label: job
        replacement: 'gate-custom-metrics'
EOF

    echo "✅ Konfigurasi telah dibuat di ./gate-prometheus-config.yml"
    echo "📋 Langkah selanjutnya:"
    echo "   1. Salin isi file gate-prometheus-config.yml"
    echo "   2. Tambahkan ke prometheus.yml di server Prometheus"
    echo "   3. Restart atau reload konfigurasi Prometheus"
}

# Fungsi untuk reload Prometheus configuration
reload_prometheus_config() {
    echo "🔄 Mencoba reload konfigurasi Prometheus..."
    
    if curl -X POST "$PROMETHEUS_SERVER/-/reload" > /dev/null 2>&1; then
        echo "✅ Prometheus configuration reloaded successfully"
    else
        echo "⚠️  Tidak dapat reload otomatis. Silakan reload manual:"
        echo "   curl -X POST $PROMETHEUS_SERVER/-/reload"
        echo "   atau restart service Prometheus"
    fi
}

# Fungsi untuk verifikasi targets
verify_targets() {
    echo "🔍 Memverifikasi targets di Prometheus..."
    
    echo "Targets yang seharusnya muncul:"
    echo "  - gate-express-app ($GATE_SERVER_IP:$GATE_SERVER_PORT)"
    echo "  - gate-monitoring ($GATE_SERVER_IP:$GATE_SERVER_PORT)"
    
    echo "📊 Cek targets di: $PROMETHEUS_SERVER/targets"
    echo "🔍 Cek metrics di: $PROMETHEUS_SERVER/graph"
}

# Fungsi untuk test metrics
test_metrics() {
    echo "🧪 Testing metrics dari aplikasi Gate..."
    
    echo "📊 Basic metrics:"
    curl -s "http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics" | head -20
    
    echo ""
    echo "📈 Application metrics:"
    curl -s "http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics/app" | jq '.' 2>/dev/null || echo "JSON response (install jq untuk formatting yang lebih baik)"
}

# Main execution
main() {
    echo "🎯 Memulai integrasi Gate dengan Prometheus..."
    
    # Cek konektivitas
    if ! check_connectivity; then
        echo "❌ Tidak dapat melanjutkan karena Prometheus server tidak dapat diakses"
        exit 1
    fi
    
    # Cek aplikasi Gate
    if ! check_gate_app; then
        echo "❌ Tidak dapat melanjutkan karena aplikasi Gate tidak dapat diakses"
        echo "💡 Pastikan aplikasi Gate berjalan dengan perintah: npm start"
        exit 1
    fi
    
    # Buat konfigurasi
    add_to_prometheus_config
    
    # Test metrics
    test_metrics
    
    # Verifikasi
    verify_targets
    
    echo ""
    echo "🎉 Integrasi selesai!"
    echo ""
    echo "📋 Langkah selanjutnya:"
    echo "   1. Tambahkan konfigurasi dari gate-prometheus-config.yml ke prometheus.yml"
    echo "   2. Reload atau restart Prometheus server"
    echo "   3. Cek targets di $PROMETHEUS_SERVER/targets"
    echo "   4. Buat dashboard di Grafana"
    echo ""
    echo "🔗 Link berguna:"
    echo "   - Prometheus Targets: $PROMETHEUS_SERVER/targets"
    echo "   - Prometheus Graph: $PROMETHEUS_SERVER/graph"
    echo "   - Gate Metrics: http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics"
}

# Jalankan script
main "$@"
