import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex flex-col h-screen w-full items-center justify-center bg-gray-100">
      <Image
        src="/robot.png" 
        alt="Not Found"
        width={150}
        height={150}
        className="mb-4 animate-motion" 
      />
      <h1 className="text-4xl font-bold text-black">404 - Page Not Found</h1>
      <p className="mt-2 text-lg text-gray-700">Sorry, the page you are looking for does not exist.</p>
      <Link href="/" className="mt-5 text-lg text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded transition duration-300">
        Go back to Home
      </Link>
      <div className="mt-10">
        <Link href="#" className="text-blue-500 hover:text-blue-600 underline">
          Open Sync
        </Link>
      </div>
    </div>
  );
}