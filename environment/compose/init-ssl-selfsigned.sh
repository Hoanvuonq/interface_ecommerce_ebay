#!/bin/bash

# ============================================
# Setup Self-Signed SSL Certificate
# Dùng tạm để test, sau này thay bằng Paid SSL
# ============================================

set -e

echo "🔐 Setup Self-Signed SSL Certificate..."
echo ""

# Đường dẫn
SSL_DIR="../nginx/ssl/live/calatha.com"

# Tạo thư mục
echo "📁 Tạo thư mục SSL..."
mkdir -p ${SSL_DIR}
mkdir -p ${SSL_DIR}/../backup

# Backup cert cũ nếu có
if [ -f "${SSL_DIR}/fullchain.pem" ]; then
    echo "💾 Backup certificate cũ..."
    cp ${SSL_DIR}/fullchain.pem ${SSL_DIR}/../backup/fullchain.pem.$(date +%Y%m%d_%H%M%S)
    cp ${SSL_DIR}/privkey.pem ${SSL_DIR}/../backup/privkey.pem.$(date +%Y%m%d_%H%M%S)
fi

# Tạo self-signed certificate
echo "🔑 Tạo Self-Signed Certificate (valid 365 ngày)..."
openssl req -x509 -nodes -newkey rsa:4096 -days 365 \
    -keyout ${SSL_DIR}/privkey.pem \
    -out ${SSL_DIR}/fullchain.pem \
    -subj "/CN=calatha.com/O=EcomEbay/C=VN" \
    2>/dev/null

# Set permissions
echo "🔒 Set permissions..."
chmod 600 ${SSL_DIR}/privkey.pem
chmod 644 ${SSL_DIR}/fullchain.pem

# Verify
echo ""
echo "✅ Certificate created successfully!"
echo ""
echo "📜 Certificate info:"
openssl x509 -in ${SSL_DIR}/fullchain.pem -noout -subject -dates
echo ""

# Restart nginx
echo "🔄 Restarting nginx..."
docker restart ebay_ecommerce-nginx-prod 2>/dev/null || {
    echo "⚠️  Nginx chưa chạy, start nginx..."
    docker compose -f docker-compose.prod.yml up -d nginx
}

echo ""
echo "🎉 DONE! SSL setup hoàn tất!"
echo ""
echo "📝 Test HTTPS:"
echo "   curl -k -I https://calatha.com"
echo "   curl -k -I https://api.calatha.com"
echo ""
echo "⚠️  NOTE: Browser sẽ hiện warning (self-signed cert)"
echo "   → Cookies vẫn hoạt động bình thường!"
echo ""
echo "📚 Để thay bằng Paid SSL, xem: PAID_SSL_SETUP.md"
