"use client";

import { genderOptions, statusLabelMap } from "@/types/user/user.type";
import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import { InformationEditorProps } from "../../_types/information";
import { InputField } from "@/components"; 
import { SelectField } from "@/components/selectField";
import { DateField } from "@/components/dateField";

const InformationEditor: React.FC<InformationEditorProps> = ({
  initialData,
  onSave,
  isEditing,
  formId,
}) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const readOnlyInputStyle = !isEditing
    ? "bg-gray-50 text-gray-500 ring-gray-100 border-gray-100 shadow-none focus:ring-0 cursor-default"
    : "";

  return (
    <form id={formId} onSubmit={handleSubmit} className="h-full relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        
        <div className="md:col-span-1">
          <ReadOnlyField label="Tên đăng nhập" value={formData.username} />
        </div>

        <div className="md:col-span-1">
          <ReadOnlyField label="Email" value={formData.email} />
        </div>

        <div className="md:col-span-1">
          <InputField
            label="Họ và tên"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Chưa cập nhật"
            itemClassName="mb-0"
            inputClassName={cn("rounded-xl py-3 font-medium", readOnlyInputStyle)}
          />
        </div>

        <div className="md:col-span-1">
          <InputField
            label="Số điện thoại"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="Chưa cập nhật"
            itemClassName="mb-0"
            inputClassName={cn("rounded-xl py-3 font-medium", readOnlyInputStyle)}
          />
        </div>
        <div className="md:col-span-1">
          <SelectField
            label="Giới tính"
            name="gender"
            value={formData.gender}
            options={genderOptions}
            onChange={handleInputChange}
            disabled={!isEditing}
            containerClassName="mb-0" 
          />
        </div>

        <div className="md:col-span-1">
          <DateField
            label="Ngày sinh"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            disabled={!isEditing}
            containerClassName="mb-0"
            inputClassName={cn(readOnlyInputStyle)}
          />
        </div>

        <div className="md:col-span-1">
          <Label label="Trạng thái" />
          <div className="mt-1 h-12 flex items-center">
            {formData.status ? (
              <span
                className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border",
                  formData.status === "ACTIVE"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full mr-2",
                    formData.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                  )}
                ></span>
                {statusLabelMap[formData.status as keyof typeof statusLabelMap] || formData.status}
              </span>
            ) : (
              <span className="text-gray-600 text-sm">-</span>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

const Label = ({ label }: { label: string }) => (
  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
    {label}
  </label>
);

const ReadOnlyField = ({ label, value }: { label: string; value: string }) => (
  <div>
    <Label label={label} />
    <div className="block w-full rounded-xl border-0 py-3 px-4 text-gray-500 bg-gray-50 shadow-none ring-1 ring-inset ring-gray-100 sm:text-sm sm:leading-6 font-medium cursor-default">
      {value}
    </div>
  </div>
);

export default InformationEditor;