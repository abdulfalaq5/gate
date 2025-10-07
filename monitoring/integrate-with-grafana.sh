#!/bin/bash

# Script untuk mengintegrasikan aplikasi Gate dengan Grafana
# Pastikan Grafana server sudah berjalan di https://grafana.motorsights.com/

echo "🚀 Mengintegrasikan aplikasi Gate dengan Grafana server..."

# Konfigurasi
GRAFANA_SERVER="https://grafana.motorsights.com"
PROMETHEUS_SERVER="https://prometheus.motorsights.com"
GRAFANA_API_KEY=""  # Masukkan API key Grafana di sini jika ada
DASHBOARD_FILE="./grafana/dashboards/gate-application-dashboard.json"
DATASOURCE_FILE="./grafana/provisioning/datasources/prometheus.yml"

echo "📋 Konfigurasi:"
echo "  - Grafana Server: $GRAFANA_SERVER"
echo "  - Prometheus Server: $PROMETHEUS_SERVER"
echo "  - Dashboard File: $DASHBOARD_FILE"
echo "  - Datasource File: $DATASOURCE_FILE"

# Fungsi untuk mengecek konektivitas Grafana
check_grafana_connectivity() {
    echo "🔍 Mengecek konektivitas ke Grafana server..."
    
    if curl -s -f "$GRAFANA_SERVER/api/health" > /dev/null; then
        echo "✅ Grafana server dapat diakses"
        return 0
    else
        echo "❌ Grafana server tidak dapat diakses"
        return 1
    fi
}

# Fungsi untuk mengecek konektivitas Prometheus
check_prometheus_connectivity() {
    echo "🔍 Mengecek konektivitas ke Prometheus server..."
    
    if curl -s -f "$PROMETHEUS_SERVER/api/v1/status/config" > /dev/null; then
        echo "✅ Prometheus server dapat diakses"
        return 0
    else
        echo "❌ Prometheus server tidak dapat diakses"
        return 1
    fi
}

# Fungsi untuk menambahkan datasource ke Grafana
add_datasource_to_grafana() {
    echo "📊 Menambahkan Prometheus sebagai datasource di Grafana..."
    
    # Buat payload untuk datasource
    cat > "./temp-datasource.json" << EOF
{
  "name": "Prometheus",
  "type": "prometheus",
  "access": "proxy",
  "url": "$PROMETHEUS_SERVER",
  "isDefault": true,
  "editable": true,
  "jsonData": {
    "httpMethod": "POST",
    "manageAlerts": true,
    "prometheusType": "Prometheus",
    "prometheusVersion": "2.40.0",
    "cacheLevel": "High",
    "disableRecordingRules": false,
    "incrementalQueryOverlapWindow": "10m"
  }
}
EOF

    # Tambahkan datasource jika API key tersedia
    if [ -n "$GRAFANA_API_KEY" ]; then
        echo "🔑 Menggunakan API key untuk menambahkan datasource..."
        
        RESPONSE=$(curl -s -X POST \
            -H "Authorization: Bearer $GRAFANA_API_KEY" \
            -H "Content-Type: application/json" \
            -d @temp-datasource.json \
            "$GRAFANA_SERVER/api/datasources")
        
        if echo "$RESPONSE" | grep -q '"id"'; then
            echo "✅ Datasource berhasil ditambahkan ke Grafana"
            DS_ID=$(echo "$RESPONSE" | jq -r '.id')
            echo "📋 Datasource ID: $DS_ID"
        else
            echo "⚠️  Gagal menambahkan datasource otomatis"
            echo "💡 Silakan tambahkan manual:"
            echo "   1. Login ke $GRAFANA_SERVER"
            echo "   2. Go to Configuration > Data Sources"
            echo "   3. Add new datasource: Prometheus"
            echo "   4. URL: $PROMETHEUS_SERVER"
        fi
    else
        echo "⚠️  API key tidak tersedia, silakan tambahkan datasource manual:"
        echo "   1. Login ke $GRAFANA_SERVER"
        echo "   2. Go to Configuration > Data Sources"
        echo "   3. Add new datasource: Prometheus"
        echo "   4. URL: $PROMETHEUS_SERVER"
        echo "   5. Set as default datasource"
    fi
    
    # Cleanup
    rm -f "./temp-datasource.json"
}

