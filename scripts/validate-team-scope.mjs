#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const TEAM_RULES = {
  timeline: {
    allowedPrefixes: ['apps/TimeLine/', 'apps/TimeLine-e2e/'],
  },
  TOM: {
    allowedPrefixes: ['apps/TOM-web/', 'apps/TOM-api/', 'apps/api-e2e/'],
  },
  team2: {
    allowedPrefixes: [
      'apps/Team2-something-project/',
      'apps/Team2-something-project-e2e/',
    ],
  },
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

const SHARED_PREFIXES = ['.github/', 'scripts/'];

const SHARED_FILES = new Set([
  '.gitignore',
  'AGENTS.md',
  'README.md',
  'eslint.config.mjs',
  'jest.config.ts',
  'jest.preset.js',
  'nx.json',
  'package-lock.json',
  'package.json',
  'tsconfig.base.json',
  'tsconfig.json',
]);

function fail(message) {
  console.error(`\nTeam scope validation failed.\n${message}\n`);
  process.exit(1);
}

function getPullRequestEvent() {
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
    fail(
      `Expected exactly one team label on the pull request. Found: none.\nAdd one of: ${Object.keys(
        TEAM_RULES
      ).join(', ')}`
    );
  }

  if (unique.length !== 1) {
    fail(
      `Expected exactly one team label on the pull request. Found: ${
        unique.length ? unique.join(', ') : 'none'
      }.\nAdd one of: ${Object.keys(TEAM_RULES).join(', ')}`
    );
  }

  return unique[0];
}

function getMergeBase(baseSha, headSha) {
  return execFileSync('git', ['merge-base', baseSha, headSha], {
    encoding: 'utf8',
  }).trim();
}

function getChangedFiles(baseSha, headSha) {
  const mergeBase = getMergeBase(baseSha, headSha);
  const output = execFileSync(
    'git',
    ['diff', '--name-only', '--diff-filter=ACMR', mergeBase, headSha],
    { encoding: 'utf8' }
  );

  return output
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean);
}

function isSharedPath(file) {
  return SHARED_FILES.has(file) || SHARED_PREFIXES.some((prefix) => file.startsWith(prefix));
}

function isAllowedForTeam(file, team) {
  if (isSharedPath(file)) {
    return true;
  }

  return TEAM_RULES[team].allowedPrefixes.some((prefix) => file.startsWith(prefix));
}

function main() {
  const event = getPullRequestEvent();

  if (!event) {
    console.log('No pull request event detected; skipping team scope validation.');
    return;
  }

  const team = getTeamLabel(event);

  const baseSha = event.pull_request.base.sha;
  const headSha = event.pull_request.head.sha;
  const changedFiles = getChangedFiles(baseSha, headSha);

  if (!changedFiles.length) {
    console.log(`No changed files detected for ${team}; skipping.`);
    return;
  }

  const disallowedFiles = changedFiles.filter((file) => !isAllowedForTeam(file, team));

  if (disallowedFiles.length) {
    fail(
      `Label "${team}" only allows changes in:\n- ${TEAM_RULES[team].allowedPrefixes.join(
        '\n- '
      )}\n\nShared workspace files are also allowed.\n\nDisallowed files:\n- ${disallowedFiles.join(
        '\n- '
      )}`
    );
  }

  console.log(
    `Team scope validation passed for "${team}". Checked ${changedFiles.length} changed file(s).`
  );
}

main();
