#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 TravelMate Launcher${NC}"

# 1. Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# 2. Start Mock Backend
echo -e "\n${BLUE}📦 Starting Mock Backend...${NC}"

# Try using 'docker compose' (v2) first, fallback to 'docker-compose' (v1)
if docker compose version > /dev/null 2>&1; then
    docker compose up -d
else
    docker-compose up -d
fi

# Check if command succeeded
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Failed to start backend containers.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend is running on http://localhost:4000${NC}"

# 3. Start Expo Frontend
echo -e "\n${BLUE}📱 Starting TravelMate Frontend...${NC}"
echo -e "Press 'i' for iOS simulator, 'a' for Android emulator, or scan QR code."

npx expo start
