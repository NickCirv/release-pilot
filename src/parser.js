/**
 * parser.js — Parse conventional commits
 * Spec: https://www.conventionalcommits.org/
 */

const COMMIT_PATTERN = /^(?<type>[a-z]+)(?:\((?<scope>[^)]+)\))?(?<breaking>!)?\s*:\s*(?<description>.+)$/;
const BREAKING_BODY_PATTERN = /BREAKING CHANGE[:\s]/i;

/**
 * Parse a single commit object from git log
 * @param {string} raw — full commit string "hash\x00subject\x00body"
 * @returns {{ hash, type, scope, description, body, breaking }} | null
 */
export function parseCommit(raw) {
  const parts = raw.split('\x00');
  const hash = (parts[0] || '').trim();
  const subject = (parts[1] || '').trim();
  const body = (parts[2] || '').trim();

  if (!subject) return null;

  const match = subject.match(COMMIT_PATTERN);
  if (!match) {
    return {
      hash,
      type: 'other',
      scope: null,
      description: subject,
      body,
      breaking: false,
      raw: subject,
    };
  }

  const { type, scope, breaking, description } = match.groups;
  const isBreaking = Boolean(breaking) || BREAKING_BODY_PATTERN.test(body);

  return {
    hash,
    type: type.toLowerCase(),
    scope: scope || null,
    description: description.trim(),
    body: body.trim(),
    breaking: isBreaking,
    raw: subject,
  };
}

/**
 * Parse an array of raw commit strings
 * @param {string[]} rawCommits
 * @returns {object[]}
 */
export function parseCommits(rawCommits) {
  return rawCommits
    .map(parseCommit)
    .filter(Boolean);
}

/**
 * Known conventional commit types and their display labels
 */
export const COMMIT_TYPES = {
  feat:     { label: 'Features',          order: 0 },
  fix:      { label: 'Bug Fixes',         order: 1 },
  perf:     { label: 'Performance',       order: 2 },
  refactor: { label: 'Refactoring',       order: 3 },
  docs:     { label: 'Documentation',     order: 4 },
  test:     { label: 'Tests',             order: 5 },
  ci:       { label: 'CI / CD',           order: 6 },
  chore:    { label: 'Chores',            order: 7 },
  build:    { label: 'Build System',      order: 8 },
  style:    { label: 'Style',             order: 9 },
  revert:   { label: 'Reverts',           order: 10 },
  other:    { label: 'Other Changes',     order: 11 },
};
