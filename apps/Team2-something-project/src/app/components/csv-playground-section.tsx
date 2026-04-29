'use client';

import { useState } from 'react';

import { parseCsv } from '../lib/parse-csv';
import { Reveal } from './reveal';

const sampleCsv = `club,teacher,seats
Robotics Lab,Ms. Ariunaa,2
Creative Writing,Mr. Batbold,5
Debate Circle,Ms. Saruul,1`;

export function CsvPlaygroundSection() {
  const [csvText, setCsvText] = useState(sampleCsv);

  let output = '';
  let errorMessage = '';

  try {
    output = JSON.stringify(parseCsv(csvText), null, 2);
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : 'Failed to parse CSV input.';
  }

  return (
    <section id="resources" className="csv-playground-section">
      <Reveal className="csv-playground-shell" variant="up">
        <div className="csv-playground-copy">
          <p className="landing-micro">Prototype tool</p>
          <h2>Try the CSV to JSON helper inside the app</h2>
          <p>
            A quick playground for turning small club lists into structured JSON
            before wiring them into the rest of the workflow.
          </p>
        </div>

        <div className="csv-playground-grid">
          <label className="csv-panel">
            <span>CSV input</span>
            <textarea
              value={csvText}
              onChange={(event) => setCsvText(event.target.value)}
              spellCheck={false}
            />
          </label>

          <section className="csv-panel csv-output-panel" aria-live="polite">
            <span>JSON output</span>
            {errorMessage ? <p>{errorMessage}</p> : <pre>{output}</pre>}
          </section>
        </div>
      </Reveal>
    </section>
  );
}
