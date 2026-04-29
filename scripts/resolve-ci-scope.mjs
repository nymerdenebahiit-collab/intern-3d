#!/usr/bin/env node

import { appendFileSync, existsSync, readFileSync } from 'node:fs';

const TEAM_PROJECTS = {
  timeline: ['TimeLine', 'TimeLine-e2e'],
  TOM: ['@org/web', '@org/api', '@org/api-e2e'],
  team2: ['something-project', 'something-project-e2e'],
};

const TEAM_LABEL_ALIASES = {
  timeline: 'timeline',
  TimeLine: 'timeline',
  timeline_team: 'timeline',
  tom: 'TOM',
  TOM: 'TOM',
  team2: 'team2',
  Team2: 'team2',
};

function readPullRequestEvent() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath || !existsSync(eventPath)) {
    return null;
  }

  const event = JSON.parse(readFileSync(eventPath, 'utf8'));
  return event.pull_request ? event : null;
}

function normalizeTeamLabel(label) {
  const direct = TEAM_LABEL_ALIASES[label];
  if (direct) {
    return direct;
  }

  const normalized = label.toLowerCase();
  if (normalized === 'timeline') {
    return 'timeline';
  }
  if (normalized === 'tom') {
    return 'TOM';
  }
  if (normalized === 'team2') {
    return 'team2';
  }

  return null;
}

function getTeamLabel(event) {
  const labels = event.pull_request.labels
    .map((label) => normalizeTeamLabel(label.name))
    .filter((label) => label !== null);

  const unique = [...new Set(labels)];

  if (unique.length === 0) {
    throw new Error(
      `Expected exactly one team label. Found: none.\nAdd one of: ${Object.keys(TEAM_PROJECTS).join(
        ', '
      )}.`
    );
  }

  if (unique.length !== 1) {
    throw new Error(
      `Expected exactly one team label. Found: ${
        unique.length ? unique.join(', ') : 'none'
      }.`
    );
  }

  return unique[0];
}

function setOutput(name, value) {
  const outputPath = process.env.GITHUB_OUTPUT;
  if (!outputPath) {
    return;
  }
  appendFileSync(outputPath, `${name}=${value}\n`);
}

function main() {
  const event = readPullRequestEvent();

  if (!event) {
    setOutput('is_pr', 'false');
    setOutput('team', '');
    setOutput('projects', '');
    console.log('Non-PR event detected; CI should use full workspace scope.');
    return;
  }

  const team = getTeamLabel(event);

  const projects = TEAM_PROJECTS[team].join(',');

  setOutput('is_pr', 'true');
  setOutput('team', team);
  setOutput('projects', projects);

  console.log(`Resolved team "${team}" with projects: ${projects}`);
}

main();
