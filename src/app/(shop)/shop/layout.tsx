import { BaseShopLayout } from "./_layouts";
import ShopVerificationGuard from "./_components/ShopVerificationGuard";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ShopVerificationGuard>
      <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-100">
        <BaseShopLayout>{children}</BaseShopLayout>
      </div>
    </ShopVerificationGuard>
  );
}
