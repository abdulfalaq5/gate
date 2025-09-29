# 🚀 Gate Application - Monitoring Setup

Setup monitoring untuk aplikasi Gate dengan Prometheus dan Grafana.

## ⚡ Quick Setup

```bash
# 1. Install dependencies
npm install prom-client

# 2. Setup monitoring integration
./setup-monitoring-integration.sh
```

## 🔧 Manual Setup

### 1. Enable Metrics di Environment

```bash
# Copy environment file
cp environment.example .env

# Edit .env dan pastikan:
SSO_ENABLE_METRICS=true
PROMETHEUS_ENABLED=true
PROMETHEUS_SERVER_URL=https://prometheus.motorsights.com
GRAFANA_SERVER_URL=https://grafana.motorsights.com
```

### 2. Start Application

```bash
npm start
```

### 3. Verify Metrics Endpoint

```bash
# Test metrics endpoint
curl http://localhost:9588/metrics

# Test application metrics
curl http://localhost:9588/metrics/app

# Test health check
curl http://localhost:9588/metrics/health
```

### 4. Configure Prometheus

Tambahkan konfigurasi berikut ke `prometheus.yml`:

```yaml
scrape_configs:
  - job_name: 'gate-express-app'
    static_configs:
      - targets: ['YOUR_GATE_SERVER_IP:9588']
    metrics_path: '/metrics'
    scrape_interval: 15s
```

Reload Prometheus:
```bash
curl -X POST https://prometheus.motorsights.com/-/reload
```

### 5. Configure Grafana

1. **Add Datasource:**
   - Login ke https://grafana.motorsights.com/
   - Configuration > Data Sources > Add Prometheus
   - URL: `https://prometheus.motorsights.com`

2. **Import Dashboard:**
   - + > Import
   - Upload: `monitoring/grafana/dashboards/gate-application-dashboard.json`

## 📊 Available Metrics

- **HTTP Metrics**: Request rate, response time, error rate
- **System Metrics**: Memory usage, CPU usage, active connections
- **SSO Metrics**: Login attempts, active sessions, token exchanges
- **Database Metrics**: Query count, duration, connections
- **Business Metrics**: Employee imports, file uploads, queue processing
- **Error Metrics**: Application errors by type and severity

## 🔍 Verification

### Check Prometheus Targets
https://prometheus.motorsights.com/targets

Look for: `gate-express-app` with status UP

### Check Grafana Dashboard
https://grafana.motorsights.com

Navigate to: Gate Application Monitoring dashboard

### Test Queries

```bash
# HTTP request rate
curl "https://prometheus.motorsights.com/api/v1/query?query=rate(gate_http_requests_total[5m])"

# Response time 95th percentile
curl "https://prometheus.motorsights.com/api/v1/query?query=histogram_quantile(0.95, rate(gate_http_request_duration_seconds_bucket[5m]))"

# Memory usage
curl "https://prometheus.motorsights.com/api/v1/query?query=gate_memory_usage_bytes"
```

## 🚨 Troubleshooting

### Metrics tidak muncul di Prometheus
1. Cek aplikasi berjalan: `curl http://localhost:9588/health`
2. Cek metrics endpoint: `curl http://localhost:9588/metrics`
3. Cek konfigurasi Prometheus scrape config
4. Restart Prometheus server

### Dashboard tidak menampilkan data
1. Cek datasource Prometheus di Grafana
2. Test query manual di Prometheus
3. Cek time range di dashboard
4. Verifikasi metrics tersedia

### Aplikasi Gate tidak berjalan
1. Install dependencies: `npm install`
2. Jalankan aplikasi: `npm start`
3. Cek logs aplikasi
4. Verifikasi port 9588 tersedia

## 📚 Documentation

Untuk dokumentasi lengkap, lihat:
- [Monitoring Integration Guide](docs/MONITORING_INTEGRATION_GUIDE.md)

## 🎯 Next Steps

1. **Custom Alerts** - Setup alerts berdasarkan business requirements
2. **Custom Dashboards** - Buat dashboard khusus untuk different teams
3. **Integration** - Integrate dengan notification systems
4. **Automation** - Setup automated responses untuk critical alerts

---

**Monitoring Setup Complete! 🎉**

Aplikasi Gate sekarang terintegrasi dengan Prometheus dan Grafana untuk monitoring yang komprehensif.
