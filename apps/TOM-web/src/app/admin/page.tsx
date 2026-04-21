'use client';

import { type FormEvent, useState } from 'react';

import { CapacityBar, StatusBadge } from '@/app/_components';

const teacherOptions = [
  'Багш Сараа Ким',
  'Бат-Эрдэнэ багш',
  'Нараа багш',
  'Темүүлэн багш',
] as const;

const dayOptions = [
  'Даваа, Лхагва, Баасан',
  'Мягмар, Пүрэв',
  'Лхагва, Бямба',
  'Даваа, Мягмар, Пүрэв',
] as const;

const gradeOptions = [
  '6A - 7B анги',
  '6A - 6C анги',
  '7A - 8B анги',
  '9A - 10B анги',
] as const;

const thresholdGoal = 7;

type ClubRequest = {
  id: string;
  clubName: string;
  teacher: string;
  createdBy: string;
  interestCount: number;
  studentLimit: number;
  gradeRange: string;
  allowedDays: string;
  requestStatus: 'pending' | 'approved' | 'rejected';
  clubStatus: 'pending' | 'active' | 'paused' | 'spam';
  flaggedReason?: string;
  note: string;
};

const initialRequests: ClubRequest[] = [
  {
    id: 'club-robotics',
    clubName: 'Robotics Club',
    teacher: 'Багш Сараа Ким',
    createdBy: 'STEM баг',
    interestCount: 11,
    studentLimit: 14,
    gradeRange: '6A - 7B анги',
    allowedDays: 'Даваа, Лхагва, Баасан',
    requestStatus: 'pending',
    clubStatus: 'pending',
    note: 'Практик бүтээцийн хичээл болон тэмцээний бэлтгэлтэй.',
  },
  {
    id: 'club-writing',
    clubName: 'Бүтээлч бичгийн клуб',
    teacher: 'Нараа багш',
    createdBy: 'Хэлний уран зохиолын баг',
    interestCount: 7,
    studentLimit: 12,
    gradeRange: '6A - 6C анги',
    allowedDays: 'Мягмар, Пүрэв',
    requestStatus: 'pending',
    clubStatus: 'pending',
    note: 'Хүртээмжийн босго хүрсэн, админы баталгаажуулалт хүлээж байна.',
  },
  {
    id: 'club-debate',
    clubName: 'Мэтгэлцээний клуб',
    teacher: 'Бат-Эрдэнэ багш',
    createdBy: 'Оюутны зөвлөл',
    interestCount: 4,
    studentLimit: 10,
    gradeRange: '7A - 8B анги',
    allowedDays: 'Лхагва, Бямба',
    requestStatus: 'pending',
    clubStatus: 'pending',
    note: 'Нээлт хийхээс өмнө цөөн хэдэн бүртгэл нэмэгдэхийг хүлээж байна.',
  },
];

const initialSpamQueue: ClubRequest[] = [
  {
    id: 'spam-club-1',
    clubName: 'Үнэгүй iPad бэлэг клуб',
    teacher: 'Тодорхойгүй хэрэглэгч',
    createdBy: 'Гадаад холбоос',
    interestCount: 1,
    studentLimit: 99,
    gradeRange: 'Бүх анги',
    allowedDays: 'Хэзээ ч',
    requestStatus: 'pending',
    clubStatus: 'spam',
    flaggedReason:
      'Сэжигтэй нэр, сурталчилгааны өнгө аяс, багшийн эзэмшигчгүй байна.',
    note: 'Хуурамч мэт харагдаж байгаа тул нэн даруй устгах шаардлагатай.',
  },
  {
    id: 'spam-club-2',
    clubName: 'Даалгавар туслагч бот',
    teacher: 'Жинхэнэ ажилтан биш',
    createdBy: 'Нэргүй хүсэлт',
    interestCount: 2,
    studentLimit: 80,
    gradeRange: 'Бүх анги',
    allowedDays: 'Даваа-Баасан',
    requestStatus: 'pending',
    clubStatus: 'spam',
    flaggedReason: 'Давтагдсан түлхүүр үгтэй автомат илгээсэн хүсэлт байж магадгүй.',
    note: 'Сурагчдад хүрэхээс өмнө шалгаж цэвэрлэх шаардлагатай.',
  },
];

