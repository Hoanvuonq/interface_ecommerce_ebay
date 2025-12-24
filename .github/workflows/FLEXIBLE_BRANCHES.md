# ✅ WORKFLOW LINH HOẠT VỚI CÁC BRANCH

## 🎯 THAY ĐỔI

Workflow đã được cập nhật để linh hoạt hơn với các branch, không còn hardcode `wuy`.

---

## 📋 CẤU HÌNH BRANCHES

### Trong `env` section:

```yaml
env:
  # Branches sẽ trigger deployment (push image + deploy)
  DEPLOY_BRANCHES: wuy,main,production
  
  # Branches chỉ build, không push image (build only)
  BUILD_ONLY_BRANCHES: staging,develop
```

---

## 🎯 CÁCH HOẠT ĐỘNG

### 1. **Deploy Branches** (`DEPLOY_BRANCHES`)

Khi push vào các branch này:
- ✅ Build image
- ✅ **Push image lên Docker Hub**
- ✅ **Deploy lên server**
- ✅ Start containers

**Ví dụ:** `wuy`, `main`, `production`

---

### 2. **Build Only Branches** (`BUILD_ONLY_BRANCHES`)

Khi push vào các branch này:
- ✅ Build image
- ❌ **KHÔNG push image**
- ❌ **KHÔNG deploy**

**Ví dụ:** `staging`, `develop`

---

### 3. **Other Branches**

Khi push vào các branch khác:
- ✅ Build image
- ❌ **KHÔNG push image**
- ❌ **KHÔNG deploy**

---

## 🔧 CÁCH THÊM/XÓA BRANCHES

### Thêm branch deploy:

```yaml
DEPLOY_BRANCHES: wuy,main,production,release
```

### Thêm branch build-only:

```yaml
BUILD_ONLY_BRANCHES: staging,develop,test
```

**→ Chỉ cần sửa ở một chỗ, không cần sửa nhiều nơi!**

---

## 📋 CÁC ĐIỀU KIỆN ĐÃ ĐƯỢC CẬP NHẬT

Tất cả các điều kiện đã được thay đổi từ:

**Trước (hardcode):**
```yaml
if: github.event_name == 'push' && github.ref == 'refs/heads/wuy'
```

**Sau (linh hoạt):**
```yaml
if: github.event_name == 'push' && contains(env.DEPLOY_BRANCHES, github.ref_name)
```

---

## ✅ CÁC BƯỚC ĐÃ ĐƯỢC CẬP NHẬT

1. ✅ Build và push image → Dùng `contains(env.DEPLOY_BRANCHES, github.ref_name)`
2. ✅ Copy docker-compose → Dùng `contains(env.DEPLOY_BRANCHES, github.ref_name)`
3. ✅ Copy nginx config → Dùng `contains(env.DEPLOY_BRANCHES, github.ref_name)`
4. ✅ Create .htpasswd → Dùng `contains(env.DEPLOY_BRANCHES, github.ref_name)`
5. ✅ Deploy to server → Dùng `contains(env.DEPLOY_BRANCHES, github.ref_name)`
6. ✅ Success message → Check branch động
7. ✅ Build summary → Check branch động

---

## 🎯 VÍ DỤ SỬ DỤNG

### Push vào `wuy`:
```
✅ Build image
✅ Push image → Docker Hub
✅ Deploy → Server
✅ Start containers
```

### Push vào `main`:
```
✅ Build image
✅ Push image → Docker Hub
✅ Deploy → Server
✅ Start containers
```

### Push vào `staging`:
```
✅ Build image
❌ Không push image
❌ Không deploy
```

### Push vào `develop`:
```
✅ Build image
❌ Không push image
❌ Không deploy
```

---

## 🎉 LỢI ÍCH

1. ✅ **Linh hoạt** - Dễ thêm/xóa branches
2. ✅ **Tập trung** - Chỉ cần sửa ở một chỗ (`env`)
3. ✅ **Rõ ràng** - Dễ hiểu branch nào deploy, branch nào chỉ build
4. ✅ **Dễ bảo trì** - Không cần sửa nhiều nơi khi thay đổi

---

## 📝 LƯU Ý

- `github.ref_name` là tên branch (ví dụ: `wuy`, `main`, `staging`)
- `contains()` check xem branch có trong danh sách không
- Có thể thêm nhiều branches, cách nhau bằng dấu phẩy

---

## 🎯 KẾT LUẬN

**Workflow đã linh hoạt hơn!**

→ Chỉ cần sửa `DEPLOY_BRANCHES` và `BUILD_ONLY_BRANCHES` ở đầu file để thay đổi behavior.

