import { ButtonField } from "@/components";
import { cn } from "@/utils/cn";

interface SocialButtonProps {
  provider: "GOOGLE" | "FACEBOOK";
  icon?: React.ReactNode;
  onClick: () => void;
  loading: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  provider,
  icon,
  onClick,
  loading,
}) => {
  const displayLabel = provider.charAt(0) + provider.slice(1).toLowerCase();
  return (
    <ButtonField
      type="secondary"
      icon={icon}
      onClick={onClick}
      disabled={loading}
      loading={loading}
      className={cn(
        "h-12 rounded-xl border-2 border-gray-200 dark:border-gray-700",
        "hover:border-gray-500 dark:hover:border-gray-500 hover:shadow-md",
        "transition-all duration-300 font-medium text-base bg-white",
        "dark:bg-gray-700/50 dark:text-gray-200"
      )}
    >
      {displayLabel}
    </ButtonField>
  );
};
