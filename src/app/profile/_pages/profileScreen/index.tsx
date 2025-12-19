"use client";

import { useUpdateUserClient } from "@/auth/_hooks/useAuth";
import authService from "@/auth/services/auth.service";
import { ButtonField } from "@/components";
import PageContentTransition from "@/features/PageContentTransition";
import { usePresignedUpload } from "@/hooks/usePresignedUpload";
import { buyerService } from "@/services/buyer/buyer.service";
import { BuyerUpdateRequest } from "@/types/buyer/buyer.types";
import { UploadContext } from "@/types/storage/storage.types";
import { cn } from "@/utils/cn";
import {
  getStoredUserDetail,
  getUserId,
  updateUserImageInStorage,
} from "@/utils/jwt";
import { toPublicUrl } from "@/utils/storage/url";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import {
  FaCamera,
  FaChevronRight,
  FaEdit,
  FaLock,
  FaSave,
  FaSpinner,
  FaUniversity,
  FaUser,
  FaUserCircle,
  FaWallet,
} from "react-icons/fa";
import { toast } from "sonner";
import AddressManagement from "../Address";
import InformationEditor from "../Information";
import ChangePasswordFormCompact from "../ChangePassword";
import { menuItems } from "../../_types/menu";

const FeaturePlaceholder = ({ title, icon: Icon }: any) => (
  <div className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 rounded-xl shadow-sm min-h-100 animate-fade-in">
    <div className="p-4 bg-orange-50 rounded-full mb-4">
      <Icon className="text-3xl text-orange-200" />
    </div>
    <p className="font-medium text-base text-gray-500">
      Tính năng <span className="text-orange-500">{title}</span> đang phát triển
    </p>
  </div>
);

