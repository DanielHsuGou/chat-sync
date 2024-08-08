import { Poppins, Kanit } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const poppins = Poppins({ subsets: ["latin"], weight: ["500"] });
const kanit = Kanit({ subsets: ["latin"], weight: ["500"] });

export default function RootLayout({ children }) {
  return (
    <div
      className={`${poppins.className} bg-[url('/nightsky.jpg')] bg-no-repeat bg-cover bg-center bg-fixed min-h-screen`}
    >
      <Link href="/">
        <div className="absolute left-4 top-4 flex items-center">
          <Image
            src="/robo_icon.png"
            alt="icon"
            width={64}
            height={64}
            className="mr-3 w-10 h-10 md:w-16 md:h-16"
          />
          <h1
            className={`${kanit.className} text-[#EBEBFF] text-[30px] md:text-[41px] font-medium`}
          >
            Sync
          </h1>
        </div>
      </Link>
      <div className="ml-3">{children}</div>
    </div>
  );
}
