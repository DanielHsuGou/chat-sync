import dynamic from "next/dynamic";

// App Router 的 viewport 导出（替代旧版 next/head 的 meta viewport）
export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: "no",
};

// 关键：ssr: false，让 ChatPageClient 及其所有依赖（包括 lottie）完全不在服务端执行
const ChatPageClient = dynamic(() => import("./ChatPageClient"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-blue-100">
      <p className="text-gray-500 text-lg">Loading chat...</p>
    </div>
  ),
});

export default function Page() {
  return <ChatPageClient />;
}