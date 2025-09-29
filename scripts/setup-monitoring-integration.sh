#!/bin/bash

# Master script untuk mengintegrasikan aplikasi Gate dengan Prometheus dan Grafana
# Script ini akan mengatur semua komponen monitoring yang diperlukan

echo "🚀 GATE MONITORING INTEGRATION SETUP"
echo "===================================="
echo ""

# Konfigurasi
GATE_SERVER_IP="localhost"  # Ganti dengan IP server Gate yang sebenarnya
GATE_SERVER_PORT="9588"
PROMETHEUS_SERVER="https://prometheus.motorsights.com"
GRAFANA_SERVER="https://grafana.motorsights.com"

echo "📋 Konfigurasi Sistem:"
echo "  - Gate Server: $GATE_SERVER_IP:$GATE_SERVER_PORT"
echo "  - Prometheus Server: $PROMETHEUS_SERVER"
echo "  - Grafana Server: $GRAFANA_SERVER"
echo ""

# Fungsi untuk mengecek environment
check_environment() {
    echo "🔍 Mengecek environment..."
    
    # Cek Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js tidak ditemukan. Silakan install Node.js terlebih dahulu."
        exit 1
    fi
    
    # Cek npm
    if ! command -v npm &> /dev/null; then
        echo "❌ npm tidak ditemukan. Silakan install npm terlebih dahulu."
        exit 1
    fi
    
    # Cek curl
    if ! command -v curl &> /dev/null; then
        echo "❌ curl tidak ditemukan. Silakan install curl terlebih dahulu."
        exit 1
    fi
    
    echo "✅ Environment check passed"
}

# Fungsi untuk install dependencies
install_dependencies() {
    echo "📦 Installing dependencies..."
    
    # Install prom-client jika belum ada
    if ! npm list prom-client &> /dev/null; then
        echo "Installing prom-client..."
        npm install prom-client
    else
        echo "✅ prom-client sudah terinstall"
    fi
    
    echo "✅ Dependencies installation completed"
}

# Fungsi untuk mengecek aplikasi Gate
check_gate_application() {
    echo "🔍 Mengecek aplikasi Gate..."
    
    # Cek apakah aplikasi berjalan
    if curl -s -f "http://$GATE_SERVER_IP:$GATE_SERVER_PORT/health" > /dev/null; then
        echo "✅ Aplikasi Gate berjalan"
    else
        echo "⚠️  Aplikasi Gate tidak berjalan atau health endpoint tidak tersedia"
        echo "💡 Jalankan aplikasi dengan: npm start"
        return 1
    fi
    
    # Cek metrics endpoint
    if curl -s -f "http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics" > /dev/null; then
        echo "✅ Metrics endpoint tersedia"
    else
        echo "❌ Metrics endpoint tidak tersedia"
        echo "💡 Pastikan aplikasi Gate sudah diintegrasikan dengan Prometheus metrics"
        return 1
    fi
    
    return 0
}

# Fungsi untuk test metrics endpoint
test_metrics_endpoint() {
    echo "🧪 Testing metrics endpoint..."
    
    echo "📊 Basic metrics (first 10 lines):"
    curl -s "http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics" | head -10
    
    echo ""
    echo "📈 Application metrics:"
    curl -s "http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics/app" | jq '.status' 2>/dev/null || echo "JSON response available"
    
    echo ""
    echo "💚 Metrics health:"
    curl -s "http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics/health" | jq '.status' 2>/dev/null || echo "Health check available"
}

# Fungsi untuk integrasi Prometheus
integrate_prometheus() {
    echo "🔗 Mengintegrasikan dengan Prometheus..."
    
    if [ -f "./prometheus-config/integrate-with-prometheus.sh" ]; then
        echo "🚀 Menjalankan script integrasi Prometheus..."
        ./prometheus-config/integrate-with-prometheus.sh
    else
        echo "⚠️  Script integrasi Prometheus tidak ditemukan"
        echo "💡 Silakan jalankan manual:"
        echo "   1. Tambahkan konfigurasi dari prometheus-config/prometheus.yml"
        echo "   2. Restart Prometheus server"
        echo "   3. Cek targets di $PROMETHEUS_SERVER/targets"
    fi
}

