"use client";

import React, { useState, useEffect } from "react";
import walletService from "@/services/wallet/wallet.service";
import {
  WalletTransactionResponse,
  WalletType,
} from "@/types/wallet/wallet.types";
import TransactionDetailModal from "../TransactionDetailModal";
import { DataTable} from "@/components";
import { Column } from "@/components/DataTable/type";
import { getStatusStyle, getTransactionLabel } from "@/constants/status";
import { Button } from "@/components/button";
import { RefreshCcw } from "lucide-react";

interface WithdrawTransactionListProps {
  walletType: WalletType;
}

export const WithdrawTransactionList: React.FC<
  WithdrawTransactionListProps
> = ({ walletType }) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<WalletTransactionResponse[]>(
    []
  );

  // Pagination
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<WalletTransactionResponse | null>(null);

  useEffect(() => {
    loadTransactions();
  }, [page, walletType]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await walletService.getMyTransactions(
        page,
        size,
        walletType,
        "WITHDRAW"
      );
      setTransactions(response.content);
      setTotalElements(response.totalElements);
    } catch (error: any) {
      console.error("Failed to load withdraw transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<WalletTransactionResponse>[] = [
    {
      header: "STT",
      className: "w-16 text-center",
      render: (_, index) => page * size + index + 1,
    },
    {
      header: "Số tiền",
      render: (item) => (
        <span className="font-semibold text-red-600">
          -{item.amount.toLocaleString("vi-VN")} VND
        </span>
      ),
    },
    {
      header: "Trạng thái",
      render: (item) => (
        // Use helpers directly here
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(
            item.status
          )}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
          {getTransactionLabel(item.status)}
        </span>
      ),
    },
    {
      header: "Mô tả",
      render: (item) => (
        <div className="max-w-xs truncate" title={item.description}>
          {item.description || "-"}
        </div>
      ),
    },
    {
      header: "Số dư sau",
      render: (item) => `${item.balanceAfter.toLocaleString("vi-VN")} VND`,
    },
    {
      header: "Ngày tạo",
      className: "text-gray-500",
      render: (item) => new Date(item.createdDate).toLocaleString("vi-VN"),
    },
    {
      header: "Thao tác",
      className: "text-right",
      render: (item) => (
        <button
          onClick={() => {
            setSelectedTransaction(item);
            setDetailModalOpen(true);
          }}
          className="text-orange-600 hover:text-orange-900 flex items-center justify-end gap-1 ml-auto transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          Chi tiết
        </button>
      ),
    },
  ];

  // --- Render ---
  return (
    <div>
      <DataTable
        data={transactions}
        columns={columns}
        loading={loading}
        page={page}
        size={size}
        totalElements={totalElements}
        onPageChange={setPage}
        emptyMessage="Chưa có giao dịch rút tiền nào"
        headerContent={
          <Button
            variant="edit"
            onClick={loadTransactions}
            disabled={loading}
            icon={<RefreshCcw />}
          >
            Làm mới
          </Button>
        }
      />

      <TransactionDetailModal
        open={detailModalOpen}
        loading={false}
        onClose={() => {
          setDetailModalOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />
    </div>
  );
};
