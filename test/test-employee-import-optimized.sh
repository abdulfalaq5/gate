#!/bin/bash

# Test script for optimized employee import API
# This script tests the import functionality with a smaller CSV file

# Configuration
BASE_URL="http://localhost:9518"
API_ENDPOINT="/api/employees/import"
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMmVkYWFkNzMtZjBlMC00YWYxLThkZmMtNzkwMzAyMDYxY2Y5IiwiaWF0IjoxNzU4MDgzOTc4LCJleHAiOjE3NTgxNzAzNzgsImF1ZCI6InN0cmluZyIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCJ9.wbHBJ6TCrI20V2Vj0_Bt9DzwlE-WPZwBF0UKPtFp-o0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Testing Optimized Employee Import API ===${NC}"
echo "Base URL: $BASE_URL"
echo "Endpoint: $API_ENDPOINT"
echo ""

# Check if test file exists
TEST_FILE="../test_employee_small.csv"
if [ ! -f "$TEST_FILE" ]; then
    echo -e "${RED}Error: Test file $TEST_FILE not found${NC}"
    exit 1
fi

echo -e "${YELLOW}Test file: $TEST_FILE${NC}"
echo "File size: $(wc -l < "$TEST_FILE") lines"
echo ""

# Test 1: Import with small CSV file
echo -e "${YELLOW}Test 1: Import small CSV file (5 employees)${NC}"
echo "Starting import..."

START_TIME=$(date +%s)

RESPONSE=$(curl -s -w "\n%{http_code}" -X 'POST' \
  "$BASE_URL$API_ENDPOINT" \
  -H 'accept: application/json' \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: multipart/form-data' \
  -F "file=@$TEST_FILE;type=text/csv")

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Split response and status code
HTTP_STATUS=$(echo "$RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$RESPONSE" | head -n -1)

echo "HTTP Status: $HTTP_STATUS"
echo "Duration: ${DURATION}s"
echo ""

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ Import successful!${NC}"
    echo "Response:"
    echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
else
    echo -e "${RED}✗ Import failed with status $HTTP_STATUS${NC}"
    echo "Response:"
    echo "$RESPONSE_BODY"
fi

echo ""
echo -e "${YELLOW}=== Test Summary ===${NC}"
echo "Duration: ${DURATION}s"
echo "HTTP Status: $HTTP_STATUS"

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ Test passed - Import completed successfully${NC}"
else
    echo -e "${RED}✗ Test failed${NC}"
    exit 1
fi
