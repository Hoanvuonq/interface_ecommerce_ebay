import { HomepageProvider } from "@/app/(main)/(home)/_context/HomepageContext";
import {
  ProductShowcase,
  CalathaMallSection,
  FlashSaleSection,
  CategoriesSection,
  Promotion,
  ProductSection,
  IntroBanner,
  BannerSidebar,
} from "../_components";

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
      <ProductShowcase />
      <CalathaMallSection />
    </HomepageProvider>
  );
};