# Fungsi untuk integrasi Grafana
integrate_grafana() {
    echo "📊 Mengintegrasikan dengan Grafana..."
    
    if [ -f "./monitoring/integrate-with-grafana.sh" ]; then
        echo "🚀 Menjalankan script integrasi Grafana..."
        ./monitoring/integrate-with-grafana.sh
    else
        echo "⚠️  Script integrasi Grafana tidak ditemukan"
        echo "💡 Silakan jalankan manual:"
        echo "   1. Tambahkan datasource Prometheus di Grafana"
        echo "   2. Import dashboard dari monitoring/grafana/dashboards/"
        echo "   3. Konfigurasi alerts jika diperlukan"
    fi
}

# Fungsi untuk menampilkan status akhir
show_final_status() {
    echo ""
    echo "🎉 MONITORING INTEGRATION COMPLETED!"
    echo "===================================="
    echo ""
    echo "📊 STATUS MONITORING:"
    echo "  ✅ Prometheus Metrics: http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics"
    echo "  ✅ Application Metrics: http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics/app"
    echo "  ✅ Health Check: http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics/health"
    echo ""
    echo "🔗 EXTERNAL SERVICES:"
    echo "  📈 Prometheus Server: $PROMETHEUS_SERVER"
    echo "  📊 Grafana Dashboard: $GRAFANA_SERVER"
    echo ""
    echo "🔍 VERIFICATION STEPS:"
    echo "  1. Cek Prometheus Targets: $PROMETHEUS_SERVER/targets"
    echo "  2. Cek Grafana Dashboards: $GRAFANA_SERVER"
    echo "  3. Test metrics queries di Prometheus"
    echo ""
    echo "📋 AVAILABLE METRICS:"
    echo "  - gate_http_requests_total (HTTP request counter)"
    echo "  - gate_http_request_duration_seconds (Response time histogram)"
    echo "  - gate_memory_usage_bytes (Memory usage)"
    echo "  - gate_cpu_usage_percent (CPU usage)"
    echo "  - gate_sso_login_attempts_total (SSO login attempts)"
    echo "  - gate_sso_active_sessions (Active SSO sessions)"
    echo "  - gate_db_queries_total (Database queries)"
    echo "  - gate_errors_total (Application errors)"
    echo ""
    echo "🚨 ALERTING:"
    echo "  - Response time > 5s"
    echo "  - Error rate > 5%"
    echo "  - Memory usage > 90%"
    echo "  - High SSO failure rate"
    echo ""
}

# Fungsi untuk troubleshooting
show_troubleshooting() {
    echo ""
    echo "🔧 TROUBLESHOOTING GUIDE"
    echo "========================"
    echo ""
    echo "❌ Jika metrics tidak muncul di Prometheus:"
    echo "   1. Cek aplikasi Gate berjalan: curl http://$GATE_SERVER_IP:$GATE_SERVER_PORT/health"
    echo "   2. Cek metrics endpoint: curl http://$GATE_SERVER_IP:$GATE_SERVER_PORT/metrics"
    echo "   3. Cek konfigurasi Prometheus scrape config"
    echo "   4. Restart Prometheus server"
    echo ""
    echo "❌ Jika dashboard tidak menampilkan data:"
    echo "   1. Cek datasource Prometheus di Grafana"
    echo "   2. Test query manual di Prometheus"
    echo "   3. Cek time range di dashboard"
    echo "   4. Verifikasi metrics tersedia di Prometheus"
    echo ""
    echo "❌ Jika aplikasi Gate tidak berjalan:"
    echo "   1. Install dependencies: npm install"
    echo "   2. Jalankan aplikasi: npm start"
    echo "   3. Cek logs aplikasi"
    echo "   4. Verifikasi port $GATE_SERVER_PORT tersedia"
    echo ""
}

# Main execution
main() {
    echo "🎯 Memulai setup monitoring integration..."
    
    # Environment check
    check_environment
    
    # Install dependencies
    install_dependencies
    
    # Check application
    if ! check_gate_application; then
        echo "❌ Aplikasi Gate tidak siap untuk monitoring"
        show_troubleshooting
        exit 1
    fi
    
    # Test metrics
    test_metrics_endpoint
    
    # Integrate Prometheus
    integrate_prometheus
    
    # Integrate Grafana
    integrate_grafana
    
    # Show final status
    show_final_status
    
    # Show troubleshooting
    show_troubleshooting
}

# Jalankan script
main "$@"
