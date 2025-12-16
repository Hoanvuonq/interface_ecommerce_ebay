# SSL Certificates Setup

## Cách 1: Let's Encrypt Wildcard Certificate (KHUYẾN NGHỊ)

### Step 1: Cài Certbot
```bash
sudo snap install certbot --classic
```

### Step 2: Lấy Wildcard Certificate
```bash
sudo certbot certonly --manual --preferred-challenges dns \
  -d calatha.com -d *.calatha.com
```

### Step 3: Certbot sẽ yêu cầu tạo DNS TXT Record
```
Please deploy a DNS TXT record under the name:
_acme-challenge.calatha.com

with the following value:
XYZ123ABC...
```

### Step 4: Vào DNS Provider (Cloudflare/GoDaddy/etc)
Thêm TXT record:
- **Name**: `_acme-challenge`
- **Type**: `TXT`
- **Value**: `XYZ123ABC...` (copy từ Certbot)
- **TTL**: Auto

### Step 5: Kiểm tra DNS đã propagate chưa
```bash
nslookup -type=TXT _acme-challenge.calatha.com
```

### Step 6: Nhấn Enter trong Certbot

Certificates sẽ được tạo tại:
```
/etc/letsencrypt/live/calatha.com/fullchain.pem
/etc/letsencrypt/live/calatha.com/privkey.pem
```

### Step 7: Copy vào Docker volume
```bash
# Tạo thư mục ssl nếu chưa có
mkdir -p /Users/huynhthanhquy/Desktop/ecom_ebay/fe_ecommerce_ebay/environment/nginx/ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/calatha.com/fullchain.pem \
        /Users/huynhthanhquy/Desktop/ecom_ebay/fe_ecommerce_ebay/environment/nginx/ssl/

sudo cp /etc/letsencrypt/live/calatha.com/privkey.pem \
        /Users/huynhthanhquy/Desktop/ecom_ebay/fe_ecommerce_ebay/environment/nginx/ssl/

# Set permissions
sudo chmod 644 /Users/huynhthanhquy/Desktop/ecom_ebay/fe_ecommerce_ebay/environment/nginx/ssl/fullchain.pem
sudo chmod 600 /Users/huynhthanhquy/Desktop/ecom_ebay/fe_ecommerce_ebay/environment/nginx/ssl/privkey.pem
```

### Step 8: Auto-renew
```bash
# Certbot tự động setup cron job để renew
# Kiểm tra:
sudo certbot renew --dry-run

# Nếu OK, cert sẽ tự động renew trước khi hết hạn
```

---

## Cách 2: Self-Signed Certificate (CHỈ CHO TESTING)

```bash
# Tạo self-signed cert
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout privkey.pem \
  -out fullchain.pem \
  -subj "/CN=*.calatha.com"

# Move to ssl directory
mv privkey.pem fullchain.pem \
   /Users/huynhthanhquy/Desktop/ecom_ebay/fe_ecommerce_ebay/environment/nginx/ssl/
```

⚠️ **LƯU Ý**: Self-signed cert sẽ hiện warning "Not Secure" trên browser!

---

## File Structure

```
nginx/ssl/
├── README.md           # File này
├── fullchain.pem       # Certificate (public)
└── privkey.pem         # Private key (secret!)
```

## Security Notes

- ⚠️ **KHÔNG commit** `privkey.pem` vào Git!
- ✅ Add `ssl/*.pem` vào `.gitignore`
- ✅ Set permissions: `chmod 600 privkey.pem`
- ✅ Renew certificates trước khi hết hạn (Let's Encrypt: 90 ngày)

## Verification

```bash
# Kiểm tra cert validity
openssl x509 -in fullchain.pem -text -noout

# Test SSL config
nginx -t
```
