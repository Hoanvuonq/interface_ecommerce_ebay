"use client";

import { Button } from "@/components/button/button";
import bankAccountService from "@/services/bank/bank-account.service";
import type {
  BankAccountResponse,
  CreateBankAccountRequest,
  UpdateBankAccountRequest,
} from "@/types/bank/bank-account.types";
import { BankAccountType } from "@/types/bank/bank-account.types";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaPlus } from "react-icons/fa";
import { CreateBankAccountModal } from "../../_components/CreateBankAccountModal";
import {
  BankAccountManagementProps,
  FormDataState,
  INITIAL_FORM_DATA,
} from "../../_types/bank";

export default function BankAccountManagement({
  accountType,
}: BankAccountManagementProps) {
  const [bankAccounts, setBankAccounts] = useState<BankAccountResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadBankAccounts();
  }, [accountType]);

  const loadBankAccounts = async () => {
    setLoading(true);
    try {
      const accounts = await bankAccountService.getMyBankAccounts(accountType);
      setBankAccounts(accounts);
    } catch (error: any) {
      console.error("Lỗi tải danh sách:", error);
      alert("Không thể tải danh sách tài khoản ngân hàng");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.bankAccountNumber)
      newErrors.bankAccountNumber = "Vui lòng nhập số tài khoản";
    else if (!/^[0-9]{4,30}$/.test(formData.bankAccountNumber))
      newErrors.bankAccountNumber = "Số tài khoản không hợp lệ (4-30 số)";

    if (!formData.bankName) newErrors.bankName = "Vui lòng chọn ngân hàng";
    if (!formData.bankAccountHolder)
      newErrors.bankAccountHolder = "Vui lòng nhập tên chủ tài khoản";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        const updatePayload: UpdateBankAccountRequest = {
          bankAccountNumber: formData.bankAccountNumber,
          bankName: formData.bankName,
          bankAccountHolder: formData.bankAccountHolder,
          branch: formData.branch,
          isDefault: formData.isDefault,
        };
        await bankAccountService.updateBankAccount(editingId, updatePayload);
      } else {
        const createPayload: CreateBankAccountRequest = {
          accountType,
          bankAccountNumber: formData.bankAccountNumber,
          bankName: formData.bankName,
          bankAccountHolder: formData.bankAccountHolder,
          branch: formData.branch,
          isDefault: formData.isDefault,
        };
        await bankAccountService.createBankAccount(createPayload);
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
      bankName: acc.bankName,
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

  useEffect(() => {
    if (isDrawerOpen) {
      setShowModal(true);
    } else {
      const timer = setTimeout(() => setShowModal(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isDrawerOpen]);

  return (
    <div className="w-full relative">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{getTitle()}</h2>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý danh sách ngân hàng nhận tiền
            </p>
          </div>

          <Button variant="edit" onClick={openCreate} icon={<FaPlus />}>
            Thêm tài khoản mới
          </Button>
        </div>

        <div className="p-0">
          {loading && bankAccounts.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              Đang tải dữ liệu...
            </div>
          ) : bankAccounts.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-orange-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-gray-900 font-medium">
                Chưa có tài khoản nào
              </h3>
              <p className="text-gray-500 text-sm mt-1">
                Hãy thêm tài khoản ngân hàng để thực hiện giao dịch.
              </p>
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
                    <th className="px-6 py-4 font-semibold text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bankAccounts.map((acc) => (
                    <tr
                      key={acc.bankAccountId}
                      className="hover:bg-orange-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-900">
                          {acc.bankName}
                        </span>
                        {acc.branch && (
                          <div className="text-xs text-gray-600 mt-0.5">
                            {acc.branch}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-gray-700">
                        {acc.bankAccountNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {acc.bankAccountHolder}
                      </td>
                      <td className="px-6 py-4">
                        {acc.default ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Mặc định
                          </span>
                        ) : (
                          <span className="text-gray-600 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => openEdit(acc)}
                            className="text-gray-600 hover:text-orange-600 transition-colors p-1"
                            title="Sửa"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          {!acc.default && (
                            <button
                              onClick={() => handleDelete(acc.bankAccountId)}
                              className="text-gray-600 hover:text-red-600 transition-colors p-1"
                              title="Xóa"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
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

      {showModal &&
        createPortal(
          <CreateBankAccountModal
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
            editingId={editingId}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            submitting={submitting}
            handleSubmit={handleSubmit}
          />,
          document.body
        )}
    </div>
  );
}
