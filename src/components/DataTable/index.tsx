"use client";

import React, { useState, useEffect } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiInbox,
  FiLoader,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { DataTableProps } from "./type";

export const DataTable = <T,>({
  data,
  columns,
  loading,
  rowKey,
  emptyMessage = "Không có dữ liệu",
  page,
  size,
  totalElements,
  onPageChange,
  headerContent,
}: DataTableProps<T>) => {
  const totalPages = Math.ceil(totalElements / size);
  const fromItem = totalElements > 0 ? page * size + 1 : 0;
  const toItem = Math.min((page + 1) * size, totalElements);

  const [direction, setDirection] = useState(0);
  const [prevPage, setPrevPage] = useState(page);

  useEffect(() => {
    if (page > prevPage) setDirection(1);
    else if (page < prevPage) setDirection(-1);
    setPrevPage(page);
  }, [page, prevPage]);

  const getRowKey = (item: T, index: number) => {
    if (typeof rowKey === "function") return rowKey(item);
    if (
      rowKey &&
      typeof rowKey === "string" &&
      item &&
      typeof item === "object" &&
      rowKey in item
    ) {
      return (item[rowKey as keyof T] as unknown as string) || index;
    }
    return index;
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 20 : -20, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -20 : 20, opacity: 0 }),
  };

  return (
    <div className="space-y-4 w-full">
      {headerContent && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
          {headerContent}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-4xl shadow-custom overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={cn(
                      "px-6 py-4 text-[12px] font-bold uppercase text-gray-600 whitespace-nowrap",
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left",
                      col.headerClassName,
                      col.headerClassName
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="relative min-h-50">
              <AnimatePresence mode="wait" custom={direction}>
                {loading ? (
                  <motion.tr
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={columns.length} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-orange-50 rounded-2xl">
                          <FiLoader className="w-6 h-6 text-orange-500 animate-spin" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                          Đang tải dữ liệu...
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ) : data.length === 0 ? (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={columns.length} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center ring-8 ring-gray-50/50">
                          <FiInbox className="w-8 h-8 text-gray-200" />
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-bold text-xs uppercase tracking-widest">
                            Trống
                          </h3>
                          <p className="text-[10px] text-gray-500 font-medium uppercase">
                            {emptyMessage}
                          </p>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  <React.Fragment key={page}>
                    {data.map((item, rowIdx) => (
                      <motion.tr
                        key={getRowKey(item, rowIdx)}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                          x: { type: "spring", stiffness: 400, damping: 40 },
                          opacity: { duration: 0.2 },
                          delay: rowIdx * 0.02,
                        }}
                        className="group hover:bg-orange-50/20 transition-colors border-b border-gray-50 last:border-none"
                      >
                        {columns.map((col, colIdx) => {
                          // Thực hiện render nội dung cột
                          const rendered = col.render
                            ? col.render(item, rowIdx)
                            : null;

                          let cellContent: React.ReactNode = null;
                          let cellRowSpan: number | undefined = undefined;

                          // LOGIC FIX: Kiểm tra nếu render trả về object có chứa rowSpan
                          if (
                            rendered &&
                            typeof rendered === "object" &&
                            "content" in rendered
                          ) {
                            if ((rendered as any).rowSpan === 0) return null;

                            cellContent = (rendered as any).content;
                            cellRowSpan = (rendered as any).rowSpan;
                          } else if (col.render) {
                            cellContent = rendered as React.ReactNode;
                          } else if (col.accessor) {
                            cellContent = item[col.accessor] as React.ReactNode;
                          }

                          return (
                            <td
                              key={colIdx}
                              rowSpan={cellRowSpan}
                              className={cn(
                                "px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-700",
                                col.align === "center"
                                  ? "text-center"
                                  : col.align === "right"
                                  ? "text-right"
                                  : "text-left",
                                col.className,
                                // align-middle giúp nội dung nằm chính giữa vùng gộp dòng
                                cellRowSpan && cellRowSpan > 1
                                  ? "align-middle"
                                  : ""
                              )}
                            >
                              {cellContent}
                            </td>
                          );
                        })}
                      </motion.tr>
                    ))}
                  </React.Fragment>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="bg-white px-8 py-5 border-t border-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Hiển thị{" "}
            <span className="text-gray-900 font-bold">
              {fromItem}-{toItem}
            </span>{" "}
            / <span className="text-gray-900 font-bold">{totalElements}</span>{" "}
            mục
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0 || loading}
              className="p-2.5 rounded-xl border border-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
            >
              <FiChevronLeft size={18} />
            </button>

            <div className="px-5 py-1.5 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-700 tracking-tighter">
              TRANG {page + 1} / {totalPages || 1}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1 || loading}
              className="p-2.5 rounded-xl border border-gray-100 text-gray-500 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-90"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
