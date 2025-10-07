#!/bin/bash

# Script untuk mengimport semua dashboard Grafana yang telah dibuat
# Pastikan Grafana server sudah berjalan dan akses tersedia

echo "🚀 IMPORTING ALL GRAFANA DASHBOARDS"
echo "=================================="
echo ""

# Konfigurasi
GRAFANA_SERVER="https://grafana.motorsights.com"
GRAFANA_API_KEY=""  # Masukkan API key Grafana di sini jika ada
DASHBOARDS_DIR="./monitoring/grafana/dashboards"

echo "📋 Konfigurasi:"
echo "  - Grafana Server: $GRAFANA_SERVER"
echo "  - Dashboards Directory: $DASHBOARDS_DIR"
echo "  - API Key: ${GRAFANA_API_KEY:+[SET]}${GRAFANA_API_KEY:-[NOT SET]}"
echo ""

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

# Fungsi untuk import dashboard
import_dashboard() {
    local dashboard_file="$1"
    local dashboard_name=$(basename "$dashboard_file" .json)
    
    echo "📊 Importing dashboard: $dashboard_name"
    
    if [ ! -f "$dashboard_file" ]; then
        echo "❌ File dashboard tidak ditemukan: $dashboard_file"
        return 1
    fi
    
    # Update dashboard dengan datasource ID yang benar
    local temp_file="/tmp/temp-dashboard-${dashboard_name}.json"
    cat "$dashboard_file" | jq '
        .panels[] |= (
            .datasource.type = "prometheus" |
            .datasource.uid = "prometheus"
        )
    ' > "$temp_file"
    
    # Import dashboard jika API key tersedia
    if [ -n "$GRAFANA_API_KEY" ]; then
        echo "🔑 Menggunakan API key untuk mengimport dashboard..."
        
        RESPONSE=$(curl -s -X POST \
            -H "Authorization: Bearer $GRAFANA_API_KEY" \
            -H "Content-Type: application/json" \
            -d @"$temp_file" \
            "$GRAFANA_SERVER/api/dashboards/db")
        
        if echo "$RESPONSE" | grep -q '"slug"'; then
            echo "✅ Dashboard '$dashboard_name' berhasil diimpor"
            DASHBOARD_URL=$(echo "$RESPONSE" | jq -r '.url')
            echo "🔗 Dashboard URL: $GRAFANA_SERVER$DASHBOARD_URL"
            return 0
        else
            echo "⚠️  Gagal mengimpor dashboard '$dashboard_name'"
            echo "💡 Response: $RESPONSE"
            return 1
        fi
    else
        echo "⚠️  API key tidak tersedia, silakan import manual:"
        echo "   1. Login ke $GRAFANA_SERVER"
        echo "   2. Go to + > Import"
        echo "   3. Upload file: $dashboard_file"
        echo "   4. Select Prometheus datasource"
        return 1
    fi
    
    # Cleanup
    rm -f "$temp_file"
}

