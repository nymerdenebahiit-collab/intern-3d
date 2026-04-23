'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const isStudentRoute = pathname.startsWith('/students');
  const isTeacherRoute = pathname.startsWith('/teacher');
  const hasLeftSidebar = isStudentRoute || isTeacherRoute;

  if (pathname === '/admin') {
    return null;
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 z-50 flex h-16 w-full items-center justify-between border-b border-gray-100 bg-white shadow-sm ${
          hasLeftSidebar ? 'pl-72 pr-20' : 'px-20'
        }`}
      >
        <div className="flex justify-between" />

        <Link href="/" className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-blue-600" />
          <span className="text-xl font-bold text-black">School Clubs</span>
        </Link>

        <div className="flex flex-1 justify-end">
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full bg-[color:var(--muted)] px-3 py-1.5 text-xs text-[color:var(--muted-foreground)] md:flex">
              <span className="h-2 w-2 rounded-full bg-[color:var(--success)]" />
              Online
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--primary-soft)] text-sm font-semibold text-[color:var(--primary)]">
              JD
            </div>
          </div>
        </div>
      </header>
      <div className="h-16" aria-hidden="true" />
    </>
  );
}