const initialActiveClubs: ClubRequest[] = [
  {
    id: 'active-english',
    clubName: 'Англи хэлний клуб',
    teacher: 'Темүүлэн багш',
    createdBy: 'Батлагдсан хүсэлт',
    interestCount: 9,
    studentLimit: 12,
    gradeRange: '6A - 7B анги',
    allowedDays: 'Даваа, Лхагва, Баасан',
    requestStatus: 'approved',
    clubStatus: 'active',
    note: 'Семестрийг давах хангалттай сонирхолтойгоор хэвийн явагдаж байна.',
  },
  {
    id: 'active-design',
    clubName: 'Дизайны клуб',
    teacher: 'Багш Сараа Ким',
    createdBy: 'Батлагдсан хүсэлт',
    interestCount: 6,
    studentLimit: 10,
    gradeRange: '7A - 8B анги',
    allowedDays: 'Мягмар, Пүрэв',
    requestStatus: 'approved',
    clubStatus: 'paused',
    note: 'Дараагийн элсэлт босгод хүрэх хүртэл түр зогсоосон.',
  },
];

const initialForm = {
  clubName: '',
  teacher: teacherOptions[0],
  startDate: '2025-09-01',
  endDate: '2025-12-20',
  allowedDays: dayOptions[0],
  gradeRange: gradeOptions[0],
  studentLimit: '12',
  interestCount: '0',
  note: '',
};

const formatThresholdLabel = (current: number) => {
  if (current >= thresholdGoal) {
    return 'Босгонд хүрсэн';
  }

  const remaining = thresholdGoal - current;
  return `Идэвхжүүлэхэд ${remaining} хүн дутуу`;
};

