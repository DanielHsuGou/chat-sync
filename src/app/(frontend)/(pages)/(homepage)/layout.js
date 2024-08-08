import "@/app/globals.css";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { Josefin_Sans } from "next/font/google";

const josefin_sans = Josefin_Sans({ weight: "400", subsets: ["latin"] });

export const metadata = {
  title: "Sync Chat",
  description: "Sync Chat App for Members",
};

export default function RootLayout({ children }) {
  return (
    <div className={`${josefin_sans.className}`}>
      <Header className="fixed md:static z-10" />
      <div className="md:top-0 relative top-24">
        <div className="flex flex-1 justify-center w-full">
          <div className="flex w-full h-full">{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
