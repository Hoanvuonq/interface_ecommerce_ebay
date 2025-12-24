# 🐳 Frontend Environment Setup

Environment riêng cho Frontend (Next.js) - độc lập với Backend.

## 📁 Cấu trúc

```
fe_ecommerce_ebay/environment/
├── compose/
│   ├── docker-compose.dev.yml      # Development
│   ├── docker-compose.staging.yml  # Staging
│   ├── docker-compose.prod.yml     # Production
│   ├── docker-compose.test.yml     # Test Environment
│   └── DEPLOY_TEST.md              # Hướng dẫn deploy test
├── env/
│   ├── dev/
│   │   └── .fe.env                 # Frontend env vars (dev)
│   ├── staging/
│   │   └── .fe.env                 # Frontend env vars (staging)
│   └── prod/
│       └── .fe.env                 # Frontend env vars (prod)
├── nginx/
│   ├── nginx.conf                  # Gateway Nginx config
│   └── conf.d/
│       ├── calatha.com.conf        # Proxy cho FE + API (production)
│       ├── api.calatha.com.conf    # Proxy cho Backend API
│       └── test.calatha.com.conf   # Proxy cho Test Environment
├── Scripts/
│   ├── docker-build.ps1            # Build & run script (PowerShell)
│   └── docker-push.ps1             # Build & push script (PowerShell)
├── Dockerfile                      # Frontend Dockerfile
├── .dockerignore                   # Docker ignore file
└── README.md                       # This file
```

## ⚡ Quick Start

### Development
```powershell
cd fe_ecommerce_ebay/environment
.\Scripts\docker-build.ps1 dev up --build
```

### Staging
```powershell
.\Scripts\docker-build.ps1 staging up --build
```

### Production
```powershell
# Chạy một lần nếu chưa có network gateway
docker network create ebay-network

.\Scripts\docker-build.ps1 prod up
```

### Test Environment (test.calatha.com)
```powershell
# Xem hướng dẫn chi tiết trong compose/DEPLOY_TEST.md
# Test environment dùng chung nginx với production
# Chỉ cần start test container:
.\Scripts\docker-build.ps1 test up

# Sau đó reload nginx production để load config mới:
docker exec ebay_ecommerce-nginx-prod nginx -s reload
```

## 🔧 Các lệnh thường dùng

### Build và chạy
```powershell
# Development
.\Scripts\docker-build.ps1 dev up --build

# Chạy ở background
.\Scripts\docker-build.ps1 dev up -d

# Xem logs
docker compose -f compose/docker-compose.dev.yml logs -f

# Dừng containers
docker compose -f compose/docker-compose.dev.yml down
```

### Build và push image
```powershell
# Build và push lên Docker Hub
.\Scripts\docker-push.ps1 prod latest

# Hoặc với tag cụ thể
.\Scripts\docker-push.ps1 prod v1.0.0
```

### Thủ công
```powershell
# Build
docker compose -f compose/docker-compose.dev.yml build

# Chạy
docker compose -f compose/docker-compose.dev.yml up -d

# Xem logs
docker compose -f compose/docker-compose.dev.yml logs -f nextjs-frontend

# Restart service
docker compose -f compose/docker-compose.dev.yml restart nextjs-frontend
```

## 🔐 Environment Variables

Các file `.fe.env` chứa:
- `NEXT_PUBLIC_BACKEND_URL` - URL của Backend API (quan trọng!)
- `NEXT_PUBLIC_PRIMARY_COLOR` - Màu chủ đạo
- `NEXT_PUBLIC_THEME_MODE` - Chế độ theme (light/dark)

**Lưu ý quan trọng:**
- Chỉ các biến bắt đầu bằng `NEXT_PUBLIC_` mới được expose ra browser
- Các biến này sẽ được embed vào bundle khi build
- Cập nhật `NEXT_PUBLIC_BACKEND_URL` theo từng environment!

## 🐳 Dockerfile

- **Deps stage:** `node:20-alpine` - Install dependencies
- **Builder stage:** `node:20-alpine` - Build Next.js với `.fe.env`
- **Runner stage:** `node:20-alpine` - Runtime với standalone output (~200-250MB)
- **Build context:** `fe_ecommerce_ebay/` (parent directory)
- **Port:** 3000

## 📊 Services

