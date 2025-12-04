#!/bin/bash

# Create admin user using curl
# First, sign up the user
echo "Signing up admin user..."

RESPONSE=$(curl -X POST http://localhost:5001/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{
    "email": "admin@ima.com",
    "password": "adminUser123",
    "name": "Admin User"
  }' \
  -c /tmp/auth-cookies.txt \
  -w "\n%{http_code}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 200 ] || [ "$HTTP_CODE" -eq 201 ]; then
  echo "✅ User signed up successfully!"
  echo "Now updating role to admin..."
  
  # Get the user ID from the response (you may need to adjust this based on actual response format)
  USER_ID=$(echo "$BODY" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  if [ -z "$USER_ID" ]; then
    echo "⚠️  Could not extract user ID. Please update the role manually using SQL:"
    echo "   UPDATE users SET role = 'admin' WHERE email = 'admin@ima.com';"
  else
    echo "User ID: $USER_ID"
    echo "Please update the role manually using SQL:"
    echo "   UPDATE users SET role = 'admin' WHERE email = 'admin@ima.com';"
  fi
else
  echo "❌ Sign up failed with HTTP $HTTP_CODE"
  echo "Response: $BODY"
  exit 1
fi