export default function ProfilePage() {
  // ... (Phần logic state, useEffect, handleAvatarChange giữ nguyên không thay đổi)
  const [user, setUser] = useState<any>(getStoredUserDetail());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editorData, setEditorData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    dateOfBirth: "",
    gender: "MALE",
    status: "",
  });

  const { uploadFile: uploadPresigned } = usePresignedUpload();
  const { handleUpdateUserClient } = useUpdateUserClient();
  const userId = getUserId();

  // ... (useEffect load data giữ nguyên)
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let userData = user;
        if (!userData) {
          userData = await authService.fetchAndStoreUserDetail();
          setUser(userData);
        }

        let buyerDetail = null;
        if (userData?.buyerId) {
          try {
            buyerDetail = await buyerService.getBuyerDetail(userData.buyerId);
          } catch (err) {
            console.warn(err);
          }
        }

        setEditorData({
          username: userData?.username || "",
          email: userData?.email || "",
          status: userData?.status || "",
          fullName: buyerDetail?.fullName || userData?.fullName || "",
          phone: buyerDetail?.phone || userData?.phone || "",
          dateOfBirth: buyerDetail?.dateOfBirth
            ? dayjs(buyerDetail.dateOfBirth).format("YYYY-MM-DD")
            : userData?.dateOfBirth
            ? dayjs(userData.dateOfBirth).format("YYYY-MM-DD")
            : "",
          gender: buyerDetail?.gender || userData?.gender || "MALE",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ... (Các hàm handleToggleEdit, handleCancelEdit, handleSaveEdit, handleAvatarChange giữ nguyên)
  const handleToggleEdit = () => {
    if (!user?.buyerId) {
      toast.warning("Bạn cần có tài khoản người mua để chỉnh sửa thông tin");
      return;
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = async (formData: any) => {
    setSaving(true);
    try {
      const updatePayload: BuyerUpdateRequest = {
        fullName: formData.fullName,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      };

      await buyerService.updateBuyer(user.buyerId, updatePayload);
      const res = await authService.fetchAndStoreUserDetail();
      setUser(res);
      setEditorData((prev) => ({ ...prev, ...formData }));

      toast.success("Cập nhật thông tin thành công");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size / 1024 / 1024 > 5) {
      toast.error("File quá lớn! Vui lòng chọn ảnh dưới 5MB.");
      return;
    }

    try {
      const loadingToast = toast.loading("Đang tải ảnh lên...");
      const res = await uploadPresigned(file, UploadContext.USER_AVATAR);

      let imageUrl = "";
      if (res.finalUrl) {
        imageUrl = res.finalUrl;
      } else if (res.path) {
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const ext = extension === "jpeg" ? "jpg" : extension;
        const imagePath = `${res.path.replace(
          /^pending\//,
          "public/"
        )}_orig.${ext}`;
        imageUrl = toPublicUrl(imagePath);
      }

      if (imageUrl && userId) {
        await handleUpdateUserClient(userId, { image: imageUrl });
        updateUserImageInStorage(imageUrl);
        setUser((prev: any) => ({ ...prev, image: imageUrl }));

        toast.dismiss(loadingToast);
        toast.success("Đổi ảnh đại diện thành công!");
      }
    } catch (error: any) {
      toast.dismiss();
      console.error("Upload error:", error);
      toast.error("Lỗi tải ảnh: " + (error?.message || "Vui lòng thử lại"));
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          // ... (Phần info giữ nguyên)
          <div className="space-y-6 animate-fade-in w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-gray-100 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Hồ sơ của tôi
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Quản lý thông tin hồ sơ để bảo mật tài khoản
                </p>
              </div>

              {user?.buyerId && (
                <div className="shrink-0">
                  {isEditing ? (
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        disabled={saving}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        Hủy
                      </button>
                      <ButtonField
                        form="profile-form"
                        htmlType="submit"
                        type="login"
                        loading={saving}
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold shadow-md shadow-orange-500/20 transition-all active:scale-95 border-0 h-auto"
                      >
                        <span className="flex items-center gap-2">
                          <FaSave /> Lưu
                        </span>
                      </ButtonField>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleToggleEdit}
                      className="group flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 hover:border-orange-500 hover:text-orange-600 text-gray-700 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                      <FaEdit className="text-gray-400 group-hover:text-orange-500 transition-colors" />
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <InformationEditor
                  formId="profile-form"
                  initialData={editorData}
                  onSave={handleSaveEdit}
                  isEditing={isEditing}
                />
              </div>

              <div className="lg:col-span-1 border-l border-gray-100 pl-8 flex flex-col items-center justify-center">
                <div
                  className="relative group cursor-pointer mb-4"
                  onClick={() => isEditing && fileInputRef.current?.click()}
                >
                  <div
                    className={cn(
                      "w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center bg-gray-50 transition-all duration-300",
                      isEditing
                        ? "ring-2 ring-orange-100 scale-105 cursor-pointer"
                        : "border-gray-100"
                    )}
                  >
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUserCircle className="text-gray-200 text-[144px]" />
                    )}
                  </div>

                  {isEditing && (
                    <div className="absolute inset-0 bg-black/30 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px]">
                      <div className="p-2 bg-white/20 rounded-full mb-1 backdrop-blur-sm">
                        <FaCamera className="text-white text-lg" />
                      </div>
                      <span className="text-white text-[10px] font-bold tracking-wider">
                        ĐỔI ẢNH
                      </span>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleAvatarChange}
                />

                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  Ảnh đại diện
                </h3>
                <p className="text-xs text-gray-400 max-w-45 text-center leading-relaxed">
                  Dụng lượng file tối đa 1 MB. Định dạng: .JPEG, .PNG
                </p>
              </div>
            </div>
          </div>
        );
      case "address":
        return user?.buyerId ? (
          <AddressManagement buyerId={user.buyerId} />
        ) : null;

      case "wallet":
        return <FeaturePlaceholder title="Ví điện tử" icon={FaWallet} />;
      case "bank-account":
        return (
          <FeaturePlaceholder title="Tài khoản ngân hàng" icon={FaUniversity} />
        );
      case "password":
        return <ChangePasswordFormCompact />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <PageContentTransition>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-64 shrink-0">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
                <div className="p-5 border-b border-gray-100 flex items-center gap-3 bg-linear-to-b from-orange-50/20 to-white">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-white ring-1 ring-orange-100 shadow-sm bg-white flex items-center justify-center shrink-0">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaUser className="text-gray-300 text-lg" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-semibold text-gray-900 truncate text-sm">
                      {editorData.fullName || user?.username}
                    </h3>
                    <p className="text-[10px] text-gray-500 truncate flex items-center gap-1 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{" "}
                      Thành viên
                    </p>
                  </div>
                </div>

                <nav className="p-2 space-y-1">
                  {menuItems.map((item) => (
                    <button
                      key={item.key}
                      onClick={() => {
                        if (!saving) setActiveTab(item.key);
                      }}
                      disabled={saving}
                      className={cn(
                        "w-full flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-left group disabled:opacity-50",
                        activeTab === item.key
                          ? "text-orange-600 bg-orange-50"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "text-base transition-colors",
                          activeTab === item.key
                            ? "text-orange-500"
                            : "text-gray-400 group-hover:text-gray-500"
                        )}
                      />
                      {item.label}
                      {activeTab === item.key && (
                        <FaChevronRight className="ml-auto text-[10px] text-orange-400" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 w-full all-center p-6 min-h-125">
                {loading ? (
                  <div className="h-full w-full flex flex-col items-center justify-center text-gray-400 py-16">
                    <FaSpinner className="animate-spin text-3xl mb-3 text-orange-500" />
                    <span className="text-xs font-medium">
                      Đang tải thông tin...
                    </span>
                  </div>
                ) : (
                  renderContent()
                )}
              </div>
            </div>
          </div>
        </div>
      </PageContentTransition>
    </div>
  );
}
