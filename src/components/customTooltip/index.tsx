export const TooltipComponents = ({ active, payload, unit = "Người" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/95 backdrop-blur-md px-6 py-4 rounded-3xl shadow-2xl border border-gray-800 animate-in fade-in zoom-in-95 duration-200">
        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.2em] mb-2 border-b border-gray-800 pb-2 italic">
          {payload[0].name}
        </p>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-semibold text-white italic leading-none">
            {payload[0].value}
          </p>
          <span className="text-[10px] font-semibold text-orange-400 uppercase tracking-widest">
            {unit}
          </span>
        </div>
      </div>
    );
  }
  return null;
};
