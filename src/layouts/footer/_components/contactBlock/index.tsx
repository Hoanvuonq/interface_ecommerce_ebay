"use client";
export const ContactBlock = ({
  icon: Icon,
  title,
  value,
}: {
  icon: any;
  title: string;
  value: string;
}) => (
  <div className="flex items-start gap-4 group cursor-pointer">
    <div className="mt-1 p-2 bg-white rounded-lg border border-gray-100 group-hover:border-(--color-mainColor)/30 transition-colors shadow-sm">
      <Icon size={16} className="text-(--color-mainColor)" />
    </div>
    <div className="flex flex-col">
      <span className="text-[10px] text-gray-500 uppercase font-bold">
        {title}
      </span>
      <span className="text-sm text-[#333] font-semibold group-hover:text-black transition-colors">
        {value}
      </span>
    </div>
  </div>
);
