#!/bin/bash
# Script để xóa test container và deploy lại

set -e

echo "🧹 Cleaning up test environment..."
echo "=================================="

# Xác định deploy path (giống với CI/CD)
DEPLOY_PATH="${SSH_DEPLOY_PATH:-$HOME/ebay_ecommerce/fe_ecommerce_ebay/environment}"
DEPLOY_PATH="${DEPLOY_PATH/#\~/$HOME}"
DEPLOY_PATH_TEST="${DEPLOY_PATH}-test"

echo "📁 Test environment path: ${DEPLOY_PATH_TEST}"

# Kiểm tra docker-compose.test.yml có tồn tại không
if [ ! -f "${DEPLOY_PATH_TEST}/compose/docker-compose.test.yml" ]; then
    echo "⚠️  Warning: docker-compose.test.yml not found at ${DEPLOY_PATH_TEST}/compose/"
    echo "💡 Trying fallback location: ${DEPLOY_PATH}/compose/docker-compose.test.yml"
    if [ -f "${DEPLOY_PATH}/compose/docker-compose.test.yml" ]; then
        DEPLOY_PATH_TEST="${DEPLOY_PATH}"
        echo "✅ Found at fallback location"
    else
        echo "❌ Error: docker-compose.test.yml not found!"
        exit 1
    fi
fi

# Stop và xóa test container
echo ""
echo "🛑 Stopping and removing test container..."
cd "${DEPLOY_PATH_TEST}" || {
    echo "❌ Error: Cannot access test environment directory: ${DEPLOY_PATH_TEST}"
    exit 1
}

# Stop và remove container
docker compose -f compose/docker-compose.test.yml down || {
    echo "⚠️  Warning: Failed to stop test container (might not exist)"
}

# Xóa container nếu vẫn còn tồn tại
if docker ps -a | grep -q "ebay_ecommerce-nextjs-test"; then
    echo "🗑️  Removing test container..."
    docker rm -f ebay_ecommerce-nextjs-test || true
fi

echo "✅ Test container removed"

# Pull image mới
echo ""
echo "📥 Pulling latest image..."
docker pull quy123zz/ebay_ecom:frontend-latest || {
    echo "⚠️  Warning: Failed to pull image, using existing"
}

# Deploy lại test container
echo ""
echo "🚀 Deploying test container..."
docker compose -f compose/docker-compose.test.yml up -d --force-recreate || {
    echo "❌ Error: Failed to deploy test container"
    exit 1
}

# Kiểm tra container
echo ""
echo "🏥 Checking container status..."
sleep 5
if docker ps | grep -q "ebay_ecommerce-nextjs-test"; then
    echo "✅ Test container is running"
    docker compose -f compose/docker-compose.test.yml ps
    
    # Kiểm tra port
    echo ""
    echo "🔍 Checking container port..."
    docker exec ebay_ecommerce-nextjs-test printenv | grep PORT || echo "⚠️  PORT not set"
    
    # Test connection
    echo ""
    echo "🧪 Testing connection..."
    if docker exec ebay_ecommerce-nginx-prod wget -q -O- http://ebay_ecommerce-nextjs-test:3001/ 2>/dev/null | head -n 1 > /dev/null; then
        echo "✅ Connection successful"
    else
        echo "⚠️  Connection test failed (might be normal if app is still starting)"
    fi
else
    echo "❌ Test container failed to start"
    docker compose -f compose/docker-compose.test.yml logs
    exit 1
fi

# Reload nginx
echo ""
echo "🔄 Reloading nginx..."
if docker ps | grep -q "ebay_ecommerce-nginx-prod"; then
    if docker exec ebay_ecommerce-nginx-prod nginx -t 2>/dev/null; then
        docker exec ebay_ecommerce-nginx-prod nginx -s reload
        echo "✅ Nginx reloaded"
    else
        echo "⚠️  Warning: Nginx config test failed"
        docker exec ebay_ecommerce-nginx-prod nginx -t
    fi
else
    echo "⚠️  Warning: Nginx container not running"
fi

echo ""
echo "✅ Test environment redeployed successfully!"
echo ""
echo "📊 Container status:"
docker ps | grep -E "test|nginx-prod" || true

