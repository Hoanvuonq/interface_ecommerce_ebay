// import PublicPageWrapper from "@/app/(home)/_components/PublicPageWrapper";
import IntroBanner from "@/app/(home)/_components/IntroBanner";
import { Promotion } from "@/app/(home)/_components/Promotion";
import { CategoriesSection } from "../_components/CategoriesSection";
// import FloatingChatButtons from "@/components/FloatingChatButtons/FloatingChatButtons";
import { HomepageBannerProvider } from "@/app/(home)/_context/HomepageBannerContext";
import ScrollReveal from "@/features/ScrollReveal";
import ProductSection from "@/app/(home)/_components/ProductSection";
// import ProductShowcase from "@/components/products/product.showcase";
import FlashSaleSection from "../_components/FlashSale";
import BannerSidebar from "../_components/BannerSidebar";
import ProductShowcase from "../_components/ProductShowcase";
import SocialProofSection from "../_components/SocialProofSection";
import NewsletterSignup from "../_components/NewsletterSignup";

// const SocialProofSection = dynamic(
//   () => import("@/components/SocialProofSection"),
//   {
//     loading: () => <div className="h-96" />,
//   }
// );

// const NewsletterSignup = dynamic(
//   () => import("@/components/NewsletterSignup"),
//   {
//     loading: () => <div className="h-64" />,
//   }
// );

export const HomeScreen = () => {
  return (
    <>
      <HomepageBannerProvider locale="vi">
        <IntroBanner />
        <Promotion />
        <ScrollReveal animation="slideUp" delay={150}>
          <CategoriesSection />
        </ScrollReveal>
        <ScrollReveal animation="fadeIn" delay={200}>
          <FlashSaleSection />
        </ScrollReveal>
        <ScrollReveal animation="slideUp" delay={250}>
          <ProductSection
            type="featured"
            showBadge={true}
            columns={{ mobile: 2, tablet: 3, desktop: 5 }}
            rows={2}
            sidebar={<BannerSidebar />}
          />
        </ScrollReveal>
        <ScrollReveal animation="slideUp" delay={150}>
          <ProductShowcase
            title="GỢI Ý HÔM NAY"
            subtitle="Dành riêng cho bạn"
            rows={3}
          />
        </ScrollReveal>{" "}
        <ScrollReveal animation="fadeIn" delay={100}>
          <SocialProofSection />
        </ScrollReveal>
        <ScrollReveal animation="slideUp" delay={150}>
          <NewsletterSignup />
        </ScrollReveal>
      </HomepageBannerProvider>
    </>
  );
};
