"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import dayjs from "dayjs";
import _ from "lodash";
import { 
  Loader2, User, Shield, Briefcase, Image as ImageIcon, Info
} from "lucide-react";

import { 
  genderLabelMap, workerTypeLabelMap, statusLabelMap, 
  Employee 
} from "../../_types/employee.type"; 
import { ImageUploadField } from "@/app/(main)/profile/_components/ImageUploadField";
import { SelectComponent } from "@/components/SelectComponent"; 
import { PortalModal } from "@/features/PortalModal";
import { EmployeeFormProps } from "./type";
import { useEmployeeFormLogic } from "../../_hooks/useEmployeeForm";
import { toPublicUrl } from "@/utils/storage/url";
import { toSizedVariant } from "@/utils/products/media.helpers";
import { SectionHeader, InputField } from "@/components";
import { cn } from "@/utils/cn";
import { FormSelectWrapper } from "../FormSelectWrapper";

export default function EmployeeForm(props: EmployeeFormProps) {
  const { open, employee, onClose, onSuccess, mode } = props;
  const {
    departments,
    positions,
    isSubmitting,
    setSelectedDeptId,
    processFormSubmit
  } = useEmployeeFormLogic(open, mode, employee ?? null, onSuccess, onClose);

  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      username: "", email: "", fullName: "", phone: "", addressDetail: "",
      gender: "MALE", type: "FULL_TIME", status: "ACTIVE", departmentId: "", 
      positionId: "", startDate: "", endDate: "", dateOfBirth: "", 
      imageUrl: [] as any[], password: "", confirmPassword: ""
    }
  });
 const watchedDeptId = watch("departmentId");
 
  useEffect(() => {
    if (open) {
      if (mode === "update" && employee) {
        const data = _.cloneDeep(employee);
        const dateFields = ['dateOfBirth', 'startDate', 'endDate'];
        dateFields.forEach(field => {
          if (data[field as keyof Employee]) {
            (data as any)[field] = dayjs(data[field as keyof Employee] as string).format("YYYY-MM-DD");
          }
        });
        
        reset({
          ...data,
          endDate: data.endDate ?? "", 
          imageUrl: employee.imageUrl ? [{
            uid: "-1", name: "avatar", status: "done",
            url: toPublicUrl(toSizedVariant(employee.imageUrl, "_orig"))
          }] : []
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
      title={mode === "create" ? "Thêm nhân viên mới" : `Cập nhật: ${employee?.fullName}`}
      width="max-w-4xl"
    >
      <form onSubmit={handleSubmit(processFormSubmit)} className="space-y-4 pb-4">
        
        <div className="space-y-4">
          <SectionHeader icon={<Shield size={18}/>} title="Thông tin định danh" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <InputField 
              label="Tên đăng nhập" 
              disabled={mode === "update"} 
              {...register("username", { required: "Tên đăng nhập là bắt buộc" })} 
              errorMessage={errors.username?.message as string}
              itemClassName="mb-2"
            />
            <InputField 
              label="Email hệ thống" 
              disabled={mode === "update"} 
              {...register("email", { required: "Email là bắt buộc" })} 
              errorMessage={errors.email?.message as string}
              itemClassName="mb-2"
            />
            
            {mode === "create" && (
              <>
                <InputField 
                  label="Mật khẩu" 
                  type="password" 
                  {...register("password", { required: "Mật khẩu là bắt buộc" })} 
                  errorMessage={errors.password?.message as string}
                  itemClassName="mb-2"
                />
                <InputField 
                  label="Xác nhận mật khẩu" 
                  type="password" 
                  {...register("confirmPassword", { required: "Vui lòng xác nhận mật khẩu" })} 
                  errorMessage={errors.confirmPassword?.message as string}
                  itemClassName="mb-2"
                />
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader icon={<User size={18}/>} title="Thông tin cá nhân" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
            <div className="md:col-span-2">
              <InputField 
                label="Họ và tên" 
                {...register("fullName", { required: "Họ tên là bắt buộc" })} 
                errorMessage={errors.fullName?.message as string}
                itemClassName="mb-2"
              />
            </div>
            <FormSelectWrapper
              label="Giới tính"
              name="gender"
              control={control}
              options={_.map(genderLabelMap, (l, v) => ({label: l, value: v}))}
              errorMessage={errors.gender?.message as string}
            />
            
            <InputField 
              label="Ngày sinh" 
              type="date" 
              {...register("dateOfBirth", { required: "Ngày sinh là bắt buộc" })} 
              errorMessage={errors.dateOfBirth?.message as string}
              itemClassName="mb-2"
            />
            <InputField 
              label="Số điện thoại" 
              {...register("phone", { required: "Số điện thoại là bắt buộc" })} 
              errorMessage={errors.phone?.message as string}
              itemClassName="mb-2"
            />
            <InputField 
              label="Địa chỉ cụ thể" 
              {...register("addressDetail", { required: "Địa chỉ là bắt buộc" })} 
              errorMessage={errors.addressDetail?.message as string}
              itemClassName="mb-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader icon={<Briefcase size={18}/>} title="Hợp đồng & Vận hành" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <FormSelectWrapper
              label="Phòng ban"
              name="departmentId"
              control={control}
              options={departments.map((d: any) => ({ label: d.departmentName, value: d.departmentId }))}
              errorMessage={errors.departmentId?.message as string}
            />
            <FormSelectWrapper
              label="Chức vụ"
              name="positionId"
              control={control}
              disabled={!watchedDeptId}
              placeholder={watchedDeptId ? "Chọn chức vụ" : "Chọn phòng ban trước"}
              options={positions.map((p: any) => ({ label: p.positionName, value: p.positionId }))}
              errorMessage={errors.positionId?.message as string}
            />
            <FormSelectWrapper
              label="Hình thức"
              name="type"
              control={control}
              options={_.map(workerTypeLabelMap, (l, v) => ({ label: l, value: v }))}
            />
            <FormSelectWrapper
              label="Trạng thái việc làm"
              name="status"
              control={control}
              options={_.map(statusLabelMap, (l, v) => ({ label: l, value: v }))}
            />
            
            <InputField 
              label="Ngày bắt đầu" 
              type="date" 
              {...register("startDate")} 
              itemClassName="mb-2"
            />
            <InputField 
              label="Ngày kết thúc (Dự kiến)" 
              type="date" 
              {...register("endDate")} 
              itemClassName="mb-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <SectionHeader icon={<ImageIcon size={18}/>} title="Hình ảnh định danh" />
          <div className="p-6 bg-slate-50 rounded-4xl border border-dashed border-slate-200">
            <Controller name="imageUrl" control={control} render={({field}) => (
              <ImageUploadField value={field.value} onChange={field.onChange} maxCount={1} />
            )} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
          <button type="button" onClick={onClose} className="px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-100 transition-all">Hủy bỏ</button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-orange-500/20 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {isSubmitting && <Loader2 size={14} className="animate-spin" />}
            {mode === "create" ? "Tạo nhân sự" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </PortalModal>
  );
}
