"use client";

import { ButtonField, FormInput } from "@/components";
import { Button } from "@/components/button";
import { PortalModal } from "@/features/PortalModal";
import { useToast } from "@/hooks/useToast";
import {
  CheckCircle2,
  Fingerprint,
  Info,
  Loader2,
  Plus,
  Save,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRBAC } from "../../../_hooks/useRBAC";
import type { Role } from "../../../_types/dto/rbac.dto";

interface RolePermissionsModalProps {
  role: Role | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RolePermissionsModal = ({
  role,
  open,
  onClose,
  onSuccess,
}: RolePermissionsModalProps) => {
  const {
    loading,
    allPermissions,
    rolePermissions,
    fetchAllPermissions,
    fetchRolePermissions,
    updateRolePermissions,
  } = useRBAC();

  const { success: showSuccessToast } = useToast();

  // State lưu trữ IDs các quyền đã chọn
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (open && role) {
      fetchAllPermissions({ size: 1000 });
      fetchRolePermissions(role.roleId, { size: 1000 });
    }
  }, [open, role]);

  useEffect(() => {
    if (rolePermissions) {
      setTargetKeys(rolePermissions.map((p) => p.permissionId));
    }
  }, [rolePermissions]);

  // Lọc danh sách dựa trên ô tìm kiếm
  const availablePermissions = useMemo(() => {
    return allPermissions.filter((p) => {
      const matchSearch =
        p.permissionName.toLowerCase().includes(searchText.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchText.toLowerCase());
      return matchSearch && !targetKeys.includes(p.permissionId);
    });
  }, [allPermissions, targetKeys, searchText]);

  const selectedPermissions = useMemo(() => {
    return allPermissions.filter((p) => targetKeys.includes(p.permissionId));
  }, [allPermissions, targetKeys]);

  const handleAdd = (id: string) => {
    setTargetKeys((prev) => [...prev, id]);
  };

  const handleRemove = (id: string) => {
    setTargetKeys((prev) => prev.filter((key) => key !== id));
  };

  const handleSave = async () => {
    if (!role) return;
    const success = await updateRolePermissions(role.roleId, {
      permissionIds: targetKeys,
    });

    if (success) {
      showSuccessToast("Cập nhật quyền hạn cho vai trò thành công!");
      onSuccess();
      onClose();
    }
  };

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      width="max-w-5xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl shadow-sm">
            <Fingerprint size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-gray-800 uppercase text-lg leading-none tracking-tight">
              Phân quyền vai trò
            </span>
            <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1">
              Role: {role?.roleName}
            </span>
          </div>
        </div>
      }
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="hidden sm:flex items-center gap-2 text-gray-400 italic text-[11px] font-medium">
            <Info size={14} />
            Thay đổi sẽ có hiệu lực ngay sau khi lưu
          </div>
          <div className="flex gap-3">
            <Button
              variant="edit"
              onClick={onClose}
              className="rounded-xl px-6 border-gray-200"
            >
              Hủy
            </Button>
            <ButtonField
              onClick={handleSave}
              loading={loading}
              type="login"
              className="w-44! h-11 rounded-xl shadow-lg shadow-orange-500/20 border-0"
            >
              <span className="flex items-center gap-2">
                <Save size={18} /> Lưu thay đổi
              </span>
            </ButtonField>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search Header */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors z-10">
            <Search size={18} />
          </div>
          <FormInput
            placeholder="Tìm kiếm mã quyền hạn hoặc mô tả..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-12 h-14 bg-gray-50/50 rounded-2xl border-transparent focus:bg-white focus:ring-4 focus:ring-orange-500/10 transition-all shadow-inner font-bold text-sm"
          />
        </div>

        {loading && allPermissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 bg-gray-50/50 rounded-4xl border border-dashed border-gray-200">
            <Loader2
              className="animate-spin text-orange-500"
              size={40}
              strokeWidth={1.5}
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 animate-pulse">
              Đang đồng bộ dữ liệu...
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-125">
            <div className="flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
                  Quyền hạn khả dụng ({availablePermissions.length})
                </span>
              </div>
              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {availablePermissions.map((p) => (
                  <div
                    key={p.permissionId}
                    className="group flex items-center justify-between p-3 rounded-2xl hover:bg-orange-50 transition-colors border border-transparent hover:border-orange-100 mb-1"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-gray-800 text-[13px] group-hover:text-orange-600 transition-colors truncate">
                        {p.permissionName}
                      </div>
                      <div className="text-[11px] text-gray-400 leading-tight line-clamp-1 italic">
                        {p.description}
                      </div>
                    </div>
                    <button
                      onClick={() => handleAdd(p.permissionId)}
                      className="p-2 bg-white text-gray-400 hover:text-orange-500 hover:bg-orange-100 rounded-xl transition-all shadow-sm active:scale-90"
                    >
                      <Plus size={16} strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Selected */}
            <div className="flex flex-col bg-white border border-orange-100 rounded-3xl overflow-hidden shadow-sm ring-4 ring-orange-500/5">
              <div className="px-5 py-4 bg-orange-50/50 border-b border-orange-100 flex justify-between items-center">
                <span className="text-[11px] font-bold uppercase tracking-widest text-orange-600">
                  Quyền hạn đã cấp ({targetKeys.length})
                </span>
                <CheckCircle2 size={16} className="text-orange-500" />
              </div>
              <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                {selectedPermissions.map((p) => (
                  <div
                    key={p.permissionId}
                    className="group flex items-center justify-between p-3 rounded-2xl bg-orange-50/30 border border-orange-100/50 mb-1"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-orange-700 text-[13px] truncate">
                        {p.permissionName}
                      </div>
                      <div className="text-[11px] text-orange-400 leading-tight line-clamp-1 italic">
                        {p.description}
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(p.permissionId)}
                      className="p-2 bg-white text-orange-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm active:scale-90"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
                {targetKeys.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 opacity-60 italic text-sm">
                    Chưa có quyền hạn nào được chọn
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-orange-500" />
            <span className="text-[11px] font-bold text-gray-600 uppercase tracking-widest">
              Tóm lược phân quyền
            </span>
          </div>
          <div className="text-xs font-bold text-orange-600 bg-white px-4 py-1.5 rounded-xl border border-orange-200 shadow-sm">
            {targetKeys.length} / {allPermissions.length} Quyền hạn được thiết
            lập
          </div>
        </div>
      </div>
    </PortalModal>
  );
};
