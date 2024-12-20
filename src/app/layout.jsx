import "./globals.css";

export const metadata = {
  title: "Sparepart",
  description: "Sparepart App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
