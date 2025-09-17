#!/bin/bash

# Test Script untuk Standard Filter System
# Pastikan server sudah running di localhost:9588

BASE_URL="http://localhost:9588/api/v1"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4YTBiM2NiNS04NmJhLTQ3NmEtYjc3Ny1iMjk4OTJhNmIwOWUiLCJmdWxsX25hbWUiOiIiLCJyb2xlcyI6WyJTdXBlciBBZG1pbiIsImJhY2tvZmZpY2UiXSwianRpIjoiMmU1MzliN2UtZGU5YS00MTEwLWI4ZmItNDNmYmQ5MWIwZGE0IiwiZXhwIjoxNzU3NDA1MTYwLCJpYXQiOjE3NTczNjE5NjB9.HC0PaTl56JdPlimmsTLqqUffILFWZ3Ei_oGmtJu3KeA"

echo "=== Testing Standard Filter System ==="
echo ""

# Test 1: Basic pagination
echo "1. Testing Basic Pagination (page=1, limit=5)"
curl -X GET "${BASE_URL}/menus?page=1&limit=5" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'
echo ""

# Test 2: Sorting
echo "2. Testing Sorting (sort_by=menu_name, sort_order=asc)"
curl -X GET "${BASE_URL}/menus?sort_by=menu_name&sort_order=asc" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'
echo ""

# Test 3: Searching
echo "3. Testing Search (search=dashboard)"
curl -X GET "${BASE_URL}/menus?search=dashboard" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'
echo ""

# Test 4: Filtering
echo "4. Testing Filter (menu_name=Dashboard)"
curl -X GET "${BASE_URL}/menus?menu_name=Dashboard" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'
echo ""

# Test 5: Combined filters
echo "5. Testing Combined Filters (page=1&limit=3&sort_by=menu_order&sort_order=asc&search=admin)"
curl -X GET "${BASE_URL}/menus?page=1&limit=3&sort_by=menu_order&sort_order=asc&search=admin" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'
echo ""

# Test 6: Roles endpoint
echo "6. Testing Roles endpoint with filters"
curl -X GET "${BASE_URL}/roles?page=1&limit=5&sort_by=role_name&sort_order=asc" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'
echo ""

# Test 7: Permissions endpoint
echo "7. Testing Permissions endpoint with filters"
curl -X GET "${BASE_URL}/permissions?page=1&limit=5&sort_by=permission_name&sort_order=asc" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'
echo ""

# Test 8: Invalid parameters (should fallback to defaults)
echo "8. Testing Invalid Parameters (should fallback to defaults)"
curl -X GET "${BASE_URL}/menus?sort_by=invalid_column&sort_order=invalid_order&page=0&limit=1000" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${TOKEN}" \
  | jq '.'
echo ""

echo "=== Test completed ==="
