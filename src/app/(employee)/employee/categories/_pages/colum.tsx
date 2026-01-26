import { Column } from "@/components/DataTable/type";
import { CategoryResponse } from "../_types/dto/category.dto";
import { cn } from "@/utils/cn";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Edit2,
  Trash2,
} from "lucide-react";
import { ActionBtn } from "@/components";

interface CategoryColumnProps {
  expandedKeys: Set<string>;
  toggleExpand: (id: string) => void;
  onEdit: (category: CategoryResponse) => void;
  onDelete: (category: CategoryResponse) => void;
}

export const getCategoryColumns = ({
  expandedKeys,
  toggleExpand,
  onEdit,
  onDelete,
}: CategoryColumnProps): Column<CategoryResponse>[] => [
  {
    header: "Cấu trúc danh mục",
    render: (
      row,
      index,
      level = 0, // Giả định row được truyền kèm level
    ) => (
      <div
        className="flex items-center"
        style={{ paddingLeft: `${level * 28}px` }}
      >
        {row.children && row.children.length > 0 ? (
          <button
            onClick={() => toggleExpand(row.id)}
            className="mr-2 p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors"
          >
            {expandedKeys.has(row.id) ? (
              <ChevronDown size={14} />
            ) : (
              <ChevronRight size={14} />
            )}
          </button>
        ) : (
          <span className="w-7" />
        )}
        <div
          className={cn(
            "p-1.5 rounded-lg mr-3 shadow-sm",
            row.children && row.children.length > 0
              ? "bg-orange-50 text-orange-500"
              : "bg-gray-50 text-gray-400",
          )}
        >
          {row.children && row.children.length > 0 ? (
            <Folder size={15} />
          ) : (
            <FileText size={15} />
          )}
        </div>
        <span className="font-bold text-gray-700 tracking-tight">
          {row.name}
        </span>
      </div>
    ),
  },
  {
    header: "Định danh (Slug)",
    accessor: "slug",
    className: "text-xs font-mono text-gray-500",
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (row) => (
      <span
        className={cn(
          "px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full border shadow-xs",
          row.active
            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
            : "bg-gray-50 text-gray-400 border-gray-100",
        )}
      >
        {row.active ? "Hoạt động" : "Vô hiệu"}
      </span>
    ),
  },
  {
    header: "Thao tác",
    align: "right",
    render: (row) => (
      <div className="flex justify-end gap-2 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pr-2">
        <ActionBtn
          onClick={() => onEdit(row)}
          icon={<Edit2 size={14} />}
          color="hover:text-blue-500"
        />
        <ActionBtn
          onClick={() => onDelete(row)}
          icon={<Trash2 size={14} />}
          color="hover:text-rose-500"
        />
      </div>
    ),
  },
];
