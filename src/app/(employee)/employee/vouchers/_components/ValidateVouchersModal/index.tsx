"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  ClipboardList,
  Activity,
  LayoutGrid,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import type { ValidateVouchersResponse } from "../../_types/voucher-v2.type";
import { FormInput, DataTable, CustomButtonActions } from "@/components";
import { PortalModal } from "@/features/PortalModal";
import { getValidColumns, getInvalidColumns } from "./ValidateColumns";

interface ValidateVouchersModalProps {
  open: boolean;
  onClose: () => void;
  onValidate: (codes: string[]) => Promise<ValidateVouchersResponse>;
  loading?: boolean;
}

export const ValidateVouchersModal = ({
  open,
  onClose,
  onValidate,
}: ValidateVouchersModalProps) => {
  const [codesInput, setCodesInput] = useState("");
  const [result, setResult] = useState<ValidateVouchersResponse | null>(null);
  const [validating, setValidating] = useState(false);

  useEffect(() => {
    if (!open) {
      setCodesInput("");
      setResult(null);
    }
  }, [open]);

  const handleValidate = async () => {
    const codes = codesInput
      .split("\n")
      .map((c) => c.trim())
      .filter(Boolean);

    if (codes.length === 0) return;

    setValidating(true);
    try {
      const response = await onValidate(codes);
      setResult(response);
    } catch (error) {
      console.error("Validation error:", error);
    } finally {
      setValidating(false);
    }
  };

  const handleClose = () => {
    setCodesInput("");
    setResult(null);
    onClose();
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={handleClose}
      width="max-w-5xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500 text-white rounded-xl shadow-lg shadow-orange-200">
            <Zap size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold uppercase tracking-tight text-gray-800">
            Cơ chế Validate Voucher
          </span>
        </div>
      }
      footer={
        <CustomButtonActions
          onCancel={handleClose}
          onSubmit={handleValidate}
          isLoading={validating}
          isDisabled={!codesInput.trim()}
          submitText="Thực thi Validate"
          submitIcon={Activity}
          containerClassName="w-full flex gap-3 border-t-0 pt-0 justify-end"
          className="w-44! rounded-4xl h-12 shadow-orange-200 shadow-lg"
        />
      }
    >
      <div className="space-y-8 py-2">
        {/* Input Area */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <ClipboardList size={16} className="text-orange-500" />
            <h3 className="text-[12px] font-bold  text-gray-400">
              Danh sách mã đầu vào
            </h3>
          </div>
          <div className="relative">
            <FormInput
              isTextArea
              placeholder={`VOUCHER1\nVOUCHER2\n...\nNhập mỗi mã trên một dòng hệ thống sẽ tự động bóc tách dữ liệu.`}
              value={codesInput}
              onChange={(e) => setCodesInput(e.target.value)}
              className="min-h-40 p-6  tracking-widest bg-gray-50/50 border-gray-100 rounded-4xl focus:bg-white transition-all shadow-inner"
              disabled={validating}
            />
          </div>
        </div>

        {/* Results Area */}
        {result && !validating && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-emerald-500 shadow-sm">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-[11px] font-bold uppercase text-emerald-700 tracking-wider">
                    Hợp lệ (Protocol Passed)
                  </span>
                </div>
                <span className="text-2xl font-bold text-emerald-600 italic">
                  {result.totalValid}
                </span>
              </div>
              <div className="p-4 rounded-3xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl text-rose-500 shadow-sm">
                    <XCircle size={18} />
                  </div>
                  <span className="text-[11px] font-bold uppercase text-rose-700 tracking-wider">
                    Từ chối (Access Denied)
                  </span>
                </div>
                <span className="text-2xl font-bold text-rose-600 italic">
                  {result.totalInvalid}
                </span>
              </div>
            </div>

            {/* Tables Section */}
            <div className="space-y-8">
              {/* Valid Vouchers */}
              {result.validVouchers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-2">
                    <LayoutGrid size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Bản ghi hợp lệ
                    </span>
                  </div>
                  <DataTable
                    data={result.validVouchers}
                    columns={getValidColumns()}
                    loading={false}
                    rowKey="code"
                    size={5}
                    page={0}
                    totalElements={result.validVouchers.length}
                    onPageChange={() => {}}
                  />
                </div>
              )}

              {/* Invalid Vouchers */}
              {result.invalidVouchers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-2">
                    <LayoutGrid size={14} className="text-rose-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Bản ghi lỗi hệ thống
                    </span>
                  </div>
                  <DataTable
                    data={result.invalidVouchers}
                    columns={getInvalidColumns()}
                    loading={false}
                    rowKey="code"
                    size={5}
                    page={0}
                    totalElements={result.invalidVouchers.length}
                    onPageChange={() => {}}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PortalModal>
  );
};
