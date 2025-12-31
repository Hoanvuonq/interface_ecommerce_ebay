export const ContactBlock = ({ icon: Icon, title, value }: any) => (
  <div className="flex items-start gap-3 group">
    <div className="mt-1">
      <Icon size={16} className="text-white" />
    </div>
    <div className="flex flex-col">
      <span className="text-[11px] text-white/90 uppercase tracking-tighter font-bold">
        {title}
      </span>
      <span className="text-[14px] font-medium group-hover:text-white transition-colors cursor-default">
        {value}
      </span>
    </div>
  </div>
);
