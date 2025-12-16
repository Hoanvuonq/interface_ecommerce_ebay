# 🔐 Hướng dẫn Setup HTTP Basic Authentication

## ⚠️ Vấn đề đã sửa

**Lỗi cũ**: Khi set secret `HTPASSWD_CONTENT = client:$apr1$wt80o37l$9RmbE0jBj/VSq1EgKFuoY1`, bash sẽ expand `$apr1`, `$wt80o37l`, `$9` thành empty → file bị sai.

**Giải pháp**: Dùng **base64 encode** trong secret để tránh bash expand `$variables`.

## 🚀 Cách setup

### Bước 1: Tạo htpasswd content

```bash
# Tạo file .htpasswd
htpasswd -n client
# Nhập password, output sẽ là: client:$apr1$wt80o37l$9RmbE0jBj/VSq1EgKFuoY1
```

### Bước 2: Encode base64

```bash
# Encode content thành base64
echo -n "client:\$apr1\$wt80o37l\$9RmbE0jBj/VSq1EgKFuoY1" | base64

# Output sẽ là: Y2xpZW50OiRhcHIxJHd0ODBvMzdsJDlSbWJFMGpCai9WU3ExRWdLRnVvWTEK
```

**Hoặc dùng online tool:**
- https://www.base64encode.org/
- Paste content: `client:$apr1$wt80o37l$9RmbE0jBj/VSq1EgKFuoY1`
- Copy base64 result

### Bước 3: Thêm GitHub Secret

1. Vào GitHub Repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `HTPASSWD_CONTENT`
4. Value: Paste **base64 encoded** content từ bước 2
   - Ví dụ: `Y2xpZW50OiRhcHIxJHd0ODBvMzdsJDlSbWJFMGpCai9WU3ExRWdLRnVvWTEK`
5. Click **Add secret**

### Bước 4: Deploy

Khi push code, workflow sẽ:
1. Tự động decode base64 từ secret
2. Tạo file `.htpasswd` trên server
3. File sẽ có nội dung đúng: `client:$apr1$wt80o37l$9RmbE0jBj/VSq1EgKFuoY1`

## 📝 Ví dụ

### Plain text (trước khi encode):
```
client:$apr1$wt80o37l$9RmbE0jBj/VSq1EgKFuoY1
```

### Base64 encoded (set vào secret):
```
Y2xpZW50OiRhcHIxJHd0ODBvMzdsJDlSbWJFMGpCai9WU3ExRWdLRnVvWTEK
```

### Nhiều users (mỗi user một dòng):
```
client:$apr1$wt80o37l$9RmbE0jBj/VSq1EgKFuoY1
admin:$apr1$4kJtpSe5$e5FQn5CgZKH7L8ZA7BIMG0
```

Encode tất cả:
```bash
echo -n "client:\$apr1\$wt80o37l\$9RmbE0jBj/VSq1EgKFuoY1
admin:\$apr1\$4kJtpSe5\$e5FQn5CgZKH7L8ZA7BIMG0" | base64
```

## 🔒 Bảo mật

- ✅ Password đã được hash (MD5)
- ✅ Secret được lưu an toàn trong GitHub Secrets
- ✅ Base64 encoding tránh bash expand `$variables`
- ✅ File `.htpasswd` không được commit vào git

## ⚠️ Lưu ý

1. **Phải encode base64**: Secret phải là base64 encoded, không phải plain text
2. **Đổi password**: Update secret với base64 mới và deploy lại
3. **Nhiều users**: Mỗi user một dòng, encode tất cả cùng lúc
4. **Test**: Sau khi deploy, test với `curl -u client:password http://your-domain.com`

## 🧪 Test

```bash
# Test authentication
curl -u client:yourpassword http://your-domain.com

# Test health check (không cần auth)
curl http://your-domain.com/health
```

## 🔄 Update Password

1. Tạo password mới với htpasswd
2. Encode base64
3. Update secret `HTPASSWD_CONTENT` trong GitHub
4. Push code hoặc re-run workflow
5. File `.htpasswd` sẽ được tạo lại với password mới

---

**Lưu ý**: HTTP Basic Authentication chỉ là lớp bảo vệ cơ bản. Nên sử dụng HTTPS kết hợp với authentication này.

