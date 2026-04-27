'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Shield, UserCheck, Users } from 'lucide-react';

import { useTomSession } from '@/app/_providers/tom-session-provider';
import type { ManagedUser } from '@/lib/tom-types';

type UsersResponse = {
  users: ManagedUser[];
};

const roleSections: Array<{
  role: ManagedUser['role'];
  title: string;
  description: string;
  icon: typeof Shield;
}> = [
  {
    role: 'admin',
    title: 'Админ',
    description: 'Системийн хяналт, moderation, клубийн баталгаажуулалт.',
    icon: Shield,
  },
  {
    role: 'teacher',
    title: 'Багш',
    description: 'Клуб, үйл ажиллагаа, хуваарьтай холбоотой удирдлагын хэсэг.',
    icon: UserCheck,
  },
  {
    role: 'student',
    title: 'Сурагч',
    description: 'Клубүүд, уулзалт, оролцоо, хүсэлтүүдээ эндээс удирдана.',
    icon: Users,
  },
];

function routeForRole(role: ManagedUser['role']) {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'teacher':
      return '/teacher';
    default:
      return '/students';
  }
}

async function loadUsers() {
  const response = await fetch('/api/users', {
    method: 'GET',
    credentials: 'same-origin',
    cache: 'no-store',
  });
  const data = (await response.json().catch(() => null)) as UsersResponse | { error?: string } | null;

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'error' in data && typeof data.error === 'string'
        ? data.error
        : 'Failed to load users.';
    throw new Error(message);
  }

  return (data as UsersResponse).users;
}

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticating, errorMessage, clearError, login } = useTomSession();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace(routeForRole(user.role));
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    let isMounted = true;

    void loadUsers()
      .then((nextUsers) => {
        if (!isMounted) return;
        setUsers(nextUsers);
        setSelectedUserId(nextUsers.find((candidate) => candidate.accountStatus !== 'banned')?.id ?? '');
        setUsersError('');
      })
      .catch((error) => {
        if (!isMounted) return;
        setUsersError(error instanceof Error ? error.message : 'Failed to load users.');
      })
      .finally(() => {
        if (!isMounted) return;
        setIsUsersLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const usersByRole = roleSections.map((section) => ({
    ...section,
    users: users.filter((candidate) => candidate.role === section.role),
  }));

  async function handleLogin(userId: string) {
    clearError();
    try {
      const currentUser = await login(userId);
      if (currentUser) {
        router.push(routeForRole(currentUser.role));
      }
    } catch {
      // Error state is already handled by the provider.
    }
  }

  async function handleSelectedLogin() {
    if (!selectedUserId) return;
    await handleLogin(selectedUserId);
  }

  const combinedError = errorMessage || usersError;

  return (
    <main
      className="min-h-screen px-4 py-6"
      style={{
        backgroundImage:
          'linear-gradient(#d6e4fb 1px, transparent 1px), linear-gradient(90deg, #d6e4fb 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        backgroundColor: '#f0f4f8',
      }}
    >
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex flex-col justify-center rounded-[32px] border border-[#dbe7f6] bg-white/80 p-8 shadow-[0_24px_70px_rgba(20,47,82,0.10)] backdrop-blur">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#16345f] text-white shadow-[0_16px_30px_rgba(22,52,95,0.24)]">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#142f52]">
            School Club Platform
          </h1>
          <p className="mt-3 max-w-xl text-base leading-7 text-[#5f7697]">
            Одоо role link биш, жинхэнэ session дээр суурилсан нэвтрэх урсгал руу орж байна. Доороос
            DB дээрх хэрэглэгчээ сонгоод тухайн харагдац руугаа орно.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {roleSections.map(({ role, title, description, icon: Icon }) => (
              <article
                key={role}
                className="rounded-[24px] border border-[#dce8f8] bg-[#f7faff] p-4 shadow-[0_10px_24px_rgba(50,88,140,0.08)]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1a3560] shadow-[0_10px_22px_rgba(26,53,96,0.10)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-[#17365f]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[#6983a7]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col justify-center rounded-[32px] border border-[#dbe7f6] bg-white p-8 shadow-[0_24px_70px_rgba(20,47,82,0.10)]">
          <h2 className="text-2xl font-semibold text-[#142f52]">Хэрэглэгч сонгох</h2>
          <p className="mt-2 text-sm leading-6 text-[#6e86a7]">
            Session API нь `userId`-аар cookie үүсгэнэ. Дараагийн PR дээр route guard-ууд энэ session-ийг
            албан ёсоор ашиглаж эхэлнэ.
          </p>

          {combinedError ? (
            <div className="mt-5 rounded-2xl border border-[#ffd3d3] bg-[#fff5f5] px-4 py-3 text-sm text-[#b54747]">
              {combinedError}
            </div>
          ) : null}

          <label className="mt-6 block text-sm font-semibold text-[#1c3d6a]">
            Нэвтрэх хэрэглэгч
            <select
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              disabled={isUsersLoading || isAuthenticating}
              className="mt-2 w-full rounded-[18px] border border-[#d7e4f4] bg-[#f8fbff] px-4 py-3 text-sm text-[#17365f] outline-none transition focus:border-[#2e5aac] focus:bg-white focus:ring-4 focus:ring-[#dce8ff]"
            >
              <option value="">{isUsersLoading ? 'Хэрэглэгч дуудаж байна...' : 'Хэрэглэгч сонгоно уу'}</option>
              {users.map((candidate) => (
                <option key={candidate.id} value={candidate.id} disabled={candidate.accountStatus === 'banned'}>
                  {candidate.name} · {candidate.role} · {candidate.accountStatus}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => void handleSelectedLogin()}
            disabled={!selectedUserId || isUsersLoading || isAuthenticating || isLoading}
            className="mt-4 inline-flex items-center justify-center rounded-[18px] bg-[#172a4e] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1e3a6b] disabled:cursor-not-allowed disabled:bg-[#9eb1cd]"
          >
            {isAuthenticating ? 'Нэвтэрч байна...' : 'Сонгосон хэрэглэгчээр нэвтрэх'}
          </button>

          <div className="mt-8 space-y-4">
            {usersByRole.map(({ role, title, users: roleUsers }) => (
              <div key={role} className="rounded-[24px] border border-[#e3edf8] bg-[#fbfdff] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5c78a0]">
                      {title}
                    </h3>
                    <p className="mt-1 text-xs text-[#89a0bf]">{roleUsers.length} хэрэглэгч</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2">
                  {roleUsers.map((candidate) => (
                    <button
                      key={candidate.id}
                      type="button"
                      onClick={() => void handleLogin(candidate.id)}
                      disabled={candidate.accountStatus === 'banned' || isAuthenticating}
                      className="flex w-full items-center justify-between rounded-2xl border border-[#dde8f8] bg-white px-4 py-3 text-left transition hover:border-[#b9cdef] hover:bg-[#f5f9ff] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <span>
                        <span className="block text-sm font-semibold text-[#18375f]">{candidate.name}</span>
                        <span className="mt-1 block text-xs text-[#7c91af]">{candidate.email}</span>
                      </span>
                      <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-semibold text-[#496da8]">
                        {candidate.accountStatus}
                      </span>
                    </button>
                  ))}

                  {roleUsers.length === 0 ? (
                    <p className="rounded-2xl border border-dashed border-[#d9e5f5] px-4 py-3 text-sm text-[#88a0be]">
                      Энэ role дээр одоогоор хэрэглэгч алга.
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
