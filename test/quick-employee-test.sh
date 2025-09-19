#!/bin/bash

# Quick test untuk endpoint /employees/create
API_BASE_URL="http://localhost:9518"
JWT_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTViYWY0N2QtNGE2MS00MDYyLWIyMzAtZWEyZTZhNzZlNTAzIiwiaWF0IjoxNzU4MjYzMjAwLCJleHAiOjE3NTgzNDk2MDAsImF1ZCI6InN0cmluZyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9.SwDMMtL3Gi830u6znC94pCG75TpUrCVGhv6tIfv5Fyo"

echo "🚀 Quick Test: /api/employees/create"
echo "===================================="

# Test endpoint
RESPONSE=$(curl -s -X POST \
  "${API_BASE_URL}/api/employees/create" \
  -H "accept: application/json" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "employee_name": "Quick Test Employee",
    "employee_email": "quick.test@example.com",
    "title_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }')

echo "Response:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"

if echo "$RESPONSE" | grep -q '"success": true'; then
    echo ""
    echo "✅ SUCCESS: Endpoint /api/employees/create is working!"
elif echo "$RESPONSE" | grep -q "Invalid title_id"; then
    echo ""
    echo "⚠️  Endpoint working, but title_id invalid. Need to create valid test data."
else
    echo ""
    echo "❌ Something went wrong. Check the response above."
fi
