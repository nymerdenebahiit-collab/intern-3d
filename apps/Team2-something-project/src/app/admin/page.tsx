'use client';

import { useState } from 'react';

const teacherOptions = [
  'Ms. Saruul',
  'Mr. Bat-Erdene',
  'Ms. Nomin',
  'Mr. Temuulen',
] as const;

const scheduleOptions = [
  'Mon, Wed · 15:00',
  'Tue, Thu · 15:30',
  'Fri · 16:10',
  'Wed, Sat · 14:00',
] as const;

const gradeOptions = [
  'Grade 6A - 6C',
  'Grade 7A - 8B',
  'Grade 8A - 9C',
  'Grade 9A - 10B',
] as const;

const systemCards = [
  {
    title: 'Club setup',
    description: 'Create clubs, set caps, and assign the right teacher.',
  },
  {
    title: 'Approval policy',
    description: 'Teachers review requests first, but admins can still intervene.',
  },
  {
    title: 'Capacity control',
    description: 'Once limits are reached, students stop seeing open request actions.',
  },
] as const;

const initialForm = {
  clubName: '',
  teacher: teacherOptions[0],
  schedule: scheduleOptions[0],
  gradeRange: gradeOptions[0],
  room: 'Room 301',
  limit: '16',
};

export default function AdminPage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'draft' | 'created'>('idle');

  const updateField = (field: keyof typeof initialForm, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
    setStatus('idle');
  };

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('created');
  };

  const handleSaveDraft = () => {
    setStatus('draft');
  };

  return (
    <main className="admin-shell">
      <section className="admin-frame">
        <header className="admin-hero">
          <div>
            <p className="section-label">Admin dashboard</p>
            <h1>Create clubs and manage how the whole system runs.</h1>
            <p className="admin-hero-text">
              Ene heseg deer admin n shine club uusgeh, bagsh onooh, angiin
              huree bolon capacity-g tohiruulah zereg system-iin gol control-uud
              deer ajillana.
            </p>
          </div>

          <div className="admin-highlight">
            <p className="section-label">System snapshot</p>
            <strong>4 active clubs</strong>
            <p>
              2 club deer suudal hovor baigaa, 1 club deer teacher review ih
              orj irsen tul admin hяналт hiih shaardlagatai baina.
            </p>
          </div>
        </header>

        <section className="admin-layout">
          <section className="admin-form-panel">
            <div className="admin-form-head">
              <p className="section-label">Club creation</p>
              <h2>Open a new club</h2>
            </div>

            <form className="admin-form" onSubmit={handleCreate}>
              <label className="admin-field admin-field-wide">
                <span>Club name</span>
                <input
                  type="text"
                  value={form.clubName}
                  onChange={(event) =>
                    updateField('clubName', event.target.value)
                  }
                  placeholder="e.g. Science Explorers"
                />
              </label>

              <label className="admin-field">
                <span>Teacher</span>
                <select
                  value={form.teacher}
                  onChange={(event) => updateField('teacher', event.target.value)}
                >
                  {teacherOptions.map((teacher) => (
                    <option key={teacher} value={teacher}>
                      {teacher}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-field">
                <span>Schedule</span>
                <select
                  value={form.schedule}
                  onChange={(event) =>
                    updateField('schedule', event.target.value)
                  }
                >
                  {scheduleOptions.map((schedule) => (
                    <option key={schedule} value={schedule}>
                      {schedule}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-field">
                <span>Grade range</span>
                <select
                  value={form.gradeRange}
                  onChange={(event) =>
                    updateField('gradeRange', event.target.value)
                  }
                >
                  {gradeOptions.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-field">
                <span>Room</span>
                <input
                  type="text"
                  value={form.room}
                  onChange={(event) => updateField('room', event.target.value)}
                />
              </label>

              <label className="admin-field">
                <span>Student limit</span>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={form.limit}
                  onChange={(event) => updateField('limit', event.target.value)}
                />
              </label>

              <div className="admin-form-actions">
                <button type="submit" className="admin-primary-button">
                  Create club
                </button>
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={handleSaveDraft}
                >
                  Save draft
                </button>
              </div>

              <p className="admin-status-text">
                {status === 'created'
                  ? `Club ready: ${form.clubName || 'Untitled club'}`
                  : status === 'draft'
                  ? 'Draft saved locally'
                  : 'Fill in the setup and create the next club'}
              </p>
            </form>
          </section>

          <aside className="admin-sidebar">
            <section className="admin-panel admin-panel-accent">
              <p className="section-label">Admin notes</p>
              <h3>What to check first</h3>
              <ul className="admin-rule-list">
                <li>Teacher availability and room overlap.</li>
                <li>Correct grade range before opening requests.</li>
                <li>Capacity should match the actual classroom size.</li>
              </ul>
            </section>

            {systemCards.map((card) => (
              <section key={card.title} className="admin-panel">
                <p className="section-label">System control</p>
                <h3>{card.title}</h3>
                <p className="admin-panel-text">{card.description}</p>
              </section>
            ))}
          </aside>
        </section>
      </section>
    </main>
  );
}
