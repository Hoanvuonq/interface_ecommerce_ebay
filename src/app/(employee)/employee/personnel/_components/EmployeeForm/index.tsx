"use client";

import {
  ButtonField,
  FiedFileUpload,
  FormInput,
  SectionHeader,
} from "@/components";
import { Button } from "@/components/button";
import { PortalModal } from "@/features/PortalModal";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { toPublicUrl } from "@/utils/storage/url";
import dayjs from "dayjs";
import {
  Briefcase,
  Image as ImageIcon,
  Loader2,
  Shield,
  User,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";
import _ from "lodash";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useEmployeeFormLogic } from "../../_hooks/useEmployeeForm";
import {
  Employee,
  genderLabelMap,
  statusLabelMap,
  workerTypeLabelMap,
} from "../../_types/employee.type";
import { FormSelectWrapper } from "../FormSelectWrapper";
import { EmployeeFormProps } from "./type";

export default function EmployeeForm(props: EmployeeFormProps) {
  const { open, employee, onClose, onSuccess, mode } = props;
  const {
    departments,
    positions,
    isSubmitting,
    setSelectedDeptId,
    processFormSubmit,
  } = useEmployeeFormLogic(open, mode, employee ?? null, onSuccess, onClose);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      phone: "",
      addressDetail: "",
      gender: "MALE",
      type: "FULL_TIME",
      status: "ACTIVE",
      departmentId: "",
      positionId: "",
      startDate: "",
      endDate: "",
      dateOfBirth: "",
      imageUrl: [] as any[],
      password: "",
      confirmPassword: "",
    },
  });

  const watchedDeptId = watch("departmentId");

  useEffect(() => {
    if (open) {
      if (mode === "update" && employee) {
        const data = _.cloneDeep(employee);
        const dateFields = ["dateOfBirth", "startDate", "endDate"];
        dateFields.forEach((field) => {
          if (data[field as keyof Employee]) {
            (data as any)[field] = dayjs(
              data[field as keyof Employee] as string,
            ).format("YYYY-MM-DD");
          }
        });

        reset({
          ...data,
          endDate: data.endDate ?? "",
          imageUrl: employee.imageUrl
            ? [
                {
                  uid: "-1",
                  name: "avatar",
                  status: "done",
                  url: toPublicUrl(toSizedVariant(employee.imageUrl, "_orig")),
                },
              ]
            : [],
        });
      } else {
        reset();
      }
    }
  }, [open, employee, mode, reset]);

  useEffect(() => {
    setSelectedDeptId(watchedDeptId);
  }, [watchedDeptId, setSelectedDeptId]);

  return (
    <PortalModal
      isOpen={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
            <User size={20} strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tight text-xl text-gray-800 uppercase italic">
            {mode === "create" ? "Khởi tạo" : "Cập nhật"}{" "}
            <span className="text-orange-500">Nhân sự</span>
          </span>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-3 border-t border-gray-100">
          <Button
            variant="edit"
            className="px-8 h-11 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-gray-500 hover:bg-gray-100 transition-all border-gray-200"
            onClick={onClose}
            type="button"
          >
            Hủy bỏ
          </Button>
          <ButtonField
            htmlType="submit"
            type="login"
            disabled={isSubmitting}
            className="w-48! flex items-center justify-center gap-2 h-11 rounded-2xl text-xs font-bold shadow-xl shadow-orange-500/20 transition-all active:scale-95 border-0"
          >
            {isSubmitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                <Shield size={18} />
                {mode === "create" ? "XÁC NHẬN TẠO" : "CẬP NHẬT HỒ SƠ"}
              </span>
            )}
          </ButtonField>
        </div>
      }
      width="max-w-4xl"
    >
      <form
        onSubmit={handleSubmit(processFormSubmit)}
        className="space-y-10 pb-6 animate-in fade-in slide-in-from-bottom-2 duration-500"
      >
        {/* SECTION 1: IDENTITY */}
        <div className="space-y-6">
          <SectionHeader icon={Shield} title="Thông tin tài khoản & Bảo mật" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-gray-50/50 p-6 rounded-4xl border border-gray-100">
            <FormInput
              label="Tên đăng nhập"
              disabled={mode === "update"}
              {...register("username", {
                required: "Tên đăng nhập là bắt buộc",
              })}
              error={errors.username?.message as string}
              placeholder="Ví dụ: nva_calatha"
            />
            <FormInput
              label="Email hệ thống"
              type="email"
              disabled={mode === "update"}
              {...register("email", { required: "Email là bắt buộc" })}
              error={errors.email?.message as string}
              placeholder="nva@calatha.com"
            />

            {mode === "create" && (
              <>
                <FormInput
                  label="Mật khẩu"
                  type="password"
                  {...register("password", {
                    required: "Mật khẩu là bắt buộc",
                  })}
                  error={errors.password?.message as string}
                  placeholder="••••••••"
                />
                <FormInput
                  label="Xác nhận mật khẩu"
                  type="password"
                  {...register("confirmPassword", {
                    required: "Vui lòng xác nhận mật khẩu",
                  })}
                  error={errors.confirmPassword?.message as string}
                  placeholder="••••••••"
                />
              </>
            )}
          </div>
        </div>

        {/* SECTION 2: PERSONAL INFO */}
        <div className="space-y-6">
          <SectionHeader icon={User} title="Dữ liệu nhân thân" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <FormInput
                label="Họ và tên khai sinh"
                {...register("fullName", { required: "Họ tên là bắt buộc" })}
                error={errors.fullName?.message as string}
                placeholder="NGUYỄN VĂN A"
                className="uppercase"
              />
            </div>
            <FormSelectWrapper
              label="Giới tính"
              name="gender"
              control={control}
              options={_.map(genderLabelMap, (l, v) => ({
                label: l,
                value: v,
              }))}
              errorMessage={errors.gender?.message as string}
            />
            <FormInput
              label="Ngày tháng năm sinh"
              type="date"
              {...register("dateOfBirth", {
                required: "Ngày sinh là bắt buộc",
              })}
              error={errors.dateOfBirth?.message as string}
            />
            <FormInput
              label="Số điện thoại liên lạc"
              {...register("phone", { required: "Số điện thoại là bắt buộc" })}
              error={errors.phone?.message as string}
              placeholder="09xx xxx xxx"
            />
            <FormInput
              label="Địa chỉ thường trú"
              {...register("addressDetail", {
                required: "Địa chỉ là bắt buộc",
              })}
              error={errors.addressDetail?.message as string}
              placeholder="Số nhà, tên đường, phường/xã..."
            />
          </div>
        </div>

        {/* SECTION 3: WORK INFO */}
        <div className="space-y-6">
          <SectionHeader
            icon={Briefcase}
            title="Hợp đồng & Phân cấp vận hành"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-6 bg-orange-50/30 rounded-4xl border border-orange-100/50">
            <FormSelectWrapper
              label="Phòng ban trực thuộc"
              name="departmentId"
              control={control}
              options={departments.map((d: any) => ({
                label: d.departmentName,
                value: d.departmentId,
              }))}
              errorMessage={errors.departmentId?.message as string}
            />
            <FormSelectWrapper
              label="Chức vụ công tác"
              name="positionId"
              control={control}
              disabled={!watchedDeptId}
              placeholder={
                watchedDeptId ? "Chọn chức vụ" : "Vui lòng chọn phòng ban trước"
              }
              options={positions.map((p: any) => ({
                label: p.positionName,
                value: p.positionId,
              }))}
              errorMessage={errors.positionId?.message as string}
            />
            <FormSelectWrapper
              label="Hình thức hợp đồng"
              name="type"
              control={control}
              options={_.map(workerTypeLabelMap, (l, v) => ({
                label: l,
                value: v,
              }))}
            />
            <FormSelectWrapper
              label="Trạng thái nhân sự"
              name="status"
              control={control}
              options={_.map(statusLabelMap, (l, v) => ({
                label: l,
                value: v,
              }))}
            />
            <FormInput
              label="Ngày vào làm"
              type="date"
              {...register("startDate")}
            />
            <FormInput
              label="Ngày kết thúc dự kiến"
              type="date"
              {...register("endDate")}
            />
          </div>
        </div>

        {/* SECTION 4: IMAGE */}
        <div className="space-y-6">
          <SectionHeader icon={ImageIcon} title="Hình ảnh định danh" />
          <div className="p-8 bg-gray-50 rounded-4xl border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors">
            <Controller
              name="imageUrl"
              control={control}
              render={({ field }) => (
                <FiedFileUpload
                  value={field.value}
                  onChange={field.onChange}
                  maxCount={1}
                  variant="grid"
                  allowedTypes={["image/png", "image/jpeg", "image/jpg"]}
                  description="Ảnh chân dung nhân sự (PNG, JPG - Tối đa 5MB)"
                />
              )}
            />
          </div>
        </div>
      </form>
    </PortalModal>
  );
}
