import Link from 'next/link';

const roleLinks = [
  { href: '/students', title: 'Student' },
  { href: '/teacher', title: 'Teacher' },
  { href: '/admin', title: 'Admin' },
];

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 py-6"
      style={{
        backgroundImage:
          'linear-gradient(#d6e4fb 1px, transparent 1px), linear-gradient(90deg, #d6e4fb 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundColor: '#f0f4f8',
      }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-[#e2e8f0] bg-white px-8 py-10 shadow-[0_4px_24px_rgba(20,47,82,0.08)]">
        <h1 className="text-center text-[28px] font-semibold tracking-tight text-[#142f52]">
          School Club Platform
        </h1>
        <p className="mt-1 text-center text-sm text-[#6e86a7]">
          Select a role to continue
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {roleLinks.map((role) => (
            <Link
              key={role.href}
              href={role.href}
              className="flex items-center justify-between rounded-[10px] bg-[#172a4e] px-5 py-4 text-[17px] font-medium text-white transition-colors hover:bg-[#1e3a6b]"
            >
              <span>Login as {role.title}</span>
              <span className="text-lg opacity-70">›</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
