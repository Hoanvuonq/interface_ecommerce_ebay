// import PublicPageWrapper from "@/app/(home)/_components/PublicPageWrapper";
import { Promotion } from "@/app/(home)/_components/Promotion";
import IntroBanner from "@/app/(home)/_components/IntroBanner";
import {CategoriesSection} from "../_components/CategoriesSection";
// import FloatingChatButtons from "@/components/FloatingChatButtons/FloatingChatButtons";
import { HomepageBannerProvider } from "@/app/(home)/_context/HomepageBannerContext";
import ScrollReveal from "@/features/ScrollReveal";
// import ScrollReveal from "@/components/ui/ScrollReveal";
// import FlashSaleSection from "@/components/FlashSaleSection";
// import ProductSection from "@/app/(home)/_components/ProductSection";
// import ProductShowcase from "@/components/products/product.showcase";
// import BannerSidebar from "@/components/BannerSidebar";
import dynamic from "next/dynamic";

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
        <div className=""></div>
      </HomepageBannerProvider>
    </>
  );
};
