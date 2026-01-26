"use client";

import { Column } from "@/components/DataTable/type";
import {
  Employee,
  EmployeeStatus,
  statusLabelMap,
} from "../../_types/employee.type";
import { cn } from "@/utils/cn";
import { MapPin, Briefcase, Eye, Edit2, DollarSign } from "lucide-react";
import { ActionBtn } from "@/components";
import Image from "next/image";

export const getEmployeeColumns = (
  onView: (emp: Employee) => void,
  onEdit: (emp: Employee) => void,
  onPayroll: (id: string) => void,
): Column<Employee>[] => [
  {
    header: "Nhân sự thực thi",
    render: (emp) => (
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center border-2 border-white shadow-lg overflow-hidden shrink-0 relative">
          {emp.imageUrl ? (
            <Image
              src={emp.imageUrl}
              alt={emp.fullName}
              fill
              sizes="48px"
              className="object-cover"
              priority={false}
            />
          ) : (
            <span className="text-orange-500 font-bold text-lg">
              {emp.fullName.charAt(0)}
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-gray-900 tracking-tight text-sm leading-none truncate">
            {emp.fullName}
          </p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
            <MapPin size={10} className="text-orange-500" /> {emp.phone}
          </p>
        </div>
      </div>
    ),
  },
  {
    header: "Vị trí & Phòng ban",
    render: (emp) => (
      <div className="space-y-1">
        <p className="text-sm font-bold text-gray-700 italic flex items-center gap-1">
          <Briefcase size={12} className="text-orange-400" /> {emp.positionName}
        </p>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-4">
          {emp.departmentName}
        </p>
      </div>
    ),
  },
  {
    header: "Tình trạng",
    align: "center",
    render: (emp) => {
      const configs = {
        ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-100",
        ON_LEAVE: "bg-amber-50 text-amber-600 border-amber-100",
        RESIGNED: "bg-gray-100 text-gray-500 border-gray-200",
        TERMINATED: "bg-red-50 text-red-600 border-red-100",
        RETIRED: "bg-blue-50 text-blue-600 border-blue-100",
      };
      return (
        <span
          className={cn(
            "px-3 py-1 text-[9px] font-bold rounded-full uppercase tracking-widest border",
            configs[emp.status] || configs.RESIGNED,
          )}
        >
          {statusLabelMap[emp.status]}
        </span>
      );
    },
  },
  {
    header: "Quản trị",
    align: "right",
    render: (emp) => (
      <div className="flex justify-end gap-2 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <ActionBtn
          onClick={() => onView(emp)}
          icon={<Eye size={14} />}
          color="hover:text-blue-500"
        />
        <ActionBtn
          onClick={() => onEdit(emp)}
          icon={<Edit2 size={14} />}
          color="hover:text-orange-500"
        />
        <ActionBtn
          onClick={() => onPayroll(emp.employeeId)}
          icon={<DollarSign size={14} />}
          color="hover:text-emerald-500"
        />
      </div>
    ),
  },
];
