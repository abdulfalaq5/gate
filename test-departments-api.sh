#!/bin/bash

# Test script untuk endpoint departments dengan fitur filter dan pagination yang sudah diupdate
# Base URL
BASE_URL="http://localhost:9588/api/v1"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTBiM2NiNS04NmJhLTQ3NmEtYjc3Ny1iMjk4OTJhNmIwOWUiLCJmdWxsX25hbWUiOiIiLCJyb2xlcyI6WyJTdXBlciBBZG1pbiIsImJhY2tvZmZpY2UiXSwianRpIjoiODU0NTZkZTQtMTVmZi00NjhhLTljMzktOTljNTUyNzVmNzA4IiwiZXhwIjoxNzU3NDA3MDM3LCJpYXQiOjE3NTczNjM4Mzd9.aY8EAPQ3bCe1IAUy9FZU0QBPrKSBP5c2pgPhfNQLItE"

echo "=== Testing Departments API dengan Filter dan Pagination ==="
echo ""

# Test 1: Basic pagination
echo "1. Test Basic Pagination (page=1, limit=10, is_delete=false):"
curl -X 'GET' \
  "${BASE_URL}/departments?page=1&limit=10&is_delete=false" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 2: Search functionality
echo "2. Test Search Functionality (search='department'):"
curl -X 'GET' \
  "${BASE_URL}/departments?search=department&page=1&limit=5" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 3: Sorting
echo "3. Test Sorting (sort_by=department_name, sort_order=desc):"
curl -X 'GET' \
  "${BASE_URL}/departments?sort_by=department_name&sort_order=desc&page=1&limit=5" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 4: Filter by company_id
echo "4. Test Filter by Company ID:"
curl -X 'GET' \
  "${BASE_URL}/departments?company_id=8a0b3cb5-86ba-476a-b777-b29892a6b09e&page=1&limit=5" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 5: Date range filtering
echo "5. Test Date Range Filtering (start_date=2024-01-01):"
curl -X 'GET' \
  "${BASE_URL}/departments?start_date=2024-01-01T00:00:00Z&page=1&limit=5" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 6: Combined filters
echo "6. Test Combined Filters (search + sort + pagination):"
curl -X 'GET' \
  "${BASE_URL}/departments?search=hr&sort_by=created_at&sort_order=desc&page=1&limit=3&is_delete=false" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 7: Get department by ID
echo "7. Test Get Department by ID (menggunakan ID dari response sebelumnya):"
echo "Note: Ganti dengan ID yang valid dari database"
curl -X 'GET' \
  "${BASE_URL}/departments/8a0b3cb5-86ba-476a-b777-b29892a6b09e" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 8: Get departments by company
echo "8. Test Get Departments by Company:"
curl -X 'GET' \
  "${BASE_URL}/departments/company/8a0b3cb5-86ba-476a-b777-b29892a6b09e" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""
echo "=== Testing Complete ==="