Mỗi docker-compose file chứa:
- **Next.js Frontend** - Next.js application
- **Nginx** - Reverse proxy (optional, có thể bỏ nếu không cần)

**Không có:** Backend, MySQL, Redis (để riêng trong Backend environment)

## 🔗 Kết nối với Backend

Frontend kết nối với Backend qua `NEXT_PUBLIC_BACKEND_URL`:
- **Development:** `http://localhost:8888` (Backend chạy local)
- **Staging/Prod:** URL thực tế của Backend API

**Lưu ý:** Backend có thể chạy ở:
- Cùng server (khác container)
- Server khác
- Cloud service

Frontend chỉ cần biết URL của Backend qua env variable.

## 🚀 Deploy trên Server

### 1. Copy files lên server
```bash
# Copy các files cần thiết
scp -r fe_ecommerce_ebay/environment/ user@server:~/frontend/
```

### 2. Cập nhật `.fe.env`
```bash
cd ~/frontend/environment/env/prod
nano .fe.env
# Cập nhật NEXT_PUBLIC_BACKEND_URL với URL Backend thực tế
```

### 3. Pull image từ Docker Hub
```bash
docker pull quy123zz/ebay_ecom:frontend-latest
```

### 4. Chạy
```bash
cd ~/frontend/environment
docker compose -f compose/docker-compose.prod.yml up -d
```

## ✅ Kiểm tra

```bash
# Health check
curl http://localhost:3000
curl http://localhost/health

# Xem containers
docker compose -f compose/docker-compose.prod.yml ps

# Xem logs
docker compose -f compose/docker-compose.prod.yml logs -f
```

## 🔄 Update Process

```bash
# 1. Pull image mới
docker pull quy123zz/ebay_ecom:frontend-latest

# 2. Restart
docker compose -f compose/docker-compose.prod.yml restart nextjs-frontend

# 3. Kiểm tra
curl http://localhost:3000
```

## 🌐 Nginx Configuration

Gateway Nginx (service `nginx`) hiện đứng cổng 80/443 và đảm nhiệm:
- Proxy `calatha.com` / `www.calatha.com` về container Next.js
- Proxy `api.calatha.com` / `www.api.calatha.com` về container Spring Boot (`ebay_ecommerce-app`)
- Chặn toàn bộ host không hợp lệ (trả 444)
- Serve static files với cache dài và endpoint `/health`

**Lưu ý:** Next.js và Spring Boot chỉ cần tham gia chung mạng `ebay-network`, không expose port ra ngoài.

## 🔒 SSL/HTTPS

### Setup cho calatha.com

Đã có sẵn cấu hình nginx cho domain `calatha.com` trong `nginx/conf.d/calatha.com.conf`.

**Các bước setup:**

1. **Tạo SSL Certificate** (Let's Encrypt khuyến nghị):
   ```bash
   sudo certbot certonly --standalone -d calatha.com -d www.calatha.com
   ```

2. **Copy certificates vào nginx/ssl/**:
   ```bash
   mkdir -p nginx/ssl/calatha.com
   sudo cp /etc/letsencrypt/live/calatha.com/fullchain.pem nginx/ssl/calatha.com/
   sudo cp /etc/letsencrypt/live/calatha.com/privkey.pem nginx/ssl/calatha.com/
   sudo cp /etc/letsencrypt/live/calatha.com/chain.pem nginx/ssl/calatha.com/
   ```

3. **Xem hướng dẫn chi tiết:**
   - `nginx/SSL_SETUP.md` - Hướng dẫn setup SSL
   - `DEPLOY_CALATHA.md` - Hướng dẫn deploy lên server

**Tính năng:**
- ✅ Tự động redirect HTTP → HTTPS
- ✅ Tự động redirect www → non-www
- ✅ Security headers đầy đủ
- ✅ Static files caching
- ✅ Gzip compression
- ✅ Health check endpoint

---

**Lợi ích của việc tách riêng:**
- ✅ Backend và Frontend có thể deploy độc lập
- ✅ Mỗi cái có thể thay đổi mà không ảnh hưởng cái kia
- ✅ Dễ quản lý và maintain hơn
- ✅ Có thể scale riêng biệt
- ✅ Frontend có thể gọi Backend ở bất kỳ đâu (không cần cùng network)

