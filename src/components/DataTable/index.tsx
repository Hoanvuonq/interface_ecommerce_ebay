"use client";

import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiInbox, FiLoader } from "react-icons/fi";
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
  const fromItem = page * size + 1;
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
      typeof item === "object" &&
      item !== null &&
      rowKey in item
    ) {
      return (item[rowKey as keyof T] as unknown as string) || index;
    }
    return index;
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 30 : -30, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -30 : 30, opacity: 0 }),
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
            <thead className="bg-gray-100 rounded-t-4xl  border-b border-gray-100">
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={cn(
                      "px-6 py-4 text-[12px] font-semibold uppercase text-gray-700  whitespace-nowrap",
                      col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left",
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
                  <motion.tr key="loading">
                    <td colSpan={columns.length} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="p-3 bg-orange-50 rounded-2xl">
                          <FiLoader className="w-6 h-6 text-(--color-mainColor) animate-spin" />
                        </div>
                        <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-300">Đang đồng bộ...</span>
                      </div>
                    </td>
                  </motion.tr>
                ) : data.length === 0 ? (
                  <motion.tr key="empty">
                    <td colSpan={columns.length} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center ring-8 ring-gray-50/50">
                          <FiInbox className="w-8 h-8 text-gray-200" />
                        </div>
                        <div>
                          <h3 className="text-gray-900 font-semibold text-xs uppercase tracking-widest">Trống</h3>
                          <p className="text-[10px] text-gray-600 font-bold uppercase">{emptyMessage}</p>
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                ) : (
                  data.map((item, rowIdx) => (
                    <motion.tr
                      key={getRowKey(item, rowIdx)}
                      custom={direction}
                      variants={variants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
                      className="group hover:bg-orange-50/30 transition-colors border-b border-gray-50 last:border-none"
                    >
                      {columns.map((col, colIdx) => (
                        <td
                          key={colIdx}
                          className={cn(
                            "px-6 py-5 whitespace-nowrap text-sm",
                            col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left",
                            col.className
                          )}
                        >
                          {col.render ? col.render(item, rowIdx) : col.accessor ? (item[col.accessor] as React.ReactNode) : null}
                        </td>
                      ))}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        <div className="bg-white px-8 py-5 border-t border-gray-50 flex items-center justify-between">
          <div className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
            Showing <span className="text-gray-900">{totalElements > 0 ? fromItem : 0}-{toItem}</span> of <span className="text-gray-900">{totalElements}</span> items
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0 || loading}
              className="p-2 rounded-xl border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-(--color-mainColor) disabled:opacity-30 transition-all active:scale-90"
            >
              <FiChevronLeft size={20} />
            </button>

            <div className="px-4 py-1.5 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-semibold text-gray-600 tracking-tighter">
              PAGE {page + 1} / {totalPages || 1}
            </div>

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1 || loading}
              className="p-2 rounded-xl border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-(--color-mainColor) disabled:opacity-30 transition-all active:scale-90"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};