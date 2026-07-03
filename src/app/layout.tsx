import "./globals.css";

import { AuthProvider } from "../context/AuthContext";

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

          {children}

        </AuthProvider>

      </body>
    </html>
  );
}