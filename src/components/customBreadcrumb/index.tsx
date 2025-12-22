import { BreadcrumbProps } from '@/app/products/_types/product';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const lastIndex = items.length - 1;

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2 sm:space-x-1">
        {items.map((item, index) => {
          const isLast = index === lastIndex;
          
          return (
            <li key={item.title} className="flex items-center">
              {index !== 0 && (
                <ChevronRight
                  className="h-5 w-5 shrink-0 text-gray-400"
                  aria-hidden="true"
                />
              )}

              <div className={`flex items-center ${index !== 0 && 'ml-2'}`}>
                {isLast || !item.href ? (
                  <span
                    className="text-base font-bold text-orange-600 cursor-default"
                    aria-current="page"
                  >
                    {item.title}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-base font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
                  >
                    {item.title}
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