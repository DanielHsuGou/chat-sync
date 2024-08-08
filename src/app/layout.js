import "../app/globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="antialiased">
      <body>
        <main className={`flex flex-col`}>{children}</main>
      </body>
    </html>
  );
}
