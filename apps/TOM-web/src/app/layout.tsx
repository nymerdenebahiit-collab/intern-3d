import './global.css';

import { TomSessionProvider } from './_providers/tom-session-provider';

export const metadata = {
  title: 'Ухаалаг ажлын орчны самбар',
  description:
    'Ажил, бүлэг, эвент, мэдлэгийн сан, шалгалт, санал асуулгыг нэг дор төвлөрүүлсэн дотоод систем.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className="min-h-screen bg-[#f4f7fb]">
        <TomSessionProvider>{children}</TomSessionProvider>
      </body>
    </html>
  );
}
