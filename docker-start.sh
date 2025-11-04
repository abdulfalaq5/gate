#!/bin/bash

# Script untuk menjalankan Docker Gateway API

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    print_info "Creating .env from config/environment.example..."
    cp config/environment.example .env
    print_warn "Please edit .env file and update the configuration!"
    exit 1
fi

# Function to show menu
show_menu() {
    echo ""
    echo "================================="
    echo "   Gateway API Docker Manager"
    echo "================================="
    echo "1. Start Production API (Port 9509)"
    echo "2. Start Development API (Port 9513)"
    echo "3. Start All Services (Prod + Dev + Database + Nginx)"
    echo "4. Stop All Services"
    echo "5. Restart All Services"
    echo "6. View Logs"
    echo "7. View Status"
    echo "8. Run Database Migration"
    echo "9. Clean Up (Remove containers and volumes)"
    echo "0. Exit"
    echo "================================="
    echo ""
}

# Function to start production
start_production() {
    print_info "Starting Production API on port 9509..."
    docker-compose -f docker-compose.prod.yml up -d --build
    print_info "Production API started successfully!"
    docker-compose -f docker-compose.prod.yml ps
}

# Function to start development
start_development() {
    print_info "Starting Development API on port 9513..."
    docker-compose -f docker-compose.dev.yml up -d --build
    print_info "Development API started successfully!"
    docker-compose -f docker-compose.dev.yml ps
}

# Function to start all services
start_all() {
    print_info "Starting all services..."
    docker-compose up -d --build
    print_info "All services started successfully!"
    docker-compose ps
}

# Function to stop all
stop_all() {
    print_info "Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.prod.yml down
    docker-compose -f docker-compose.dev.yml down
    print_info "All services stopped!"
}

# Function to restart all
restart_all() {
    print_info "Restarting all services..."
    docker-compose restart
    print_info "All services restarted!"
}

# Function to view logs
view_logs() {
    echo ""
    echo "Which service logs do you want to see?"
    echo "1. Production API"
    echo "2. Development API"
    echo "3. Database"
    echo "4. Nginx"
    echo "5. All"
    read -p "Enter choice [1-5]: " log_choice
    
    case $log_choice in
        1) docker-compose logs -f api ;;
        2) docker-compose logs -f api-dev ;;
        3) docker-compose logs -f database ;;
        4) docker-compose logs -f nginx ;;
        5) docker-compose logs -f ;;
        *) print_error "Invalid choice!" ;;
    esac
}

# Function to view status
view_status() {
    echo ""
    print_info "Container Status:"
    docker-compose ps
    echo ""
    print_info "Resource Usage:"
    docker stats --no-stream
}

# Function to run migration
run_migration() {
    print_info "Running database migrations..."
    
    # Check which services are running
    if docker ps | grep -q gate-api-production; then
        print_info "Running migration on Production API..."
        docker-compose -f docker-compose.prod.yml exec api npm run migrate
    elif docker ps | grep -q gate-api-development; then
        print_info "Running migration on Development API..."
        docker-compose -f docker-compose.dev.yml exec api-dev npm run migrate
    else
        print_error "No running containers found!"
        print_warn "Please start the services first!"
    fi
}

# Function to clean up
clean_up() {
    print_warn "This will remove all containers and volumes!"
    read -p "Are you sure? [y/N]: " confirm
    
    if [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]]; then
        print_info "Stopping and removing all containers..."
        docker-compose down -v
        docker-compose -f docker-compose.prod.yml down -v
        docker-compose -f docker-compose.dev.yml down -v
        print_info "Clean up completed!"
    else
        print_info "Clean up cancelled."
    fi
}

# Main menu loop
while true; do
    show_menu
    read -p "Enter your choice [0-9]: " choice
    
    case $choice in
        1) start_production ;;
        2) start_development ;;
        3) start_all ;;
        4) stop_all ;;
        5) restart_all ;;
        6) view_logs ;;
        7) view_status ;;
        8) run_migration ;;
        9) clean_up ;;
        0) 
            print_info "Exiting..."
            exit 0
            ;;
        *)
            print_error "Invalid option!"
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done

