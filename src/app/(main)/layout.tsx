import { ScrollToTop } from "@/features";
import { Footer } from "@/layouts/footer/";
import { Header } from "@/layouts/header/_pages";
import { FloatingChatButtons } from "../(chat)/_components/FloatingChatButtons";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
      <Header />
      <main className="grow w-full flex flex-col pt-20 md:pt-28">
        <div className="relative grow w-full">{children}</div>
      </main>
      <FloatingChatButtons />
      <ScrollToTop />
      <Footer />
    </div>
  );
}
