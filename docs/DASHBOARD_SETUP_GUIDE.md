# Gate Application - Dashboard Setup Guide

Panduan lengkap untuk setup dan mengelola dashboard Grafana untuk aplikasi Gate.

## 📊 Dashboard yang Tersedia

Sistem monitoring Gate menyediakan 5 dashboard yang komprehensif:

### 1. **Gate Application - Comprehensive Monitoring** 
- **File**: `gate-comprehensive-dashboard.json`
- **Fokus**: Overview lengkap semua aspek aplikasi
- **Panel**: 11 panel monitoring

### 2. **Gate SSO Monitoring**
- **File**: `gate-sso-dashboard.json`
- **Fokus**: Monitoring khusus SSO authentication
- **Panel**: 8 panel SSO-specific

### 3. **Gate Business Operations Monitoring**
- **File**: `gate-business-dashboard.json`
- **Fokus**: Business metrics dan HR operations
- **Panel**: 8 panel business-focused

### 4. **Gate System Health & Performance**
- **File**: `gate-system-health-dashboard.json`
- **Fokus**: System health dan performance metrics
- **Panel**: 8 panel system-focused

### 5. **Gate Application Monitoring (Basic)**
- **File**: `gate-application-dashboard.json`
- **Fokus**: Basic application monitoring
- **Panel**: 8 panel essential metrics

## 🚀 Quick Setup

### Automated Import

```bash
# Import semua dashboard sekaligus
./monitoring/import-all-dashboards.sh
```

### Manual Import

1. **Login ke Grafana**
   - URL: https://grafana.motorsights.com/
   - Login dengan kredensial yang sesuai

2. **Import Dashboard**
   - Go to `+` > `Import`
   - Upload JSON file dari `monitoring/grafana/dashboards/`
   - Select `Prometheus` sebagai datasource
   - Set folder: `Gate Application`
   - Click `Import`

## 📋 Dashboard Details

### 1. Comprehensive Monitoring Dashboard

**Panel yang tersedia:**
- HTTP Request Rate (All Endpoints)
- HTTP Response Time (95th & 50th percentile)
- Memory Usage (Heap & RSS)
- CPU Usage
- API Endpoint Usage by Module
- HTTP Status Code Distribution
- SSO Authentication Activity
- Database Activity
- Business Operations
- Application Errors
- SSO Rate Limit Hits

**Variables:**
- Route filter
- HTTP Method filter

### 2. SSO Monitoring Dashboard

**Panel yang tersedia:**
- SSO Login Attempts (Success vs Failure)
- Active SSO Sessions
- SSO Token Exchanges
- SSO Rate Limit Hits Rate
- SSO Endpoint Usage
- SSO Login Failure Rate (%)
- SSO Response Time
- SSO Error Rate (4xx & 5xx)

**Fokus:**
- Authentication monitoring
- Session management
- Token exchange tracking
- Security metrics

### 3. Business Operations Dashboard

**Panel yang tersedia:**
- Employee Import Operations
- File Upload Activity by Type
- Queue Processing Activity
- HR Management API Usage
- Import Operations Rate
- File Upload Success/Failure
- Import Operations Response Time
- Import Operations Data Transfer

**Fokus:**
- HR operations
- File processing
- Import operations
- Business workflows

### 4. System Health Dashboard

**Panel yang tersedia:**
- Memory Usage (Detailed)
- CPU Usage
- Active Connections
- Database Connections
- Database Query Rate
- Database Query Duration
- Application Errors by Severity
- Application Uptime

**Fokus:**
- System performance
- Resource utilization
- Database health
- Error tracking

### 5. Application Monitoring (Basic)

**Panel yang tersedia:**
- HTTP Request Rate
- Response Time (95th & 50th percentile)
- Memory Usage
- CPU Usage
- Error Rate (4xx & 5xx)
- SSO Activity
- Database Queries
- Application Errors

**Fokus:**
- Essential metrics
- Basic monitoring
- Quick overview

## 🔧 Configuration

### Datasource Setup

1. **Add Prometheus Datasource**
   ```
   Name: Prometheus
   Type: Prometheus
   URL: https://prometheus.motorsights.com
   Access: Server (default)
   ```

2. **Test Connection**
   - Click `Save & Test`
   - Verify connection successful

3. **Set as Default**
   - Check `Set as default datasource`

### Dashboard Settings

**Refresh Interval:**
- Default: 30 seconds
- Recommended: 30s untuk real-time monitoring
- Can be adjusted per dashboard

**Time Range:**
- Default: Last 1 hour
- Can be changed to: 5m, 15m, 30m, 1h, 6h, 12h, 24h, 7d, 30d

**Timezone:**
- Set to local timezone
- Default: UTC

## 📊 Metrics Coverage

### HTTP Metrics
- Request rate per endpoint
- Response time percentiles
- Request/response size
- Status code distribution
- Error rates

