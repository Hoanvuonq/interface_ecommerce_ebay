export const RadioOption = ({ checked, onChange, label, subLabel, value, icon, disabled, className }: any) => (
  <div 
    onClick={() => !disabled && onChange(value)}
    className={`
      flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer select-none
      ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50 border-gray-100" : 
        checked ? "border-gray-500 bg-orange-50/30 ring-1 ring-orange-500" : "border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50"}
      ${className}
    `}
  >
    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "border-gray-500" : "border-gray-300"}`}>
      {checked && <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />}
    </div>
    {icon && <div className="text-xl text-gray-600 shrink-0">{icon}</div>}
    <div className="flex-1 min-w-0">
      <p className={`font-medium text-sm ${checked ? "text-orange-900" : "text-gray-700"}`}>{label}</p>
      {subLabel && <div className="text-xs text-gray-500 mt-0.5">{subLabel}</div>}
    </div>
  </div>
);