"use client";

import { useState, useEffect } from "react";
import bankAccountService from "@/services/bank/bank-account.service";
import BankSelector from "../../_components/BankSelector"; // Đảm bảo đường dẫn đúng tới file bạn vừa tạo
import type {
  BankAccountResponse,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
} from "@/types/bank/bank-account.types";
import { BankAccountType } from "@/types/bank/bank-account.types";

interface BankAccountManagementProps {
  accountType: BankAccountType;
}

// Định nghĩa lại form data interface
interface FormDataState {
  bankAccountNumber: string;
  bankName: string; // Lưu shortName
  bankAccountHolder: string;
  branch: string;
  isDefault: boolean;
}

const INITIAL_FORM_DATA: FormDataState = {
  bankAccountNumber: "",
  bankName: "",
  bankAccountHolder: "",
  branch: "",
  isDefault: false,
};

export default function BankAccountManagement({
  accountType,
}: BankAccountManagementProps) {
  // --- State ---
  const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State quản lý Drawer (thay cho Modal)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // State Form & Errors
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // --- Effects ---
  useEffect(() => {
    loadBankAccounts();
  }, [accountType]);

  // --- API Actions ---
  const loadBankAccounts = async () => {
    setLoading(true);
    try {
      const accounts = await bankAccountService.getMyBankAccounts(accountType);
      setBankAccounts(accounts);
    } catch (error: any) {
      console.error("Lỗi tải danh sách:", error);
      alert("Không thể tải danh sách tài khoản ngân hàng"); // Thay bằng Toast custom của bạn
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.bankAccountNumber) newErrors.bankAccountNumber = "Vui lòng nhập số tài khoản";
    else if (!/^[0-9]{4,30}$/.test(formData.bankAccountNumber)) newErrors.bankAccountNumber = "Số tài khoản không hợp lệ (4-30 số)";
    
    if (!formData.bankName) newErrors.bankName = "Vui lòng chọn ngân hàng";
    if (!formData.bankAccountHolder) newErrors.bankAccountHolder = "Vui lòng nhập tên chủ tài khoản";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        // Update
        const updatePayload: UpdateBankAccountRequest = {
           bankAccountNumber: formData.bankAccountNumber,
           bankName: formData.bankName, // Logic BE cần check xem nhận shortName hay fullName
           bankAccountHolder: formData.bankAccountHolder,
           branch: formData.branch,
           isDefault: formData.isDefault
        };
        await bankAccountService.updateBankAccount(editingId, updatePayload);
        // alert("Cập nhật thành công");
      } else {
        // Create
        const createPayload: CreateBankAccountRequest = {
          accountType,
          bankAccountNumber: formData.bankAccountNumber,
          bankName: formData.bankName,
          bankAccountHolder: formData.bankAccountHolder,
          branch: formData.branch,
          isDefault: formData.isDefault,
        };
        await bankAccountService.createBankAccount(createPayload);
        // alert("Thêm mới thành công");
      }
      
      closeDrawer();
      loadBankAccounts();
    } catch (error: any) {
        alert(error?.response?.data?.message || "Thao tác thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) return;
    try {
      await bankAccountService.deleteBankAccount(id);
      loadBankAccounts();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Xóa thất bại");
    }
  };

  // --- UI Handlers ---
  const openCreate = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM_DATA);
    setErrors({});
    setIsDrawerOpen(true);
  };

  const openEdit = (acc: BankAccountResponse) => {
    setEditingId(acc.bankAccountId);
    setFormData({
      bankAccountNumber: acc.bankAccountNumber,
      bankName: acc.bankName, // Giả sử API trả về shortName hoặc bạn cần map lại
      bankAccountHolder: acc.bankAccountHolder,
      branch: acc.branch || "",
      isDefault: acc.default,
    });
    setErrors({});
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const getTitle = () => {
    if (accountType === BankAccountType.SHOP) return "Tài khoản Shop";
    if (accountType === BankAccountType.ADMIN) return "Tài khoản Admin";
    return "Tài khoản cá nhân";
  };

  return (
    <div className="w-full relative">
      {/* --- MAIN CONTENT --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{getTitle()}</h2>
            <p className="text-sm text-gray-500 mt-1">Quản lý danh sách ngân hàng nhận tiền</p>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-md shadow-orange-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Thêm tài khoản
          </button>
        </div>

        {/* List Content */}
        <div className="p-0">
          {loading && bankAccounts.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Đang tải dữ liệu...</div>
          ) : bankAccounts.length === 0 ? (
             <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                </div>
                <h3 className="text-gray-900 font-medium">Chưa có tài khoản nào</h3>
                <p className="text-gray-500 text-sm mt-1">Hãy thêm tài khoản ngân hàng để thực hiện giao dịch.</p>
             </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4 font-semibold">Ngân hàng</th>
                    <th className="px-6 py-4 font-semibold">Số tài khoản</th>
                    <th className="px-6 py-4 font-semibold">Chủ tài khoản</th>
                    <th className="px-6 py-4 font-semibold">Trạng thái</th>
                    <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bankAccounts.map((acc) => (
                    <tr key={acc.bankAccountId} className="hover:bg-orange-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">{acc.bankName}</span>
                        {acc.branch && <div className="text-xs text-gray-400 mt-0.5">{acc.branch}</div>}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-700">{acc.bankAccountNumber}</td>
                      <td className="px-6 py-4 text-gray-700">{acc.bankAccountHolder}</td>
                      <td className="px-6 py-4">
                        {acc.default ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                             <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                             Mặc định
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => openEdit(acc)}
                            className="text-gray-400 hover:text-orange-600 transition-colors p-1" title="Sửa"
                          >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          {!acc.default && (
                            <button 
                                onClick={() => handleDelete(acc.bankAccountId)}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Xóa"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- SLIDE-OVER DRAWER (Thay thế Modal) --- */}
      {/* Backdrop */}
      {isDrawerOpen && (
        <div 
            className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 transition-opacity"
            onClick={closeDrawer}
        ></div>
      )}

      {/* Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-orange-50/50">
                <h3 className="text-xl font-bold text-gray-800">
                    {editingId ? "Cập nhật tài khoản" : "Thêm tài khoản mới"}
                </h3>
                <button onClick={closeDrawer} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {/* Drawer Body (Form) */}
            <div className="flex-1 overflow-y-auto p-6">
                <form id="bankForm" onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Alert Box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
                        <span className="text-xl">💡</span>
                        <p className="text-sm text-blue-800 leading-relaxed">
                            Tài khoản được đặt làm <strong>mặc định</strong> sẽ được ưu tiên sử dụng để nhận tiền khi rút tiền từ ví.
                        </p>
                    </div>

                    {/* Số tài khoản */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Số tài khoản <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.bankAccountNumber ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-100'} focus:ring-4 focus:outline-none transition-all`}
                            placeholder="Nhập số tài khoản"
                            value={formData.bankAccountNumber}
                            onChange={(e) => setFormData({...formData, bankAccountNumber: e.target.value})}
                        />
                        {errors.bankAccountNumber && <p className="mt-1 text-sm text-red-500">{errors.bankAccountNumber}</p>}
                    </div>

                    {/* Ngân hàng Selector (Custom Component) */}
                    <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngân hàng <span className="text-red-500">*</span></label>
                         <BankSelector 
                            value={formData.bankName}
                            onChange={(val) => setFormData({...formData, bankName: val})}
                            className=""
                         />
                         {errors.bankName && <p className="mt-1 text-sm text-red-500">{errors.bankName}</p>}
                    </div>

                    {/* Chủ tài khoản */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên chủ tài khoản <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            className={`w-full px-4 py-2.5 rounded-lg border ${errors.bankAccountHolder ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-orange-500 focus:ring-orange-100'} focus:ring-4 focus:outline-none transition-all uppercase placeholder:normal-case`}
                            placeholder="NGUYEN VAN A"
                            value={formData.bankAccountHolder}
                            onChange={(e) => setFormData({...formData, bankAccountHolder: e.target.value.toUpperCase()})}
                        />
                        {errors.bankAccountHolder && <p className="mt-1 text-sm text-red-500">{errors.bankAccountHolder}</p>}
                    </div>

                    {/* Chi nhánh */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Chi nhánh</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 focus:outline-none transition-all"
                            placeholder="VD: CN Hoàn Kiếm (Không bắt buộc)"
                            value={formData.branch}
                            onChange={(e) => setFormData({...formData, branch: e.target.value})}
                        />
                    </div>

                    {/* Checkbox Default */}
                    <div className="flex items-center gap-3 pt-2">
                        <input 
                            id="isDefault"
                            type="checkbox" 
                            className="w-5 h-5 text-orange-500 border-gray-300 rounded focus:ring-orange-500 cursor-pointer accent-orange-500"
                            checked={formData.isDefault}
                            onChange={(e) => setFormData({...formData, isDefault: e.target.checked})}
                        />
                        <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer select-none">
                            Đặt làm tài khoản mặc định
                        </label>
                    </div>

                </form>
            </div>

            {/* Drawer Footer (Actions) */}
            <div className="px-6 py-5 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
                 <button 
                    type="button" 
                    onClick={closeDrawer}
                    className="px-5 py-2.5 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                >
                    Hủy bỏ
                 </button>
                 <button 
                    type="submit" 
                    form="bankForm"
                    disabled={submitting}
                    className={`px-6 py-2.5 rounded-lg text-white font-medium shadow-md transition-all flex items-center gap-2
                        ${submitting ? 'bg-orange-300 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'}
                    `}
                >
                    {submitting && (
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    )}
                    {editingId ? "Cập nhật" : "Thêm mới"}
                 </button>
            </div>
        </div>
      </div>
    </div>
  );
}