### System Metrics
- Memory usage (heap, RSS, external)
- CPU utilization
- Active connections
- Application uptime

### SSO Metrics
- Login attempts (success/failure)
- Active sessions
- Token exchanges
- Rate limit hits
- Authentication errors

### Database Metrics
- Query rate
- Query duration
- Active connections
- Query performance

### Business Metrics
- Employee imports
- File uploads
- Queue processing
- HR API usage
- Import operations

### Error Metrics
- Application errors by severity
- Error rates by module
- Critical error tracking

## 🚨 Alerting Setup

### Recommended Alerts

1. **High Response Time**
   ```
   Condition: Response time > 5 seconds
   Severity: Warning
   ```

2. **High Error Rate**
   ```
   Condition: Error rate > 5%
   Severity: Critical
   ```

3. **High Memory Usage**
   ```
   Condition: Memory usage > 90%
   Severity: Warning
   ```

4. **SSO High Failure Rate**
   ```
   Condition: SSO failure rate > 20%
   Severity: Warning
   ```

5. **Database Performance**
   ```
   Condition: Query duration > 2 seconds
   Severity: Warning
   ```

### Alert Configuration

1. **Create Alert Rule**
   - Go to Alerting > Alert rules
   - Click `New rule`

2. **Set Query**
   - Use Prometheus queries
   - Set evaluation interval

3. **Set Conditions**
   - Define threshold
   - Set severity level

4. **Set Notifications**
   - Configure notification channels
   - Set contact points

## 🔍 Troubleshooting

### Common Issues

#### 1. Dashboard tidak menampilkan data

**Symptoms:**
- Panel kosong
- "No data" message

**Solutions:**
1. Check datasource connection
2. Verify Prometheus targets
3. Check time range
4. Verify metrics tersedia

#### 2. Metrics tidak muncul

**Symptoms:**
- Graf kosong
- Error "query returned no data"

**Solutions:**
1. Check aplikasi Gate berjalan
2. Verify metrics endpoint: `/metrics`
3. Check Prometheus scrape config
4. Verify time range

#### 3. Performance issues

**Symptoms:**
- Dashboard loading lambat
- Queries timeout

**Solutions:**
1. Increase query timeout
2. Reduce time range
3. Optimize queries
4. Check Prometheus performance

### Debug Commands

```bash
# Test metrics endpoint
curl http://localhost:9588/metrics

# Test Prometheus query
curl "https://prometheus.motorsights.com/api/v1/query?query=gate_http_requests_total"

# Check Grafana datasources
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://grafana.motorsights.com/api/datasources
```

## 📈 Best Practices

### Dashboard Usage

1. **Start with Comprehensive Dashboard**
   - Overview semua metrics
   - Identify issues quickly

2. **Use Specific Dashboards**
   - SSO issues → SSO Dashboard
   - Performance issues → System Health Dashboard
   - Business issues → Business Operations Dashboard

3. **Set Appropriate Time Ranges**
   - Real-time monitoring: 5-15 minutes
   - Trend analysis: 1-24 hours
   - Historical analysis: 7-30 days

### Monitoring Strategy

1. **Real-time Monitoring**
   - Use 30s refresh interval
   - Monitor critical metrics
   - Set up alerts

2. **Performance Analysis**
   - Use 1h time range
   - Analyze trends
   - Identify bottlenecks

3. **Capacity Planning**
   - Use 24h+ time range
   - Analyze growth patterns
   - Plan resource scaling

## 🔗 Useful Links

### Grafana URLs
- **Home**: https://grafana.motorsights.com/
- **Dashboards**: https://grafana.motorsights.com/dashboards
- **Datasources**: https://grafana.motorsights.com/datasources
- **Alerting**: https://grafana.motorsights.com/alerting

### Prometheus URLs
- **Query**: https://prometheus.motorsights.com/graph
- **Targets**: https://prometheus.motorsights.com/targets
- **Status**: https://prometheus.motorsights.com/status

### Application URLs
- **Metrics**: http://YOUR_SERVER:9588/metrics
- **Health**: http://YOUR_SERVER:9588/metrics/health
- **App Metrics**: http://YOUR_SERVER:9588/metrics/app

## 🎯 Next Steps

1. **Customize Dashboards**
   - Add custom panels
   - Modify queries
   - Adjust time ranges

2. **Setup Alerting**
   - Configure alert rules
   - Set notification channels
   - Test alert scenarios

3. **Create Custom Dashboards**
   - Business-specific views
   - Team-specific metrics
   - Executive summaries

4. **Integration**
   - Slack notifications
   - Email alerts
   - External monitoring tools

---

## 📞 Support

Jika mengalami masalah dengan dashboard setup:

1. Check troubleshooting guide di atas
2. Review Grafana logs
3. Verify Prometheus configuration
4. Contact system administrator

**Dashboard Setup Complete! 🎉**

Sistem monitoring Gate sekarang memiliki dashboard yang komprehensif untuk semua aspek aplikasi.
