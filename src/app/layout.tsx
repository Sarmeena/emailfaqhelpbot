import "./globals.css";

import { AuthProvider } from "../context/AuthContext";
import { SidebarProvider } from "../context/SidebarContext";

export const metadata = {
  title: "Email FAQ Help Bot",
  description: "AI Customer Support Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <AuthProvider>
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </AuthProvider>

      </body>
    </html>
  );
}