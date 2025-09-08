#!/bin/bash

# Script untuk mengontrol akses Swagger
# Usage: ./scripts/swagger-control.sh [enable|disable|status]

SWAGGER_ENV_FILE=".env"

# Fungsi untuk menampilkan bantuan
show_help() {
    echo "Swagger Control Script"
    echo "====================="
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  enable   - Mengaktifkan Swagger"
    echo "  disable  - Menonaktifkan Swagger"
    echo "  status   - Menampilkan status Swagger"
    echo "  help     - Menampilkan bantuan ini"
    echo ""
    echo "Examples:"
    echo "  $0 enable"
    echo "  $0 disable"
    echo "  $0 status"
}

# Fungsi untuk mengaktifkan Swagger
enable_swagger() {
    echo "Mengaktifkan Swagger..."
    
    if [ -f "$SWAGGER_ENV_FILE" ]; then
        # Update file .env yang sudah ada
        if grep -q "SWAGGER_ENABLED" "$SWAGGER_ENV_FILE"; then
            sed -i '' 's/SWAGGER_ENABLED=.*/SWAGGER_ENABLED=true/' "$SWAGGER_ENV_FILE"
        else
            echo "SWAGGER_ENABLED=true" >> "$SWAGGER_ENV_FILE"
        fi
    else
        # Buat file .env baru
        echo "SWAGGER_ENABLED=true" > "$SWAGGER_ENV_FILE"
    fi
    
    echo "✅ Swagger telah diaktifkan!"
    echo "📖 Dokumentasi tersedia di: http://localhost:3000/documentation"
    echo "🔄 Restart aplikasi untuk menerapkan perubahan"
}

# Fungsi untuk menonaktifkan Swagger
disable_swagger() {
    echo "Menonaktifkan Swagger..."
    
    if [ -f "$SWAGGER_ENV_FILE" ]; then
        # Update file .env yang sudah ada
        if grep -q "SWAGGER_ENABLED" "$SWAGGER_ENV_FILE"; then
            sed -i '' 's/SWAGGER_ENABLED=.*/SWAGGER_ENABLED=false/' "$SWAGGER_ENV_FILE"
        else
            echo "SWAGGER_ENABLED=false" >> "$SWAGGER_ENV_FILE"
        fi
    else
        # Buat file .env baru
        echo "SWAGGER_ENABLED=false" > "$SWAGGER_ENV_FILE"
    fi
    
    echo "❌ Swagger telah dinonaktifkan!"
    echo "🔄 Restart aplikasi untuk menerapkan perubahan"
}

# Fungsi untuk menampilkan status Swagger
show_status() {
    echo "Status Konfigurasi Swagger"
    echo "=========================="
    
    if [ -f "$SWAGGER_ENV_FILE" ]; then
        if grep -q "SWAGGER_ENABLED" "$SWAGGER_ENV_FILE"; then
            SWAGGER_STATUS=$(grep "SWAGGER_ENABLED" "$SWAGGER_ENV_FILE" | cut -d'=' -f2)
            echo "📁 File .env: ✅ Ditemukan"
            echo "🔧 SWAGGER_ENABLED: $SWAGGER_STATUS"
            
            case $SWAGGER_STATUS in
                "true")
                    echo "📖 Status: ✅ AKTIF"
                    echo "🌐 URL: http://localhost:3000/documentation"
                    ;;
                "false")
                    echo "📖 Status: ❌ NONAKTIF"
                    ;;
                "development")
                    echo "📖 Status: 🔄 HANYA DI DEVELOPMENT"
                    ;;
                *)
                    echo "📖 Status: ❓ TIDAK DIKETAHUI"
                    ;;
            esac
        else
            echo "📁 File .env: ✅ Ditemukan"
            echo "🔧 SWAGGER_ENABLED: ❌ Tidak diset"
            echo "📖 Status: 🔄 DEFAULT (hanya di development)"
        fi
    else
        echo "📁 File .env: ❌ Tidak ditemukan"
        echo "🔧 SWAGGER_ENABLED: ❌ Tidak diset"
        echo "📖 Status: 🔄 DEFAULT (hanya di development)"
    fi
    
    echo ""
    echo "💡 Tips:"
    echo "  - Gunakan '$0 enable' untuk mengaktifkan"
    echo "  - Gunakan '$0 disable' untuk menonaktifkan"
    echo "  - Restart aplikasi setelah mengubah konfigurasi"
}

# Main script
case "$1" in
    "enable")
        enable_swagger
        ;;
    "disable")
        disable_swagger
        ;;
    "status")
        show_status
        ;;
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    *)
        echo "❌ Error: Command tidak dikenal '$1'"
        echo ""
        show_help
        exit 1
        ;;
esac 