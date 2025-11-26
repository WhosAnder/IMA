import type { Metadata } from "next";
import "../index.css";
import { QueryProvider } from "@/query/QueryProvider";

export const metadata: Metadata = {
  title: "IMA Cloud",
  description: "Gestión de archivos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
