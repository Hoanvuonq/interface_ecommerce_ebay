import { BreadcrumbProps } from '@/app/(main)/products/_types/product';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const lastIndex = items.length - 1;

  return (
    <nav className="flex items-center pb-2" aria-label="Breadcrumb">
      <ol 
        role="list" 
        className="flex items-center p-2 bg-white/50 backdrop-blur-md rounded-2xl border uppercase border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md"
      >
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-600 hover:text-orange-500 transition-colors duration-200 p-1 rounded-lg hover:bg-orange-50"
          >
            <Home className="h-4 w-4 shrink-0" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === lastIndex;

          return (
            <li key={item.title} className="flex items-center">
              <ChevronRight
                className="h-4 w-4 shrink-0 text-gray-300 mx-1 sm:mx-2"
                aria-hidden="true"
              />

              <div className="flex items-center">
                {isLast || !item.href ? (
                  <span
                    className="text-xs font-semibold text-orange-600 cursor-default px-2 py-1 rounded-md bg-orange-50/50"
                    aria-current="page"
                  >
                    {item.title}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="group relative text-xs font-bold text-gray-500 hover:text-orange-600 transition-all duration-200 px-2 py-1 rounded-md hover:bg-orange-50/30"
                  >
                    {item.title}
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};