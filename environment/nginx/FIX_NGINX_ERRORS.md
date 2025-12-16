# 🔧 Fix Nginx Errors

## ❌ Lỗi đã gặp

### 1. Duplicate upstream "nextjs"
```
nginx: [emerg] duplicate upstream "nextjs" in /etc/nginx/conf.d/default.conf:2
```

**Nguyên nhân:** Cả `default.conf` và `calatha.com.conf` đều định nghĩa `upstream nextjs`.

**Giải pháp:** Đã comment upstream trong `default.conf` vì production dùng `calatha.com.conf`.

### 2. Deprecated http2 syntax
```
nginx: [warn] the "listen ... http2" directive is deprecated, use the "http2" directive instead
```

**Nguyên nhân:** Cú pháp cũ `listen 443 ssl http2` đã bị deprecated trong nginx mới.

**Giải pháp:** Đã sửa thành:
```nginx
listen 443 ssl;
listen [::]:443 ssl;
http2 on;
```

## ✅ Đã sửa

1. ✅ Comment upstream trong `default.conf`
2. ✅ Sửa cú pháp http2 trong `calatha.com.conf`
3. ✅ Sửa cú pháp http2 trong `api.calatha.com.conf` (backend)

## 🚀 Sau khi sửa

```bash
# Test nginx config
docker exec ebay_ecommerce-nginx-prod nginx -t

# Nếu OK, reload nginx
docker exec ebay_ecommerce-nginx-prod nginx -s reload

# Hoặc restart container
docker restart ebay_ecommerce-nginx-prod
```

## 📝 Lưu ý

- `default.conf` chỉ dùng cho development/localhost
- `calatha.com.conf` dùng cho production
- Không được định nghĩa cùng một upstream 2 lần trong các file khác nhau

