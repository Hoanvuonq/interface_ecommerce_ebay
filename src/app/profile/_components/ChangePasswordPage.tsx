// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { useChangePassword } from "@/auth/_hooks/useAuth";
// import { ChangePasswordRequest } from "@/auth/_types/auth";
// import { getUserId } from "@/utils/jwt";
// import { InputField, ButtonField, Design } from "@/components"; // Import các component dùng chung
// import {
//   FaLock,
//   FaShieldAlt,
//   FaKey,
//   FaUserShield,
//   FaExclamationTriangle,
//   FaRandom,
//   FaCopy,
// } from "react-icons/fa";
// import { MdSecurity, MdCheckCircle, MdVpnKey } from "react-icons/md";
// import { generateSecurePassword } from "@/utils/passwordGenerator";
// import { toast } from "sonner";
// import { cn } from "@/utils/cn";

// // --- SUB-COMPONENTS ---
// const Title = ({ level, className, children }: { level: number; className?: string; children: React.ReactNode }) => {
//   const Tag = `h${level}` as React.ElementType;
//   return <Tag className={className}>{children}</Tag>;
// };

// const Text = ({ className, children }: { className?: string; children: React.ReactNode }) => {
//   return <span className={className}>{children}</span>;
// };

// // --- MAIN COMPONENT ---
// export default function ChangePasswordForm() {
//   const { handleChangePassword, loading } = useChangePassword();
//   const userId: string = getUserId() || "";
  
//   const [formData, setFormData] = useState<ChangePasswordRequest & { confirmPassword?: string }>({
//     oldPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });
  
//   const [formErrors, setFormErrors] = useState<Partial<typeof formData>>({});
//   const oldPasswordRef = useRef<HTMLInputElement>(null);
  
//   // Regex: Ít nhất 1 hoa, 1 thường, 1 số, min 6 ký tự
//   const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

//   useEffect(() => {
//     oldPasswordRef.current?.focus();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     // Clear error khi user bắt đầu gõ lại
//     if (formErrors[name as keyof typeof formData]) {
//       setFormErrors((prev) => ({ ...prev, [name]: undefined }));
//     }
//   };

//   const handleGeneratePassword = () => {
//     const newPassword = generateSecurePassword({ length: 14 });
//     setFormData((prev) => ({
//       ...prev,
//       newPassword: newPassword,
//       confirmPassword: newPassword,
//     }));
//     setFormErrors((prev) => ({
//         ...prev,
//         newPassword: undefined,
//         confirmPassword: undefined
//     }));
//     toast.success("Đã tạo mật khẩu mạnh tự động!");
//   };

//   const handleCopyPassword = async () => {
//     if (formData.newPassword) {
//       try {
//         await navigator.clipboard.writeText(formData.newPassword);
//         toast.success("Đã sao chép mật khẩu!");
//       } catch {
//         toast.error("Lỗi sao chép.");
//       }
//     } else {
//       toast.warning("Chưa có mật khẩu mới để sao chép.");
//     }
//   };

//   const validateForm = () => {
//     const errors: Partial<typeof formData> = {};
//     if (!formData.oldPassword) errors.oldPassword = "Vui lòng nhập mật khẩu hiện tại";
    
//     if (!formData.newPassword) {
//         errors.newPassword = "Vui lòng nhập mật khẩu mới";
//     } else if (!passwordPattern.test(formData.newPassword)) {
//         errors.newPassword = "Mật khẩu phải gồm chữ hoa, thường và số (min 6 ký tự)";
//     }

//     if (formData.newPassword !== formData.confirmPassword) {
//         errors.confirmPassword = "Mật khẩu xác nhận không khớp";
//     }

//     return errors;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const errors = validateForm();
//     if (Object.keys(errors).length > 0) {
//       setFormErrors(errors);
//       toast.error("Vui lòng kiểm tra lại thông tin");
//       return;
//     }

//     try {
//       const { confirmPassword, ...requestData } = formData;
//       const res = await handleChangePassword(userId, requestData as any);

//       if (res) {
//         toast.success("Đổi mật khẩu thành công!");
//         setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
//       } else {
//         toast.error("Đổi mật khẩu thất bại. Mật khẩu cũ có thể không đúng.");
//       }
//     } catch (err: any) {
//       const errorMessage = err?.message || "Đổi mật khẩu thất bại!";
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full relative overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900/20">
//       <Design />

//       <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
//         <div className="w-full max-w-6xl">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
//             {/* LEFT COLUMN: FORM */}
//             <div
//               className={cn(
//                 "shadow-2xl transition-all duration-300 relative z-10",
//                 "bg-white/90 dark:bg-slate-800/90 border border-gray-200 dark:border-slate-700",
//                 "rounded-3xl p-8 backdrop-blur-xl"
//               )}
//             >
//               {/* Header */}
//               <div className="text-center mb-8">
//                 <div className="flex justify-center mb-6">
//                   <div className="relative">
//                     <div className="w-24 h-24 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30">
//                       <FaLock className="text-white text-4xl" />
//                     </div>
//                     <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-800 shadow-lg">
//                       <FaShieldAlt className="text-white text-xs" />
//                     </div>
//                   </div>
//                 </div>

//                 <Title level={2} className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
//                   Đổi mật khẩu
//                 </Title>
//                 <Text className="text-base text-gray-500 dark:text-gray-400">
//                   Thay đổi mật khẩu định kỳ để bảo vệ tài khoản của bạn
//                 </Text>
//               </div>

