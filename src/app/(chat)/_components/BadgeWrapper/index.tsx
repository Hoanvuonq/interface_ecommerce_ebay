"use client";
export const BadgeWrapper: React.FC<{
  count?: number;
  children: React.ReactNode;
}> = ({ count, children }) => {
  if (!count) return <>{children}</>;
  return (
    <div className="relative inline-block">
      {children}
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full leading-none">
        {count}
      </span>
    </div>
  );
};
