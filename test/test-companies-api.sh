#!/bin/bash

# Test script untuk endpoint companies dengan fitur filter dan pagination yang sudah diupdate
# Base URL
BASE_URL="http://localhost:9588/api/v1"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTBiM2NiNS04NmJhLTQ3NmEtYjc3Ny1iMjk4OTJhNmIwOWUiLCJmdWxsX25hbWUiOiIiLCJyb2xlcyI6WyJTdXBlciBBZG1pbiIsImJhY2tvZmZpY2UiXSwianRpIjoiN2Q5Y2ZmNzUtNTAzNS00MjlhLWE4YmYtMTQ2Y2JmYWZmZjI1IiwiZXhwIjoxNzU3NDA2NzQ2LCJpYXQiOjE3NTczNjM1NDZ9.2peqLiNbqWtGunEYL2kE_EPy8DwRu1N2_-sSaiWWwGg"

echo "=== Testing Companies API dengan Filter dan Pagination ==="
echo ""

# Test 1: Basic pagination
echo "1. Test Basic Pagination (page=1, limit=10, is_delete=false):"
curl -X 'GET' \
  "${BASE_URL}/companies?page=1&limit=10&is_delete=false" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 2: Search functionality
echo "2. Test Search Functionality (search='company'):"
curl -X 'GET' \
  "${BASE_URL}/companies?search=company&page=1&limit=5" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 3: Sorting
echo "3. Test Sorting (sort_by=company_name, sort_order=desc):"
curl -X 'GET' \
  "${BASE_URL}/companies?sort_by=company_name&sort_order=desc&page=1&limit=5" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 4: Date range filtering
echo "4. Test Date Range Filtering (start_date=2024-01-01):"
curl -X 'GET' \
  "${BASE_URL}/companies?start_date=2024-01-01T00:00:00Z&page=1&limit=5" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 5: Combined filters
echo "5. Test Combined Filters (search + sort + pagination):"
curl -X 'GET' \
  "${BASE_URL}/companies?search=test&sort_by=created_at&sort_order=desc&page=1&limit=3&is_delete=false" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 6: Get company by ID
echo "6. Test Get Company by ID (menggunakan ID dari response sebelumnya):"
echo "Note: Ganti dengan ID yang valid dari database"
curl -X 'GET' \
  "${BASE_URL}/companies/8a0b3cb5-86ba-476a-b777-b29892a6b09e" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 7: Company hierarchy
echo "7. Test Company Hierarchy:"
curl -X 'GET' \
  "${BASE_URL}/companies/hierarchy" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""

# Test 8: Company statistics
echo "8. Test Company Statistics:"
curl -X 'GET' \
  "${BASE_URL}/companies/stats" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer ${TOKEN}" \
  -w "\nHTTP Status: %{http_code}\n\n"

echo ""
echo "=== Testing Complete ==="