# Fungsi untuk mengimpor dashboard ke Grafana
import_dashboard_to_grafana() {
    echo "📈 Mengimpor dashboard ke Grafana..."
    
    if [ ! -f "$DASHBOARD_FILE" ]; then
        echo "❌ File dashboard tidak ditemukan: $DASHBOARD_FILE"
        return 1
    fi
    
    # Update dashboard dengan datasource ID yang benar
    cat "$DASHBOARD_FILE" | jq '
        .panels[] |= (
            .datasource.type = "prometheus" |
            .datasource.uid = "prometheus"
        )
    ' > "./temp-dashboard.json"
    
    # Import dashboard jika API key tersedia
    if [ -n "$GRAFANA_API_KEY" ]; then
        echo "🔑 Menggunakan API key untuk mengimpor dashboard..."
        
        RESPONSE=$(curl -s -X POST \
            -H "Authorization: Bearer $GRAFANA_API_KEY" \
            -H "Content-Type: application/json" \
            -d @temp-dashboard.json \
            "$GRAFANA_SERVER/api/dashboards/db")
        
        if echo "$RESPONSE" | grep -q '"slug"'; then
            echo "✅ Dashboard berhasil diimpor ke Grafana"
            DASHBOARD_URL=$(echo "$RESPONSE" | jq -r '.url')
            echo "🔗 Dashboard URL: $GRAFANA_SERVER$DASHBOARD_URL"
        else
            echo "⚠️  Gagal mengimpor dashboard otomatis"
            echo "💡 Silakan impor manual:"
            echo "   1. Login ke $GRAFANA_SERVER"
            echo "   2. Go to + > Import"
            echo "   3. Upload file: $DASHBOARD_FILE"
        fi
    else
        echo "⚠️  API key tidak tersedia, silakan impor dashboard manual:"
        echo "   1. Login ke $GRAFANA_SERVER"
        echo "   2. Go to + > Import"
        echo "   3. Upload file: $DASHBOARD_FILE"
        echo "   4. Select Prometheus datasource"
    fi
    
    # Cleanup
    rm -f "./temp-dashboard.json"
}

# Fungsi untuk menampilkan instruksi manual
show_manual_instructions() {
    echo ""
    echo "📋 INSTRUKSI MANUAL INTEGRASI GRAFANA"
    echo "====================================="
    echo ""
    echo "🔧 1. TAMBAHKAN DATASOURCE PROMETHEUS:"
    echo "   - Login ke $GRAFANA_SERVER"
    echo "   - Go to Configuration > Data Sources"
    echo "   - Click 'Add data source'"
    echo "   - Select 'Prometheus'"
    echo "   - URL: $PROMETHEUS_SERVER"
    echo "   - Click 'Save & Test'"
    echo "   - Set as default datasource"
    echo ""
    echo "📊 2. IMPOR DASHBOARD:"
    echo "   - Go to + > Import"
    echo "   - Click 'Upload JSON file'"
    echo "   - Upload file: $DASHBOARD_FILE"
    echo "   - Select Prometheus datasource"
    echo "   - Click 'Import'"
    echo ""
    echo "🔍 3. VERIFIKASI:"
    echo "   - Cek dashboard muncul di Grafana"
    echo "   - Pastikan semua panel menampilkan data"
    echo "   - Test refresh dan time range"
    echo ""
    echo "🔗 4. LINK BERGUNA:"
    echo "   - Grafana Home: $GRAFANA_SERVER"
    echo "   - Prometheus Targets: $PROMETHEUS_SERVER/targets"
    echo "   - Gate Metrics: http://localhost:9588/metrics"
    echo ""
}

# Fungsi untuk test dashboard queries
test_dashboard_queries() {
    echo "🧪 Testing dashboard queries..."
    
    echo "📊 Query 1: HTTP Request Rate"
    curl -s "$PROMETHEUS_SERVER/api/v1/query?query=rate(gate_http_requests_total[5m])" | jq '.data.result | length'
    
    echo "📈 Query 2: Response Time"
    curl -s "$PROMETHEUS_SERVER/api/v1/query?query=histogram_quantile(0.95, rate(gate_http_request_duration_seconds_bucket[5m]))" | jq '.data.result | length'
    
    echo "💾 Query 3: Memory Usage"
    curl -s "$PROMETHEUS_SERVER/api/v1/query?query=gate_memory_usage_bytes" | jq '.data.result | length'
    
    echo "🔐 Query 4: SSO Activity"
    curl -s "$PROMETHEUS_SERVER/api/v1/query?query=gate_sso_login_attempts_total" | jq '.data.result | length'
}

# Main execution
main() {
    echo "🎯 Memulai integrasi Gate dengan Grafana..."
    
    # Cek konektivitas
    if ! check_grafana_connectivity; then
        echo "❌ Tidak dapat melanjutkan karena Grafana server tidak dapat diakses"
        show_manual_instructions
        exit 1
    fi
    
    if ! check_prometheus_connectivity; then
        echo "❌ Tidak dapat melanjutkan karena Prometheus server tidak dapat diakses"
        show_manual_instructions
        exit 1
    fi
    
    # Tambahkan datasource
    add_datasource_to_grafana
    
    # Import dashboard
    import_dashboard_to_grafana
    
    # Test queries
    test_dashboard_queries
    
    echo ""
    echo "🎉 Integrasi Grafana selesai!"
    echo ""
    show_manual_instructions
}

# Jalankan script
main "$@"