export default function AdminDashboard() {
  const [form, setForm] = useState(initialForm);
  const [requests, setRequests] = useState(initialRequests);
  const [activeClubs, setActiveClubs] = useState(initialActiveClubs);
  const [spamQueue, setSpamQueue] = useState(initialSpamQueue);
  const [banner, setBanner] = useState(
    'Шинэ клубийн хүсэлтүүдийг шалгаж, боломжтойг нь идэвхжүүлж, spam-ийг хурдан цэвэрлэ.'
  );

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newRequest: ClubRequest = {
      id: `club-${form.clubName.toLowerCase().replace(/\s+/g, '-') || 'draft'}`,
      clubName: form.clubName || 'Нэргүй клуб',
      teacher: form.teacher,
      createdBy: 'Админ самбар',
      interestCount: Number(form.interestCount) || 0,
      studentLimit: Number(form.studentLimit) || 12,
      gradeRange: form.gradeRange,
      allowedDays: form.allowedDays,
      requestStatus: 'pending',
      clubStatus: 'pending',
      note: form.note || 'Админ самбараас шинээр үүсгэсэн клубийн хүсэлт.',
    };

    setRequests((current) => [newRequest, ...current]);
    setBanner(`${newRequest.clubName} шалгах дараалалд нэмэгдлээ.`);
    setForm(initialForm);
  };

  const approveRequest = (requestId: string) => {
    const request = requests.find((item) => item.id === requestId);

    if (!request) return;

    setRequests((current) =>
      current.map((item) =>
        item.id === requestId
          ? { ...item, requestStatus: 'approved', clubStatus: 'active' }
          : item
      )
    );

    setActiveClubs((current) => [
      {
        ...request,
        requestStatus: 'approved',
        clubStatus: 'active',
      },
      ...current.filter((item) => item.id !== requestId),
    ]);
    setBanner(`${request.clubName} батлагдаж active төлөвт шилжлээ.`);
  };

  const rejectRequest = (requestId: string) => {
    const request = requests.find((item) => item.id === requestId);

    if (!request) return;

    setRequests((current) =>
      current.map((item) =>
        item.id === requestId
          ? { ...item, requestStatus: 'rejected', clubStatus: 'paused' }
          : item
      )
    );
    setActiveClubs((current) =>
      current.filter((item) => item.id !== requestId)
    );
    setBanner(`${request.clubName} татгалзагдлаа.`);
  };

  const toggleClubStatus = (clubId: string) => {
    setActiveClubs((current) =>
      current.map((club) => {
        if (club.id !== clubId) {
          return club;
        }

        const nextStatus = club.clubStatus === 'active' ? 'paused' : 'active';
        return {
          ...club,
          clubStatus: nextStatus,
          requestStatus: nextStatus === 'active' ? 'approved' : club.requestStatus,
        };
      })
    );
    setBanner('Клубийн төлөв шинэчлэгдлээ.');
  };

  const removeSpamClub = (clubId: string) => {
    const spamClub = spamQueue.find((item) => item.id === clubId);

    if (!spamClub) return;

    setSpamQueue((current) => current.filter((item) => item.id !== clubId));
    setBanner(`${spamClub.clubName} spam гэж устгагдлаа.`);
  };

  const pendingRequests = requests.filter(
    (request) => request.requestStatus === 'pending'
  );
  const activeCount = activeClubs.filter((club) => club.clubStatus === 'active')
    .length;
  const thresholdReachedCount = new Set(
    [...requests, ...activeClubs]
      .filter((club) => club.interestCount >= thresholdGoal)
      .map((club) => club.id)
  ).size;

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <section className="dashboard-entrance overflow-hidden rounded-[36px] border border-[#d6e4fb] bg-white shadow-[0_18px_70px_rgba(25,58,112,0.08)]">
        <div className="grid gap-6 px-6 py-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">
              Админ клуб систем
            </span>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-[#142f52] sm:text-5xl">
                Клуб батлах, төлөв удирдах, хуурамч хүсэлтүүдийг зайлуулах.
              </h1>
              <p className="max-w-2xl text-sm text-[#57708f] sm:text-base">
                Энэ самбараар клуб үүсгэх хүсэлтүүдийг шалгаж, pending-ээс
                active руу шилжүүлж, сонирхлын босгыг хянаж, spam-ийг сурагчдад
                хүрэхээс өмнө цэвэрлэнэ.
              </p>
            </div>
          </div>

          <div className="rounded-[30px] bg-[#173765] p-5 text-[#edf4ff] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <p className="text-xs uppercase tracking-[0.28em] text-[#b9cff0]">
              Системийн товч зураг
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-[#cfe0fb]">Хүлээгдэж буй хүсэлт</p>
                <p className="mt-2 text-3xl font-semibold">
                  {pendingRequests.length}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-[#cfe0fb]">Идэвхтэй клуб</p>
                <p className="mt-2 text-3xl font-semibold">{activeCount}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-[#cfe0fb]">Босго хүрсэн</p>
                <p className="mt-2 text-3xl font-semibold">
                  {thresholdReachedCount}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs text-[#cfe0fb]">Spam дараалал</p>
                <p className="mt-2 text-3xl font-semibold">{spamQueue.length}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#d6e5fb]">{banner}</p>
          </div>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="dashboard-entrance rounded-[30px] border border-[#dce7f8] bg-white p-5 shadow-[0_18px_60px_rgba(19,45,96,0.08)]">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6e86a7]">
                Клубийн хүсэлт бүртгэл
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[#183153]">
                Клубийн хүсэлт үүсгэх эсвэл дараалалд нэмэх
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[#57708f]">
                Багш эсвэл алба шинэ клуб хүсэх үед энэ хэсгийг бөглөнө. Хүсэлт
                pending төлөвөөр эхэлж, доорх дарааллаас батлах эсвэл татгалзах
                боломжтой.
              </p>
            </div>
            <StatusBadge type="review" text="Шалгах горим" />
          </div>

          <form className="space-y-5" onSubmit={handleCreate}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Клубийн нэр
                </span>
                <input
                  type="text"
                  value={form.clubName}
                  onChange={(event) =>
                    updateField('clubName', event.target.value)
                  }
                  placeholder="Жишээ: Англи хэлний клуб"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Багш
                </span>
                <select
                  value={form.teacher}
                  onChange={(event) => updateField('teacher', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                >
                  {teacherOptions.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Эхлэх огноо
                </span>
                <input
                  type="date"
                  value={form.startDate}
                  onChange={(event) =>
                    updateField('startDate', event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Дуусах огноо
                </span>
                <input
                  type="date"
                  value={form.endDate}
                  onChange={(event) => updateField('endDate', event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Зөвшөөрөгдсөн өдрүүд
                </span>
                <select
                  value={form.allowedDays}
                  onChange={(event) =>
                    updateField('allowedDays', event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                >
                  {dayOptions.map((days) => (
                    <option key={days} value={days}>
                      {days}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Анги хамрах хүрээ
                </span>
                <select
                  value={form.gradeRange}
                  onChange={(event) =>
                    updateField('gradeRange', event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                >
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block md:max-w-[180px]">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Сурагчийн дээд хязгаар
                </span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={form.studentLimit}
                  onChange={(event) =>
                    updateField('studentLimit', event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                />
              </label>

              <label className="block md:max-w-[180px]">
                <span className="mb-2 block text-sm font-semibold text-slate-700">
                  Одоогийн сонирхсон тоо
                </span>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={form.interestCount}
                  onChange={(event) =>
                    updateField('interestCount', event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Админы тэмдэглэл
              </span>
              <textarea
                rows={3}
                value={form.note}
                onChange={(event) => updateField('note', event.target.value)}
                placeholder="Энэ клуб яагаад хэрэгтэй, юу шаардлагатай, юуг анхаарах вэ?"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white"
              />
            </label>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="submit"
                className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Хүсэлт үүсгэх
              </button>
              <button
                type="button"
                onClick={() => setForm(initialForm)}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Дахин тохируулах
              </button>
              <span className="text-sm text-slate-500">
                {form.clubName
                  ? `Дараалалд нэмэхэд бэлэн: ${form.clubName}`
                  : 'Шинэ клубийн хүсэлтээс эхлээрэй'}
              </span>
            </div>
          </form>
        </section>

        <aside className="space-y-4">
          <section className="dashboard-entrance rounded-[30px] border border-[#dce7f8] bg-white p-5 shadow-[0_18px_60px_rgba(19,45,96,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6e86a7]">
              Админы анхаарах зүйл
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#183153]">
              Энэ самбар юу удирдах вэ
            </h3>
            <div className="mt-4 space-y-3 text-sm text-[#57708f]">
              <div className="rounded-2xl bg-[#f6f9ff] p-4">
                Дараалал дахь клуб үүсгэх хүсэлтийг батлах эсвэл татгалзах.
              </div>
              <div className="rounded-2xl bg-[#f6f9ff] p-4">
                Админ зөвшөөрсөн үед клубийг pending-ээс active руу шилжүүлэх.
              </div>
              <div className="rounded-2xl bg-[#f6f9ff] p-4">
                Сонирхол {thresholdGoal} сурагчийн босгонд хүрсэн эсэхийг шалгах.
              </div>
              <div className="rounded-2xl bg-[#f6f9ff] p-4">
                Хуурамч, spam, эсвэл сэжигтэй клубийг тархахаас нь өмнө устгах.
              </div>
            </div>
          </section>

          <section className="dashboard-entrance rounded-[30px] border border-[#dce7f8] bg-white p-5 shadow-[0_18px_60px_rgba(19,45,96,0.08)]">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#6e86a7]">
              Сонирхлын дүрэм
            </p>
            <h3 className="mt-2 text-lg font-semibold text-[#183153]">
              Босгын шалгалт
            </h3>
            <p className="mt-2 text-sm text-[#57708f]">
              Клубууд хамгийн бага сонирхлын босгонд хүрвэл нээлт хийхэд бэлэн
              гэж тэмдэглэж болно.
            </p>
            <div className="mt-4 space-y-4">
              {requests.slice(0, 2).map((club) => (
                <div key={club.id} className="rounded-2xl bg-[#f6f9ff] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#183153]">
                        {club.clubName}
                      </p>
                      <p className="text-xs text-[#6e86a7]">{club.teacher}</p>
                    </div>
                    <StatusBadge
                      type={club.interestCount >= thresholdGoal ? 'approved' : 'pending'}
                      text={formatThresholdLabel(club.interestCount)}
                    />
                  </div>
                  <div className="mt-3">
                    <CapacityBar current={club.interestCount} total={thresholdGoal} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section className="dashboard-entrance mt-6 rounded-[30px] border border-[#dce7f8] bg-white p-5 shadow-[0_18px_60px_rgba(19,45,96,0.08)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6e86a7]">
              Батлах дараалал
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#183153]">
              Клуб үүсгэх хүсэлтүүд
            </h2>
            <p className="mt-2 text-sm text-[#57708f]">
              Хүсэлт бүрийг батлах эсвэл татгалзаж, зөвшөөрөгдсөн клубүүдийг
              идэвхтэй жагсаалтад оруулна.
            </p>
          </div>
          <StatusBadge type="pending" text={`${pendingRequests.length} хүлээгдэж байна`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {requests.map((club, index) => {
            const thresholdReached = club.interestCount >= thresholdGoal;

            return (
              <article
                key={club.id}
                className={`rounded-[26px] border p-5 transition ${
                  club.requestStatus === 'rejected'
                    ? 'border-rose-200 bg-rose-50/70'
                    : club.requestStatus === 'approved'
                    ? 'border-emerald-200 bg-emerald-50/60'
                    : 'border-slate-200 bg-slate-50/70'
                } ${index < 2 ? 'dashboard-entrance-delay-1' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#183153]">
                        {club.clubName}
                      </h3>
                      <StatusBadge
                        type={club.clubStatus}
                        text={
                          club.clubStatus === 'active'
                            ? 'active'
                            : club.clubStatus === 'paused'
                            ? 'түр зогссон'
                            : club.clubStatus === 'spam'
                            ? 'spam'
                            : 'pending'
                        }
                      />
                    </div>
                    <p className="mt-1 text-sm text-[#6e86a7]">
                      {club.teacher} · {club.gradeRange}
                    </p>
                  </div>
                  <StatusBadge
                    type={club.requestStatus}
                    text={
                      club.requestStatus === 'approved'
                        ? 'батлагдсан'
                        : club.requestStatus === 'rejected'
                        ? 'татгалзсан'
                        : 'pending'
                    }
                  />
                </div>

                <p className="mt-3 text-sm text-[#57708f]">{club.note}</p>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-[#183153] sm:grid-cols-4">
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6e86a7]">
                      Үүсгэсэн
                    </p>
                    <p className="mt-1 font-medium">{club.createdBy}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6e86a7]">
                      Өдрүүд
                    </p>
                    <p className="mt-1 font-medium">{club.allowedDays}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6e86a7]">
                      Хязгаар
                    </p>
                    <p className="mt-1 font-medium">{club.studentLimit}</p>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#6e86a7]">
                      Сонирхол
                    </p>
                    <p className="mt-1 font-medium">
                      {club.interestCount}/{thresholdGoal}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <CapacityBar current={club.interestCount} total={thresholdGoal} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => approveRequest(club.id)}
                    disabled={club.requestStatus !== 'pending'}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                  >
                    Батлах
                  </button>
                  <button
                    type="button"
                    onClick={() => rejectRequest(club.id)}
                    disabled={club.requestStatus !== 'pending'}
                    className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Татгалзах
                  </button>
                  <span className="text-xs text-[#6e86a7]">
                    {thresholdReached
                      ? 'Нээлт хийхэд бэлэн'
                      : formatThresholdLabel(club.interestCount)}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dashboard-entrance mt-6 rounded-[30px] border border-[#dce7f8] bg-white p-5 shadow-[0_18px_60px_rgba(19,45,96,0.08)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6e86a7]">
              Төлөв удирдлага
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#183153]">
              Клубийн төлөвийн удирдлага
            </h2>
            <p className="mt-2 text-sm text-[#57708f]">
              Клубийг pending болон active хооронд шилжүүлж, илүү шалгах
              шаардлагатайг түр зогсооно.
            </p>
          </div>
          <StatusBadge type="active" text={`${activeCount} active`} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeClubs.map((club) => (
            <article
              key={club.id}
              className="rounded-[26px] border border-slate-200 bg-slate-50/80 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#183153]">
                    {club.clubName}
                  </h3>
                  <p className="mt-1 text-sm text-[#6e86a7]">{club.teacher}</p>
                </div>
                <StatusBadge type={club.clubStatus} text={club.clubStatus} />
              </div>

              <div className="mt-4 space-y-3 text-sm text-[#57708f]">
                <p>{club.note}</p>
                <p>
                  {club.allowedDays} · {club.gradeRange}
                </p>
                <CapacityBar current={club.interestCount} total={club.studentLimit} />
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => toggleClubStatus(club.id)}
                  className="rounded-full bg-[#173765] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#112a48]"
                >
                  {club.clubStatus === 'active'
                    ? 'Клубийг түр зогсоох'
                    : 'Клубийг идэвхжүүлэх'}
                </button>
                <StatusBadge
                  type={club.interestCount >= thresholdGoal ? 'approved' : 'pending'}
                  text={formatThresholdLabel(club.interestCount)}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-entrance mt-6 rounded-[30px] border border-[#dce7f8] bg-white p-5 shadow-[0_18px_60px_rgba(19,45,96,0.08)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#6e86a7]">
              Модераци
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#183153]">
              Spam болон хуурамч клуб цэвэрлэгээ
            </h2>
            <p className="mt-2 text-sm text-[#57708f]">
              Эдгээр хүсэлтүүд сэжигтэй харагдаж байна. Системийг бохирдуулах
              өмнө устгаарай.
            </p>
          </div>
          <StatusBadge type="spam" text={`${spamQueue.length} flagged`} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {spamQueue.map((club) => (
            <article
              key={club.id}
              className="rounded-[26px] border border-rose-200 bg-rose-50/70 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#183153]">
                    {club.clubName}
                  </h3>
                  <p className="mt-1 text-sm text-[#6e86a7]">{club.teacher}</p>
                </div>
                <StatusBadge type="spam" text="тэмдэглэгдсэн" />
              </div>

              <p className="mt-3 text-sm text-[#57708f]">{club.note}</p>
              <p className="mt-3 rounded-2xl bg-white/80 p-3 text-sm text-[#b5474a]">
                {club.flaggedReason}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => removeSpamClub(club.id)}
                  className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
                >
                  Spam клуб устгах
                </button>
                <span className="text-xs text-[#8f5a5d]">{club.createdBy}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
