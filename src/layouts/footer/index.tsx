"use client";

import React from "react";
import Link from "next/link";
// Import các icon Lucide
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

import {
  QUICK_LINKS,
  CUSTOMER_SERVICE_LINKS,
  LEGAL_LINKS,
} from "@/constants/footer";
import Image from "next/image";

export const Footer: React.FC = () => {
  const renderLinkList = (links: { href: string; label: string }[]) => (
    <ul className="space-y-2 text-sm sm:text-base">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-gray-300 hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <Link href="/" className="flex items-center h-10">
              <Image
                src="/icon/final.svg"
                alt="CaLaTha Logo"
                width={160}
                height={48}
                className="h-full w-auto object-contain"
                style={{ maxHeight: "60px" }}
                priority
              />
            </Link>
            <p className="text-gray-300 text-sm sm:text-base mb-3 sm:mb-4">
              Nền tảng thương mại điện tử hàng đầu Việt Nam, mang đến trải
              nghiệm mua sắm tuyệt vời với hàng triệu sản phẩm chất lượng.
            </p>

            <div className="flex space-x-3 sm:space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Youtube"
              >
                <Youtube size={24} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Liên kết nhanh
            </h4>
            {renderLinkList(QUICK_LINKS)}
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Hỗ trợ khách hàng
            </h4>
            {renderLinkList(CUSTOMER_SERVICE_LINKS)}
          </div>

          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              Liên hệ
            </h4>
            <div className="space-y-2 sm:space-y-3 text-sm sm:text-base mb-4">
              <div className="flex items-center">
                <Phone size={20} className="mr-3 text-blue-400 flex-shrink-0" />
                <a
                  href="tel:0932070787"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  0932 070 787
                </a>
              </div>

              <div className="flex items-center">
                <Mail size={20} className="mr-3 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:ebayexpressvn@gmail.com"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  ebayexpressvn@gmail.com
                </a>
              </div>

              <div className="flex items-start">
                <MapPin
                  size={20}
                  className="mr-3 text-blue-400 mt-1 flex-shrink-0"
                />
                <span className="text-gray-300">
                  300 Độc Lập, Phường Tân Quý
                  <br />
                  Quận Tân Phú, TP. Hồ Chí Minh, Việt Nam
                </span>
              </div>
            </div>
            <Link
              href="/contact"
              className="text-blue-400 hover:text-white transition-colors font-medium inline-block mt-2"
            >
              Xem thông tin liên hệ chi tiết →
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 CaLaTha. Tất cả quyền được bảo lưu.
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
              {LEGAL_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
