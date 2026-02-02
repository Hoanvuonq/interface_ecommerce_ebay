import { Column } from "@/components/DataTable/type";
import { CategoryResponse } from "@/types/categories/category.detail";
import { cn } from "@/utils/cn";
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FileText,
  Edit2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { ActionBtn } from "@/components";
import { toPublicUrl } from "@/utils/storage/url"; 
import Image from "next/image";

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
    header: "Ảnh",
    align: "center",
    render: (row) => {
      // Xử lý path có chứa ký tự đại diện '*' từ server
      const rawPath = row.imagePath;
      const finalSrc = rawPath
        ? toPublicUrl(rawPath.replace("*", "thumbnail"))
        : null;

      return (
        <div className="flex justify-center">
          {finalSrc ? (
            <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
              <Image
                src={finalSrc}
                alt={row.name}
                fill // Dùng fill để fit với div cha
                sizes="40px"
                className="object-cover"
                // Placeholder khi đang load hoặc lỗi
                blurDataURL="/placeholder-image.png"
                onError={(e) => {
                  // Lưu ý: Next Image xử lý lỗi khác img thường,
                  // bạn có thể dùng state hoặc đơn giản là để nó hiển thị fallback nếu cần
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 border border-dashed border-gray-200">
              <ImageIcon size={16} />
            </div>
          )}
        </div>
      );
    },
  },
  {
    header: "Cấu trúc danh mục",
    render: (row, index, level = 0) => (
      <div
        className="flex items-center"
        style={{ paddingLeft: `${(row as any).level * 28}px` }} // Sử dụng level từ dữ liệu đã flatten
      >
        {row.children && row.children.length > 0 ? (
          <button
            onClick={() => toggleExpand(row.id)}
            className="mr-2 p-1 hover:bg-orange-100 hover:text-orange-600 rounded text-gray-400 transition-colors"
          >
            {expandedKeys.has(row.id) ? (
              <ChevronDown size={14} strokeWidth={3} />
            ) : (
              <ChevronRight size={14} strokeWidth={3} />
            )}
          </button>
        ) : (
          <span className="w-7" />
        )}
        <div
          className={cn(
            "p-1.5 rounded-lg mr-3 shadow-sm transition-colors",
            row.children && row.children.length > 0
              ? "bg-orange-50 text-orange-500"
              : "bg-blue-50 text-blue-400",
          )}
        >
          {row.children && row.children.length > 0 ? (
            <Folder size={15} fill="currentColor" fillOpacity={0.2} />
          ) : (
            <FileText size={15} />
          )}
        </div>
        <span className="font-bold text-gray-700 tracking-tight group-hover:text-orange-500 transition-colors">
          {row.name}
        </span>
      </div>
    ),
  },
  {
    header: "Định danh (Slug)",
    accessor: "slug",
    className:
      "text-[11px] font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md",
  },
  {
    header: "Trạng thái",
    align: "center",
    render: (row) => (
      <span
        className={cn(
          "px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border shadow-sm transition-all",
          row.active
            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
            : "bg-rose-50 text-rose-400 border-rose-100",
        )}
      >
        {row.active ? "Hoạt động" : "Tạm ngưng"}
      </span>
    ),
  },
  {
    header: "Thao tác",
    align: "right",
    render: (row) => (
      <div className="flex justify-end gap-1 pr-2">
        <ActionBtn
          onClick={() => onEdit(row)}
          icon={<Edit2 size={14} />}
        />
        <ActionBtn
          onClick={() => onDelete(row)}
          icon={<Trash2 size={14} />}
        />
      </div>
    ),
  },
];
