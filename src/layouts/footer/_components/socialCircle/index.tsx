import Link from "next/link";

export const SocialCircle = ({ icon: Icon }: any) => (
  <Link
    href="#"
    className="w-9 h-9 flex items-center justify-center bg-white/5 rounded-full border border-white/10 hover:bg-amber-400 hover:text-blue-900 hover:border-amber-400 transition-all duration-300"
  >
    <Icon size={16} />
  </Link>
);
