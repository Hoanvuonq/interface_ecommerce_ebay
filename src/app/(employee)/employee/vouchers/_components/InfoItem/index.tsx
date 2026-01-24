export const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="p-5 rounded-[1.75rem] border border-slate-100 bg-white flex items-start gap-4 shadow-sm hover:shadow-md transition-all hover:border-orange-100 group">
    <div className="mt-0.5 p-2 bg-slate-50 rounded-xl  text-gray-400 group-hover:text-orange-500 group-hover:bg-orange-50 transition-colors">
      {icon}
    </div>
    <div className="flex flex-col min-w-0 gap-1">
      <span className="text-[10px] font-bold uppercase  text-gray-400 tracking-widest leading-none">
        {label}
      </span>
      <div className="text-sm truncate">{value}</div>
    </div>
  </div>
);
