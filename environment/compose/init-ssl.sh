#!/bin/bash

# ============================================
# Lấy SSL Certificate miễn phí từ Let's Encrypt
# ============================================

set -e  # Exit on error

echo "🔐 Bắt đầu lấy SSL certificate từ Let's Encrypt..."

DOMAINS="calatha.com api.calatha.com"
EMAIL="quythanhhuynh2003@gmail.com"

echo "📧 Email: $EMAIL"
echo "🌐 Domains: $DOMAINS"
echo ""

# Kiểm tra email
if [ "$EMAIL" = "your-email@gmail.com" ]; then
    echo "❌ VUI LÒNG THAY ĐỔI EMAIL TRONG FILE NÀY!"
    exit 1
fi

# Tạo thư mục certbot
echo "📁 Tạo thư mục certbot..."
mkdir -p ../nginx/certbot/www
mkdir -p ../nginx/ssl

# Nếu chưa có certificate → tạo dummy để nginx chạy được
if [ ! -f "../nginx/ssl/live/calatha.com/fullchain.pem" ]; then
    echo "⚠️  Chưa có certificate → tạo Dummy..."
    chmod +x ./init-ssl-selfsigned.sh
    ./init-ssl-selfsigned.sh
fi

# Kiểm tra Nginx
echo "🔍 Kiểm tra nginx..."
if ! docker ps | grep -q ebay_ecommerce-nginx-prod; then
    echo "⚠️ Nginx chưa chạy → khởi động..."
    docker compose -f docker-compose.prod.yml up -d nginx
    echo "⏳ Đợi nginx khởi động..."
    sleep 5
fi

echo "🔐 Đang lấy SSL certificate..."
echo ""

# Nếu đang dùng Dummy Cert thì xoá nó
# ⚠️ COMMENT OUT: Không xoá file để tránh Nginx bị crash nếu lỡ restart
# if openssl x509 -in "../nginx/ssl/live/calatha.com/fullchain.pem" -issuer -noout 2>/dev/null | grep -q "EcomEbay"; then
#     echo "🧹 Phát hiện Dummy Certificate → xoá..."
#     rm -rf ../nginx/ssl/live/calatha.com
#     rm -rf ../nginx/ssl/archive/calatha.com
#     rm -rf ../nginx/ssl/renewal/calatha.com.conf
#     echo "✅ Dummy đã được xoá!"
# fi

# ======================
# LỆNH CERTBOT CHUẨN
# ======================
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
    --verbose \
    --non-interactive \
    --cert-name calatha.com \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d calatha.com \
    -d api.calatha.com

# Kiểm tra kết quả
if [ -f "../nginx/ssl/live/calatha.com/fullchain.pem" ]; then
    echo ""
    echo "✅ LẤY SSL CERTIFICATE THÀNH CÔNG!"
    echo ""
    echo "📜 Đường dẫn:"
    echo "   - fullchain.pem"
    echo "   - privkey.pem"
    echo ""
    echo "🔄 Restart nginx để áp dụng SSL..."
    docker compose -f docker-compose.prod.yml restart nginx
    echo ""
    echo "🎉 DONE!"
    echo "   - https://calatha.com"
    echo "   - https://api.calatha.com"
else
    echo ""
    echo "❌ LẤY CERTIFICATE THẤT BẠI!"
    echo ""
    echo "Debug:"
    echo "  - nslookup calatha.com"
    echo "  - docker logs ebay_ecommerce-nginx-prod"
    exit 1
fi
