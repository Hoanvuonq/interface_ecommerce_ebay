import { IntroBanner } from "@/app/(main)/(home)/_components/IntroBanner";
import { ProductSection } from "@/app/(main)/(home)/_components/ProductSection";
import { Promotion } from "@/app/(main)/(home)/_components/Promotion";
import { HomepageProvider } from "@/app/(main)/(home)/_context/HomepageContext";
import BannerSidebar from "../_components/BannerSidebar";
import { CategoriesSection } from "../_components/CategoriesSection";
import { FlashSaleSection } from "../_components/FlashSale";
import NewsletterSignup from "../_components/NewsletterSignup";
import { ProductShowcase } from "../_components/ProductShowcase";
import { SocialProofSection } from "../_components/SocialProofSection";

export const HomeScreen = () => {
  return (
    <HomepageProvider locale="vi">
      <IntroBanner />
      <Promotion />
      <CategoriesSection />
      <FlashSaleSection />
      <ProductSection
        type="featured"
        showBadge={true}
        columns={{ mobile: 2, tablet: 3, desktop: 5 }}
        rows={2}
        sidebar={<BannerSidebar />}
      />
      <ProductShowcase
        title="GỢI Ý HÔM NAY"
        subtitle="Dành riêng cho bạn"
      />
      <NewsletterSignup />
      <SocialProofSection />
    </HomepageProvider>
  );
};