# Fungsi untuk import semua dashboard
import_all_dashboards() {
    echo "📊 Mengimport semua dashboard..."
    
    local dashboards=(
        "gate-comprehensive-dashboard.json"
        "gate-sso-dashboard.json"
        "gate-business-dashboard.json"
        "gate-system-health-dashboard.json"
        "gate-application-dashboard.json"
    )
    
    local success_count=0
    local total_count=${#dashboards[@]}
    
    for dashboard in "${dashboards[@]}"; do
        local dashboard_path="$DASHBOARDS_DIR/$dashboard"
        
        if import_dashboard "$dashboard_path"; then
            ((success_count++))
        fi
        
        echo ""
    done
    
    echo "📈 Import Summary:"
    echo "  - Total dashboards: $total_count"
    echo "  - Successfully imported: $success_count"
    echo "  - Failed: $((total_count - success_count))"
}

# Fungsi untuk menampilkan instruksi manual
show_manual_instructions() {
    echo ""
    echo "📋 MANUAL IMPORT INSTRUCTIONS"
    echo "============================="
    echo ""
    echo "Jika import otomatis gagal, ikuti langkah manual berikut:"
    echo ""
    
    local dashboards=(
        "gate-comprehensive-dashboard.json:Gate Application - Comprehensive Monitoring"
        "gate-sso-dashboard.json:Gate SSO Monitoring"
        "gate-business-dashboard.json:Gate Business Operations Monitoring"
        "gate-system-health-dashboard.json:Gate System Health & Performance"
        "gate-application-dashboard.json:Gate Application Monitoring"
    )
    
    for dashboard_info in "${dashboards[@]}"; do
        IFS=':' read -r file title <<< "$dashboard_info"
        echo "🔹 $title:"
        echo "   File: $DASHBOARDS_DIR/$file"
        echo ""
    done
    
    echo "📋 Langkah Import Manual:"
    echo "   1. Login ke Grafana: $GRAFANA_SERVER"
    echo "   2. Go to + > Import"
    echo "   3. Upload JSON file dari daftar di atas"
    echo "   4. Select 'Prometheus' sebagai datasource"
    echo "   5. Set folder: 'Gate Application'"
    echo "   6. Click 'Import'"
    echo ""
}

# Fungsi untuk menampilkan link dashboard
show_dashboard_links() {
    echo ""
    echo "🔗 DASHBOARD LINKS"
    echo "=================="
    echo ""
    echo "Setelah import berhasil, dashboard dapat diakses di:"
    echo ""
    echo "📊 Comprehensive Monitoring:"
    echo "   $GRAFANA_SERVER/d/gate-comprehensive/gate-application-comprehensive-monitoring"
    echo ""
    echo "🔐 SSO Monitoring:"
    echo "   $GRAFANA_SERVER/d/gate-sso/gate-sso-monitoring"
    echo ""
    echo "💼 Business Operations:"
    echo "   $GRAFANA_SERVER/d/gate-business/gate-business-operations-monitoring"
    echo ""
    echo "🏥 System Health:"
    echo "   $GRAFANA_SERVER/d/gate-system-health/gate-system-health-performance"
    echo ""
    echo "📈 Application Overview:"
    echo "   $GRAFANA_SERVER/d/gate-application/gate-application-monitoring"
    echo ""
}

# Fungsi untuk verifikasi datasource
verify_datasource() {
    echo "🔍 Verifying Prometheus datasource..."
    
    if [ -n "$GRAFANA_API_KEY" ]; then
        RESPONSE=$(curl -s -H "Authorization: Bearer $GRAFANA_API_KEY" \
            "$GRAFANA_SERVER/api/datasources")
        
        if echo "$RESPONSE" | grep -q '"type":"prometheus"'; then
            echo "✅ Prometheus datasource ditemukan"
            DS_NAME=$(echo "$RESPONSE" | jq -r '.[] | select(.type=="prometheus") | .name' | head -1)
            echo "📊 Datasource name: $DS_NAME"
        else
            echo "⚠️  Prometheus datasource tidak ditemukan"
            echo "💡 Silakan tambahkan Prometheus datasource terlebih dahulu:"
            echo "   1. Go to Configuration > Data Sources"
            echo "   2. Add new datasource: Prometheus"
            echo "   3. URL: https://prometheus.motorsights.com"
            echo "   4. Set as default datasource"
        fi
    else
        echo "⚠️  API key tidak tersedia, tidak dapat verify datasource"
        echo "💡 Pastikan Prometheus datasource sudah ditambahkan di Grafana"
    fi
}

# Main execution
main() {
    echo "🎯 Memulai import dashboard Grafana..."
    
    # Cek konektivitas
    if ! check_grafana_connectivity; then
        echo "❌ Tidak dapat melanjutkan karena Grafana server tidak dapat diakses"
        show_manual_instructions
        exit 1
    fi
    
    # Verifikasi datasource
    verify_datasource
    
    echo ""
    
    # Import semua dashboard
    import_all_dashboards
    
    # Tampilkan link dashboard
    show_dashboard_links
    
    # Tampilkan instruksi manual jika diperlukan
    show_manual_instructions
    
    echo ""
    echo "🎉 DASHBOARD IMPORT COMPLETED!"
    echo "============================="
    echo ""
    echo "📊 Dashboard yang tersedia:"
    echo "  ✅ Gate Application - Comprehensive Monitoring"
    echo "  ✅ Gate SSO Monitoring"
    echo "  ✅ Gate Business Operations Monitoring"
    echo "  ✅ Gate System Health & Performance"
    echo "  ✅ Gate Application Monitoring (Basic)"
    echo ""
    echo "🔗 Akses dashboard di: $GRAFANA_SERVER"
    echo ""
}

# Jalankan script
main "$@"
