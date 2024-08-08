/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dwzp0o5aw/**", // Ensure this line is correct
      },
    ],
  },
};

export default nextConfig;
