"use client";

import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiInbox, FiLoader } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn"; 
import { DataTableProps } from "./type";

export const DataTable = <T extends { id: string | number }>({
  data,
  columns,
  loading,
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
    if (page > prevPage) {
      setDirection(1); 
    } else if (page < prevPage) {
      setDirection(-1); 
    }
    setPrevPage(page);
  }, [page, prevPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -20 : 20,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-4 w-full">
      {headerContent && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-end gap-4  animate-fade-in-down">
          {headerContent}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm ring-1 ring-gray-900/5 overflow-hidden flex flex-col">
        <div className="overflow-x-auto custom-scrollbar border-b border-gray-100 bg-gray-50/50">
          <table className="min-w-full">
            <thead>
              <tr>
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    scope="col"
                    className={cn(
                      "px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap",
                      col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left",
                      col.headerClassName
                    )}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
          </table>
        </div>

        <div className="relative overflow-hidden min-h-100 bg-white">
          <AnimatePresence mode="wait" custom={direction}>
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 z-10"
              >
                <div className="p-3 bg-orange-50 rounded-full">
                    <FiLoader className="w-6 h-6 text-orange-500 animate-spin" />
                </div>
                <span className="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</span>
              </motion.div>
            ) : data.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm">
                  <FiInbox className="w-10 h-10 text-gray-300" />
                </div>
                <div className="text-center">
                    <h3 className="text-gray-900 font-semibold text-base mb-1">Chưa có dữ liệu</h3>
                    <p className="text-sm text-gray-400">{emptyMessage}</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={page}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full"
              >
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="min-w-full divide-y divide-gray-50">
                    <tbody className="bg-white">
                      {data.map((item, rowIdx) => (
                        <tr
                          key={item.id}
                          className="group hover:bg-orange-50/40 transition-colors duration-200"
                        >
                          {columns.map((col, colIdx) => (
                            <td
                              key={colIdx}
                              className={cn(
                                "px-6 py-4 whitespace-nowrap text-sm text-gray-600",
                                col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left",
                                col.className
                              )}
                            >
                              {col.render
                                ? col.render(item, rowIdx)
                                : col.accessor
                                ? (item[col.accessor] as React.ReactNode)
                                : null}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-white px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-4 z-20 relative">
          <div className="text-sm text-gray-500 hidden sm:block">
            Hiển thị <span className="font-semibold text-gray-900">{totalElements > 0 ? fromItem : 0}-{toItem}</span> trong <span className="font-semibold text-gray-900">{totalElements}</span> kết quả
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0 || loading}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Trang trước"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100 min-w-20 text-center">
                {page + 1} / {totalPages || 1}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages - 1 || loading}
              className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Trang sau"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};