import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pertamina Procurement Dashboard",
  description: "Dashboard template for procurement operations and vendor management.",
  icons: {
    icon: "/pertamina-minimize.png",
    shortcut: "/pertamina-minimize.png",
    apple: "/pertamina-minimize.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
