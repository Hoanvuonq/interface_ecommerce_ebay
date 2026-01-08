import { Lock, ShieldAlert } from "lucide-react";

interface CustomResultProps {
  title: string;
  subTitle: string;
  extra: React.ReactNode;
}

export const CustomResult: React.FC<CustomResultProps> = ({
  title,
  subTitle,
  extra,
}) => (
  <div className="relative bg-white dark:bg-gray-800 p-10 sm:p-14 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] max-w-2xl w-full text-center overflow-hidden">
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-50" />
    <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-100 rounded-full blur-3xl opacity-50" />

    <div className="relative flex justify-center mb-8">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-200 rounded-full blur-2xl opacity-40 animate-pulse" />
        <div className="relative bg-linear-to-br from-orange-400 to-amber-500 p-6 rounded-3xl shadow-xl shadow-orange-200">
          <ShieldAlert size={48} className="text-white" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-lg">
          <Lock size={16} className="text-(--color-mainColor)" />
        </div>
      </div>
    </div>

    <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4 tracking-tight">
      {title}
    </h1>
    <p className="text-gray-500 dark:text-gray-600 mb-10 leading-relaxed px-4">
      {subTitle}
    </p>
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      {extra}
    </div>
  </div>
);