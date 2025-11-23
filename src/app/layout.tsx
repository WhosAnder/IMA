import type { Metadata } from "next";
import "../index.css";

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
        {children}
      </body>
    </html>
  );
}
