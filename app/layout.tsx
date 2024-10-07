import { SocketProvider } from "@/providers/socket-provider";
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
        <body>{children}</body>
      </SocketProvider>
    </html>
  );
}
