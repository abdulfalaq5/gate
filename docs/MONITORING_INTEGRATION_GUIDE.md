# Gate Application - Monitoring Integration Guide

Panduan lengkap untuk mengintegrasikan aplikasi Gate dengan Prometheus dan Grafana untuk monitoring yang komprehensif.

## 📋 Overview

Sistem monitoring yang telah diintegrasikan mencakup:

- **Prometheus**: Metrics collection dan storage
- **Grafana**: Visualization dan alerting
- **Custom Metrics**: HTTP requests, response times, SSO activity, database queries, dan system metrics
- **Health Checks**: Application health monitoring
- **Alerting**: Automated alerts untuk threshold violations

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Gate App      │───▶│   Prometheus    │───▶│    Grafana      │
│   (Port 9588)   │    │ (motorsights)   │    │ (motorsights)   │
│                 │    │                 │    │                 │
│ /metrics        │    │ Scrape Config   │    │ Dashboards      │
│ /metrics/app    │    │ Alert Rules     │    │ Alerts          │
│ /metrics/health │    │ Storage         │    │ Notifications   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### 1. Automated Setup

Jalankan script master untuk setup otomatis:

```bash
./setup-monitoring-integration.sh
```

### 2. Manual Setup

Jika setup otomatis gagal, ikuti langkah manual di bawah ini.

## 📦 Prerequisites

