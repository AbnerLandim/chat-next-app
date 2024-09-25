import { SocketProvider } from "@/components/providers/socket-provider";
import "./globals.css";
import "../css/style.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SocketProvider>
        <body className="overflow-hidden">{children}</body>
      </SocketProvider>
    </html>
  );
}
