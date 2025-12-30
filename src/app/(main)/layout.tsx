import { ScrollToTop } from "@/features";
import { Footer } from "@/layouts/footer/";
import { Header } from "@/layouts/header/_pages";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="grow">
        <div className="relative">{children}</div>
      </main>
      <ScrollToTop/>
      <Footer />
    </>
  );
}