- Node.js dan npm terinstall
- Aplikasi Gate berjalan di port 9588
- Akses ke Prometheus server (https://prometheus.motorsights.com/)
- Akses ke Grafana server (https://grafana.motorsights.com/)

## 🔧 Setup Components

### 1. Install Dependencies

```bash
npm install prom-client
```

### 2. Prometheus Integration

#### A. Konfigurasi Scrape Config

Tambahkan konfigurasi berikut ke `prometheus.yml` di server Prometheus:

```yaml
scrape_configs:
  # Aplikasi Gate Express.js
  - job_name: 'gate-express-app'
    static_configs:
      - targets: ['YOUR_GATE_SERVER_IP:9588']
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
```

#### B. Reload Prometheus

```bash
# Reload konfigurasi
curl -X POST https://prometheus.motorsights.com/-/reload

# Atau restart service
sudo systemctl restart prometheus
```

#### C. Verify Targets

Cek di: https://prometheus.motorsights.com/targets

Target yang harus muncul:
- `gate-express-app` dengan status UP

### 3. Grafana Integration

#### A. Add Prometheus Datasource

1. Login ke https://grafana.motorsights.com/
2. Go to Configuration > Data Sources
3. Add new datasource > Prometheus
4. URL: `https://prometheus.motorsights.com`
5. Save & Test

#### B. Import Dashboard

1. Go to + > Import
2. Upload file: `monitoring/grafana/dashboards/gate-application-dashboard.json`
3. Select Prometheus datasource
4. Import

## 📊 Available Metrics

### HTTP Metrics
- `gate_http_requests_total` - Total HTTP requests
- `gate_http_request_duration_seconds` - Request duration histogram
- `gate_http_request_size_bytes` - Request size histogram
- `gate_http_response_size_bytes` - Response size histogram

### System Metrics
- `gate_memory_usage_bytes` - Memory usage (heap, rss, external)
- `gate_cpu_usage_percent` - CPU usage percentage
- `gate_active_connections` - Active connections

### SSO Metrics
- `gate_sso_login_attempts_total` - SSO login attempts
- `gate_sso_token_exchanges_total` - Token exchanges
- `gate_sso_active_sessions` - Active SSO sessions
- `gate_sso_rate_limit_hits_total` - Rate limit hits

### Database Metrics
- `gate_db_queries_total` - Database queries
- `gate_db_query_duration_seconds` - Query duration
- `gate_db_connections_active` - Active connections

### Business Metrics
- `gate_employee_imports_total` - Employee imports
- `gate_file_uploads_total` - File uploads
- `gate_queue_processed_total` - Queue processing

### Error Metrics
- `gate_errors_total` - Application errors

## 🎛️ Dashboard Panels

Dashboard Grafana mencakup:

1. **HTTP Request Rate** - Request rate per detik
2. **Response Time** - 95th dan 50th percentile
3. **Memory Usage** - Heap dan RSS memory
4. **CPU Usage** - CPU utilization
5. **Error Rate** - 4xx dan 5xx error rates
6. **SSO Activity** - Login attempts dan active sessions
7. **Database Queries** - Query volume dan performance
8. **Application Errors** - Error tracking

## 🚨 Alerting Rules

### Prometheus Alert Rules

Buat file `gate_alerts.yml`:

```yaml
groups:
  - name: gate.rules
    rules:
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, rate(gate_http_request_duration_seconds_bucket[5m])) > 5
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "95th percentile response time is {{ $value }}s"

      - alert: HighErrorRate
        expr: rate(gate_http_requests_total{status_code=~"5.."}[5m]) / rate(gate_http_requests_total[5m]) > 0.05
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          description: "Error rate is {{ $value | humanizePercentage }}"

      - alert: HighMemoryUsage
        expr: gate_memory_usage_bytes{type="heap_used"} / gate_memory_usage_bytes{type="heap_total"} > 0.9
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage"
          description: "Memory usage is {{ $value | humanizePercentage }}"

      - alert: SSOHighFailureRate
        expr: rate(gate_sso_login_attempts_total{status="failure"}[5m]) / rate(gate_sso_login_attempts_total[5m]) > 0.2
        for: 1m
        labels:
          severity: warning
        annotations:
          summary: "High SSO failure rate"
          description: "SSO failure rate is {{ $value | humanizePercentage }}"
```

## 🔍 Monitoring Endpoints

### Application Endpoints

- `GET /metrics` - Prometheus metrics format
- `GET /metrics/app` - Application-specific metrics (JSON)
- `GET /metrics/health` - Metrics system health check

### Example Usage

```bash
# Basic metrics
curl http://localhost:9588/metrics

# Application metrics
curl http://localhost:9588/metrics/app | jq

# Health check
curl http://localhost:9588/metrics/health
```

## 🧪 Testing

### Test Prometheus Queries

```bash
# HTTP request rate
curl "https://prometheus.motorsights.com/api/v1/query?query=rate(gate_http_requests_total[5m])"

# Response time 95th percentile
curl "https://prometheus.motorsights.com/api/v1/query?query=histogram_quantile(0.95, rate(gate_http_request_duration_seconds_bucket[5m]))"

# Memory usage
curl "https://prometheus.motorsights.com/api/v1/query?query=gate_memory_usage_bytes"

# SSO activity
curl "https://prometheus.motorsights.com/api/v1/query?query=gate_sso_login_attempts_total"
```

### Test Grafana Dashboard

1. Login ke Grafana
2. Navigate ke dashboard "Gate Application Monitoring"
3. Verify semua panel menampilkan data
4. Test time range selection
5. Test refresh interval

## 🔧 Troubleshooting

### Common Issues

#### 1. Metrics tidak muncul di Prometheus

**Symptoms:**
- Target status DOWN di Prometheus
- Tidak ada data di Grafana

**Solutions:**
```bash
# Cek aplikasi berjalan
curl http://localhost:9588/health

# Cek metrics endpoint
curl http://localhost:9588/metrics

# Cek konfigurasi Prometheus
curl https://prometheus.motorsights.com/api/v1/targets
```

#### 2. Dashboard tidak menampilkan data

**Symptoms:**
- Dashboard kosong di Grafana
- Error "No data"

**Solutions:**
1. Cek datasource connection
2. Verify time range
3. Test queries manual di Prometheus
4. Check metrics tersedia

#### 3. High memory usage

**Symptoms:**
- Memory alerts triggered
- Application performance degraded

**Solutions:**
1. Monitor memory metrics
2. Check for memory leaks
3. Optimize application code
4. Increase server resources

### Debug Commands

```bash
# Cek aplikasi status
curl -s http://localhost:9588/metrics/health | jq

# Cek metrics format
curl -s http://localhost:9588/metrics | head -20

# Cek Prometheus targets
curl -s https://prometheus.motorsights.com/api/v1/targets | jq '.data.activeTargets[] | select(.labels.job=="gate-express-app")'

# Cek Grafana datasources
curl -H "Authorization: Bearer YOUR_API_KEY" https://grafana.motorsights.com/api/datasources
```

## 📈 Performance Optimization

### Metrics Collection Optimization

1. **Adjust scrape interval** - Sesuaikan dengan kebutuhan
2. **Filter metrics** - Hanya collect metrics yang diperlukan
3. **Optimize queries** - Gunakan recording rules untuk complex queries
4. **Monitor Prometheus** - Monitor Prometheus server performance

### Dashboard Optimization

1. **Reduce query frequency** - Gunakan caching
2. **Optimize queries** - Hindari expensive queries
3. **Limit data points** - Gunakan appropriate time ranges
4. **Use variables** - Untuk dynamic filtering

## 🔒 Security Considerations

### Access Control

1. **Prometheus Access** - Restrict access ke Prometheus server
2. **Grafana Access** - Implement proper authentication
3. **Metrics Endpoint** - Consider authentication untuk sensitive metrics
4. **Network Security** - Use HTTPS dan proper firewall rules

### Data Privacy

1. **Sensitive Data** - Hindari logging sensitive information
2. **PII Protection** - Jangan include PII dalam metrics
3. **Audit Logging** - Log access ke monitoring systems

## 📚 Additional Resources

### Documentation Links

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Prometheus Client for Node.js](https://github.com/siimon/prom-client)

### Useful Queries

```promql
# Request rate by method
rate(gate_http_requests_total[5m])

# Error rate
rate(gate_http_requests_total{status_code=~"5.."}[5m]) / rate(gate_http_requests_total[5m])

# Memory usage percentage
gate_memory_usage_bytes{type="heap_used"} / gate_memory_usage_bytes{type="heap_total"} * 100

# SSO success rate
rate(gate_sso_login_attempts_total{status="success"}[5m]) / rate(gate_sso_login_attempts_total[5m])

# Database query performance
histogram_quantile(0.95, rate(gate_db_query_duration_seconds_bucket[5m]))
```

## 🎯 Next Steps

1. **Custom Alerts** - Setup custom alerts berdasarkan business requirements
2. **Custom Dashboards** - Buat dashboard khusus untuk different teams
3. **Integration** - Integrate dengan notification systems (Slack, email)
4. **Automation** - Setup automated responses untuk critical alerts
5. **Capacity Planning** - Use metrics untuk capacity planning
6. **Performance Tuning** - Optimize application berdasarkan metrics data

---

## 📞 Support

Jika mengalami masalah dengan monitoring integration:

1. Cek troubleshooting guide di atas
2. Review logs aplikasi dan monitoring systems
3. Test individual components
4. Contact system administrator jika diperlukan

**Monitoring Integration Setup Complete! 🎉**
