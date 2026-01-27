"use client";

import React, { useMemo } from "react";
import PageContentTransition from "@/features/PageContentTransition";
import { ShieldCheck, Calendar, ScrollText, ChevronRight } from "lucide-react";

export const PrivacyPolicyScreen = () => {
  // Memoize mục lục để clean code
  const tableOfContents = useMemo(() => [
    { id: "intro", title: "1. Giới thiệu" },
    { id: "collect", title: "2. Khi nào thu thập dữ liệu" },
    { id: "data-types", title: "3. Loại dữ liệu thu thập" },
    { id: "usage", title: "4. Mục đích sử dụng" },
    { id: "contact", title: "5. Thông tin liên hệ" },
  ], []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <PageContentTransition>
      <div className="min-h-screen bg-[#fafafa] text-gray-900 pb-20">
        <section className="bg-white border-b border-gray-100 pt-20 pb-12">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="p-3 bg-orange-50 rounded-2xl text-orange-600">
                <ShieldCheck size={32} />
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-950 uppercase">
                Chính sách bảo mật
              </h1>
              <div className="flex items-center gap-6 text-gray-500 text-sm font-medium">
                <span className="flex items-center gap-2">
                  <Calendar size={16} /> Cập nhật: 20/11/2025
                </span>
                <span className="flex items-center gap-2">
                  <ScrollText size={16} /> Phiên bản: 1.0.4
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <aside className="lg:col-span-3 hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-600 pl-4">Mục lục</h3>
                <nav className="space-y-1">
                  {tableOfContents.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all text-left group"
                    >
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-9 bg-white border border-gray-100 rounded-4xl p-8 md:p-12 shadow-sm prose prose-gray prose-orange max-w-none">
              
              <section id="intro">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
                  1. GIỚI THIỆU
                </h2>
                <p>
                  1.1. Chào mừng bạn đến với nền tảng <strong>CaLaTha.vn</strong> được vận hành bởi Công ty TNHH Thương Mại Và Dịch Vụ Vận Chuyển Quốc Tế EBAY. Chúng tôi nghiêm túc thực hiện trách nhiệm bảo mật thông tin theo pháp luật Việt Nam.
                </p>
                <p>
                  1.2. <strong>"Dữ Liệu Cá Nhân"</strong> là thông tin về một cá nhân có thể xác định được danh tính như tên, số căn cước, thông tin liên hệ...
                </p>
                <div className="bg-orange-50 border-l-4 border-gray-500 p-4 my-6 rounded-r-xl">
                  <p className="text-orange-900 font-medium m-0">
                    Bằng việc sử dụng dịch vụ, bạn đồng ý với các chính sách này. Nếu không đồng ý, vui lòng ngừng truy cập nền tảng.
                  </p>
                </div>
              </section>

              <section id="collect" className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
                  2. KHI NÀO CHÚNG TÔI THU THẬP?
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none p-0">
                  {[
                    "Đăng ký tài khoản",
                    "Gửi biểu mẫu đăng ký dịch vụ",
                    "Tương tác qua hotline/mạng xã hội",
                    "Thực hiện giao dịch mua bán",
                    "Gửi phản hồi hoặc khiếu nại",
                    "Sử dụng cookies khi duyệt web"
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl m-0">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full" /> {text}
                    </li>
                  ))}
                </ul>
              </section>

              <section id="data-types" className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
                  3. DỮ LIỆU THU THẬP
                </h2>
                <div className="space-y-6">
                  <div className="p-6 border border-gray-100 rounded-2xl">
                    <h4 className="font-bold text-orange-600 mb-2">3.1.1. Định danh & Liên hệ</h4>
                    <p className="text-sm text-gray-600 m-0 leading-relaxed">Tên, CCCD/Hộ chiếu, số điện thoại, email, địa chỉ giao hàng, IP, tài khoản ngân hàng, ảnh đại diện...</p>
                  </div>
                  <div className="p-6 border border-gray-100 rounded-2xl">
                    <h4 className="font-bold text-orange-600 mb-2">3.1.2. Giao dịch</h4>
                    <p className="text-sm text-gray-600 m-0 leading-relaxed">Lịch sử mua hàng, thông tin thanh toán, thông tin vận chuyển và các sản phẩm đã giao dịch.</p>
                  </div>
                </div>
              </section>

              <section id="usage" className="mt-12">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-orange-500 rounded-full" />
                  4. MỤC ĐÍCH SỬ DỤNG
                </h2>
                <p>Chúng tôi sử dụng dữ liệu của bạn để:</p>
                <ul>
                  <li>Xử lý đơn hàng và cung cấp hỗ trợ khách hàng.</li>
                  <li>Gửi thông báo về các chương trình khuyến mãi.</li>
                  <li>Ngăn chặn các hành vi gian lận và vi phạm pháp luật.</li>
                  <li>Cải thiện trải nghiệm người dùng trên Nền tảng.</li>
                </ul>
              </section>

              <section id="contact" className="mt-12 pt-12 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">14. LIÊN HỆ VỚI CHÚNG TÔI</h2>
                <div className="bg-gray-900 text-white p-8 rounded-4xl mt-6">
                  <h3 className="text-white mt-0 mb-4">CÔNG TY TNHH TM & DV VẬN CHUYỂN QUỐC TẾ EBAY</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm opacity-90">
                    <div className="space-y-2">
                      <p><strong>MST:</strong> 0316436339</p>
                      <p><strong>Email:</strong> ebayexpressvn@gmail.com</p>
                      <p><strong>Hotline:</strong> 0932 070 787</p>
                    </div>
                    <div className="space-y-2">
                      <p><strong>Địa chỉ:</strong> 300 Độc Lập, Phường Tân Quý, Quận Tân Phú, TP. HCM</p>
                    </div>
                  </div>
                </div>
              </section>

              <footer className="mt-16 text-center text-gray-600 text-xs italic">
                Bản cập nhật ngày 20/11/2025. CaLaTha bảo lưu mọi quyền.
              </footer>
            </main>
          </div>
        </div>
      </div>
    </PageContentTransition>
  );
};