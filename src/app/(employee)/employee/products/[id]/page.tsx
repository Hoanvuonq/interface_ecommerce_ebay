"use client";

import { ProductGallery, SectionLoading } from "@/components";
import { useToast } from "@/hooks/useToast";
import {
  ArrowLeft,
  Box,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  approveProduct,
  getProductById,
  rejectProduct,
} from "../_services/product.service";
import { ProductResponse } from "../_types/dto/product.dto";
import {
  AdminActionsCard,
  ProductDescription,
  ProductSummaryCard,
  VariantTable,
} from "./_components";
import { cn } from "@/utils/cn";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { success: toastSuccess, error: toastError } = useToast();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchProductDetail = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProductById(id);
      if (response?.data) {
        setProduct(response.data);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toastError("Không thể tải thông tin sản phẩm");
    } finally {
      setLoading(false);
    }
  }, [id, toastError]);

  useEffect(() => {
    if (id) fetchProductDetail();
  }, [fetchProductDetail]);

  const handleApprove = async () => {
    if (!product) return;
    try {
      setActionLoading(true);
      await approveProduct(product.id, `"${product.version}"`);
      toastSuccess("Phê duyệt sản phẩm thành công!");
      fetchProductDetail();
    } catch (error: any) {
      toastError(error?.message || "Duyệt sản phẩm thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!product) return;
    try {
      setActionLoading(true);
      await rejectProduct(product.id, `"${product.version}"`, { reason });
      toastSuccess("Đã từ chối sản phẩm");
      fetchProductDetail();
    } catch (error: any) {
      toastError("Lỗi khi thực hiện từ chối");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestEdit = async (reason: string) => {
    if (!product) return;
    try {
      setActionLoading(true);
      await rejectProduct(product.id, `"${product.version}"`, {
        reason: `[Yêu cầu chỉnh sửa] ${reason}`,
      });
      toastSuccess("Đã gửi yêu cầu chỉnh sửa tới Shop");
      fetchProductDetail();
    } catch (error: any) {
      toastError("Gửi yêu cầu thất bại");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
     <SectionLoading message="Đang tải thông tin sản phẩm..." />
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-50 rounded-[2.5rem] flex items-center justify-center mb-6">
          <Box className="text-red-400 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter mb-2">
          Sản phẩm không tồn tại
        </h2>
        <p className="text-slate-500 text-sm mb-8 max-w-xs">
          Dữ liệu sản phẩm không được tìm thấy hoặc đã bị xóa khỏi hệ thống mạng
          lưới.
        </p>
        <Link
          href="/employee/products"
          className="flex items-center gap-3 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-orange-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          <ArrowLeft size={16} strokeWidth={3} />
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBFB] pb-24">
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-50 mb-8">
        <div className="max-w-360 mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/employee/products"
              className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-all group"
            >
              <ArrowLeft
                size={20}
                strokeWidth={3}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </Link>
            <div className="h-8 w-px bg-slate-100" />
            <div className="hidden md:block">
              <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <Link
                  href="/employee"
                  className="hover:text-orange-500 transition-colors"
                >
                  Admin
                </Link>
                <ChevronRight size={12} className="text-slate-300" />
                <Link
                  href="/employee/products"
                  className="hover:text-orange-500 transition-colors"
                >
                  Catalog
                </Link>
                <ChevronRight size={12} className="text-slate-300" />
                <span className="text-slate-900 italic">
                  #{product.id.substring(0, 8)}
                </span>
              </nav>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={`/product/${product.slug}`}
              target="_blank"
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 bg-white",
                "text-slate-900 font-bold rounded-xl border border-slate-200 hover:border-orange-500",
                "hover:text-orange-500 transition-all text-[10px] uppercase tracking-widest shadow-sm active:scale-95",
              )}
            >
              <ExternalLink size={14} strokeWidth={3} />
              Live Preview
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-360 mx-auto px-8">
        <div className="mb-10 flex items-center gap-4">
          <div className="p-3 bg-orange-500 rounded-2xl shadow-lg shadow-orange-200">
            <ShieldCheck size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-900 uppercase tracking-tighter italic leading-none">
              Review <span className="text-orange-500">Asset</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Product Verification Protocol
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-10">
          <div className="col-span-12 lg:col-span-5 space-y-8">
            <div className="bg-white p-4 rounded-[3rem] border border-orange-50 shadow-custom-lg overflow-hidden group">
              <ProductGallery
                media={product.media || []} 
                product={product} 
              />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 space-y-8">
            <ProductSummaryCard product={product} />

            <AdminActionsCard
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestEdit={handleRequestEdit}
              loading={actionLoading}
              isApproved={product.approvalStatus === "APPROVED"}
            />
          </div>
        </div>

        <div className="mt-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <ProductDescription description={product.description} />
          <VariantTable variants={product.variants || []} />
        </div>
      </main>

      <div className="mt-20 flex flex-col items-center justify-center opacity-30 gap-2">
        <LayoutDashboard size={24} className="text-slate-400" />
        <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-slate-500">
          Secure Admin Terminal v2.1.0
        </span>
      </div>
    </div>
  );
}
