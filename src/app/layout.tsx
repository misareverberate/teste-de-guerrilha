import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teste de Guerrilha — Mestres do Sistema",
  description: "Formulário de teste e dashboard de resultados do jogo Mestres do Sistema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
