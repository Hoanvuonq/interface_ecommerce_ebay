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
import { EmptyProductState } from "@/app/(main)/products/_components/EmptyProductState";
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
    if (typeof rowKey === "function") return rowKey(item, index);
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

  return (
    <div className="w-full space-y-4">
      {headerContent && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-in fade-in slide-in-from-top-2 duration-500">
          {headerContent}
        </div>
      )}

      <div className="flex flex-col overflow-hidden bg-white border border-gray-100 rounded-2xl shadow-custom">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full border-collapse">
            <thead className="bg-[#f5f5f5] border-b border-gray-200">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={cn(
                      "px-6 py-5 text-[11px] font-bold uppercase text-gray-700 whitespace-nowrap ",
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                          ? "text-right"
                          : "text-left",
                      col.headerClassName,
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="relative min-h-75">
              <AnimatePresence mode="wait" custom={direction}>
                {loading ? (
                  <motion.tr
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={columns.length} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-4 bg-orange-50 rounded-3xl shadow-inner">
                          <FiLoader className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                        <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-orange-500 animate-pulse">
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
                    <td colSpan={columns.length} className="p-2">
                      <EmptyProductState isShop={true} message={emptyMessage} />
                    </td>
                  </motion.tr>
                ) : (
                  <React.Fragment key={`page-${page}`}>
                    {data.map((item, rowIdx) => (
                      <motion.tr
                        key={getRowKey(item, rowIdx)}
                        initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: rowIdx * 0.01 }}
                        className="group border-b border-gray-50 transition-colors last:border-none hover:bg-orange-50/10"
                      >
                        {columns.map((col, colIdx) => {
                          const rendered = col.render
                            ? col.render(item, rowIdx)
                            : null;
                          let cellContent: React.ReactNode = null;
                          let cellRowSpan: number | undefined = undefined;

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
                                "px-6 py-5 whitespace-nowrap text-sm font-bold text-gray-600",
                                col.align === "center"
                                  ? "text-center"
                                  : col.align === "right"
                                    ? "text-right"
                                    : "text-left",
                                col.className,
                                cellRowSpan && cellRowSpan > 1
                                  ? "align-middle"
                                  : "",
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

        <div className="flex flex-col items-center justify-between gap-6 bg-[#f5f5f5] px-10 py-2 border-t border-gray-200 sm:flex-row shadow-inner">
          <div className="flex items-center gap-2 text-[12px] font-bold text-gray-500">
            <span>Hiển thị:</span>
            <div className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 text-gray-900 shadow-sm">
              <span className="text-orange-500">
                {fromItem}-{toItem}
              </span>
              <span className="mx-1 text-gray-500">/</span>
              <span>{totalElements} Assets</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0 || loading}
              className="flex h-8 w-8 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-orange-500 hover:text-orange-500 disabled:opacity-20 active:scale-90 shadow-sm"
            >
              <FiChevronLeft size={20} strokeWidth={3} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i).map(
                (pageNum) => {
                  const isSelected = page === pageNum;
                  const isEdge = pageNum === 0 || pageNum === totalPages - 1;
                  const isNear = Math.abs(pageNum - page) <= 1;

                  if (!isEdge && !isNear) {
                    if (pageNum === 1 || pageNum === totalPages - 2) {
                      return (
                        <span
                          key={pageNum}
                          className="px-1 text-gray-500 font-bold"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => onPageChange(pageNum)}
                      className={cn(
                        "h-8 min-w-8 rounded-2xl text-[11px] font-bold transition-all border shadow-sm",
                        isSelected
                          ? "bg-orange-500 border-orange-500 text-white shadow-orange-500/40 scale-85"
                          : "bg-white border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-500",
                      )}
                    >
                      {pageNum + 1}
                    </button>
                  );
                },
              )}
            </div>

            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1 || loading}
              className="flex h-8 w-8 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-500 transition-all hover:border-orange-500 hover:text-orange-500 disabled:opacity-20 active:scale-90 shadow-sm"
            >
              <FiChevronRight size={20} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
