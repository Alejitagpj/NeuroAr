import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ModeProvider } from '@/lib/mode';
import { ChatDock } from '@/components/chat/ChatDock';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'NeuroAR — Informes neuropsicológicos que se explican solos',
  description:
    'Recorridos guiados por IA generativa sobre informes neuropsicológicos validados. Visualización, narración adaptativa y asistente clínico grounded.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${mono.variable} dark`}>
      <body className="font-sans antialiased">
        <ModeProvider>
          <main className="relative z-[2]">{children}</main>
          <ChatDock />
        </ModeProvider>
      </body>
    </html>
  );
}