//               {/* Form */}
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <InputField
//                   label="Mật khẩu hiện tại"
//                   name="oldPassword"
//                   type="password"
//                   placeholder="Nhập mật khẩu cũ"
//                   value={formData.oldPassword}
//                   onChange={handleInputChange}
//                   errorMessage={formErrors.oldPassword}
//                   ref={oldPasswordRef}
//                 />

//                 {/* New Password Section */}
//                 <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 space-y-4">
//                   <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
//                     <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold">
//                       <MdVpnKey className="text-xl" />
//                       <span>Thiết lập mật khẩu mới</span>
//                     </div>
                    
//                     {/* Tools */}
//                     <div className="flex gap-2">
//                       <button
//                         type="button"
//                         onClick={handleGeneratePassword}
//                         className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-900/60 rounded-lg text-xs font-semibold transition-colors"
//                         title="Tạo mật khẩu ngẫu nhiên"
//                       >
//                         <FaRandom /> Auto
//                       </button>
//                       <button
//                         type="button"
//                         onClick={handleCopyPassword}
//                         className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/40 dark:text-green-300 dark:hover:bg-green-900/60 rounded-lg text-xs font-semibold transition-colors"
//                         title="Sao chép mật khẩu"
//                       >
//                         <FaCopy /> Copy
//                       </button>
//                     </div>
//                   </div>

//                   <InputField
//                     label="Mật khẩu mới"
//                     name="newPassword"
//                     type="password"
//                     placeholder="Nhập mật khẩu mới"
//                     value={formData.newPassword}
//                     onChange={handleInputChange}
//                     errorMessage={formErrors.newPassword}
//                     inputClassName="bg-white dark:bg-slate-900"
//                   />

//                   <InputField
//                     label="Xác nhận mật khẩu"
//                     name="confirmPassword"
//                     type="password"
//                     placeholder="Nhập lại mật khẩu mới"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     errorMessage={formErrors.confirmPassword}
//                     inputClassName="bg-white dark:bg-slate-900"
//                   />
//                 </div>

//                 <ButtonField
//                   htmlType="submit"
//                   type="primary" // Hoặc type="login" cho gradient đỏ-cam
//                   loading={loading}
//                   disabled={loading}
//                   className="w-full h-12 text-lg font-bold rounded-xl shadow-lg shadow-indigo-500/20 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0"
//                 >
//                   Xác nhận đổi mật khẩu
//                 </ButtonField>
//               </form>

//               {/* Warning */}
//               <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-700">
//                 <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/30">
//                   <FaExclamationTriangle className="text-amber-500 text-xl shrink-0 mt-0.5" />
//                   <div>
//                     <h4 className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-1">Lưu ý quan trọng</h4>
//                     <p className="text-xs text-amber-700 dark:text-amber-300">
//                       Sau khi đổi mật khẩu thành công, bạn sẽ cần đăng nhập lại trên tất cả các thiết bị khác.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* RIGHT COLUMN: INFO & TIPS */}
//             <div className="space-y-6">
//                 {/* Security Guide Card */}
//                 <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-gray-200 dark:border-slate-700 rounded-3xl p-6 shadow-xl">
//                     <div className="flex items-center gap-4 mb-6">
//                         <div className="w-14 h-14 bg-linear-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg text-white text-2xl">
//                             <FaUserShield />
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Hướng dẫn bảo mật</h3>
//                             <p className="text-sm text-gray-500 dark:text-gray-400">Cách tạo mật khẩu an toàn</p>
//                         </div>
//                     </div>

//                     <ul className="space-y-3">
//                         <li className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
//                             <MdCheckCircle className="text-green-500 text-xl mt-0.5" />
//                             <div>
//                                 <strong className="block text-sm text-gray-800 dark:text-gray-200">Độ dài tối thiểu</strong>
//                                 <span className="text-xs text-gray-600 dark:text-gray-400">Nên dùng từ 10-12 ký tự trở lên.</span>
//                             </div>
//                         </li>
//                         <li className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
//                             <MdCheckCircle className="text-blue-500 text-xl mt-0.5" />
//                             <div>
//                                 <strong className="block text-sm text-gray-800 dark:text-gray-200">Độ phức tạp</strong>
//                                 <span className="text-xs text-gray-600 dark:text-gray-400">Kết hợp Hoa, thường, số và ký tự đặc biệt.</span>
//                             </div>
//                         </li>
//                         <li className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
//                             <MdCheckCircle className="text-purple-500 text-xl mt-0.5" />
//                             <div>
//                                 <strong className="block text-sm text-gray-800 dark:text-gray-200">Không thông tin cá nhân</strong>
//                                 <span className="text-xs text-gray-600 dark:text-gray-400">Tránh dùng ngày sinh, tên, số điện thoại.</span>
//                             </div>
//                         </li>
//                     </ul>
//                 </div>

//                 <div className="bg-linear-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-100 dark:border-red-800 rounded-3xl p-6 shadow-lg">
//                     <div className="flex items-center gap-3 mb-4">
//                         <div className="p-2 bg-red-100 dark:bg-red-800/30 rounded-lg text-red-600 dark:text-red-400">
//                             <MdSecurity className="text-2xl" />
//                         </div>
//                         <h3 className="font-bold text-gray-800 dark:text-gray-100">Cảnh báo bảo mật</h3>
//                     </div>
//                     <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300 pl-1">
//                         <li className="flex gap-2"><span className="text-red-500">•</span> Không chia sẻ mật khẩu với bất kỳ ai.</li>
//                         <li className="flex gap-2"><span className="text-red-500">•</span> Nên thay đổi mật khẩu định kỳ 3-6 tháng.</li>
//                         <li className="flex gap-2"><span className="text-red-500">•</span> Đăng xuất nếu dùng thiết bị công cộng.</li>
//                     </ul>
//                 </div>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }