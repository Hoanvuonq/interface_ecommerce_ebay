"use client";
export const SectionHeader = ({
  icon: Icon,
  title,
}: {
  icon: any;
  title: string;
}) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1.5 bg-orange-50 rounded-lg text-orange-500">
      <Icon size={14} />
    </div>
    <span className="text-xs font-black uppercase tracking-widest text-gray-400">
      {title}
    </span>
  </div>
);
