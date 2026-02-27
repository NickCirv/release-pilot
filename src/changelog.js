/**
 * changelog.js — Generate Keep a Changelog markdown from git history
 */

import { execFileSync } from 'node:child_process';
import { parseCommits, COMMIT_TYPES } from './parser.js';

/**
 * Get the most recent git tag, or null if no tags exist
 * @returns {string|null}
 */
export function getLastTag() {
  try {
    const tag = execFileSync('git', ['describe', '--tags', '--abbrev=0'], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();
    return tag || null;
  } catch {
    return null;
  }
}

/**
 * Fetch commits since a given tag (or all commits if no tag)
 * @param {string|null} since — tag ref or null
 * @returns {string[]} raw commit strings
 */
export function fetchCommitsSince(since) {
  const range = since ? `${since}..HEAD` : 'HEAD';
  const separator = '---COMMIT---';
  const format = `%H\x00%s\x00%b`;

  try {
    const output = execFileSync(
      'git',
      ['log', range, `--format=${separator}${format}`, '--no-merges'],
      { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }
    );

    return output
      .split(separator)
      .map(s => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Group parsed commits by their type, sorted by display order
 * @param {object[]} commits
 * @returns {Map<string, object[]>}
 */
export function groupByType(commits) {
  const groups = new Map();

  for (const commit of commits) {
    const type = COMMIT_TYPES[commit.type] ? commit.type : 'other';
    if (!groups.has(type)) groups.set(type, []);
    groups.get(type).push(commit);
  }

  // Sort map keys by display order
  const sorted = new Map(
    [...groups.entries()].sort(([a], [b]) => {
      const orderA = COMMIT_TYPES[a]?.order ?? 99;
      const orderB = COMMIT_TYPES[b]?.order ?? 99;
      return orderA - orderB;
    })
  );

  return sorted;
}

/**
 * Detect if any parsed commits contain breaking changes
 * @param {object[]} commits
 * @returns {boolean}
 */
export function hasBreakingChanges(commits) {
  return commits.some(c => c.breaking);
}

/**
 * Collect all breaking change descriptions
 * @param {object[]} commits
 * @returns {string[]}
 */
export function collectBreakingChanges(commits) {
  return commits
    .filter(c => c.breaking)
    .map(c => {
      const scope = c.scope ? `**${c.scope}**: ` : '';
      return `${scope}${c.description}`;
    });
}

/**
 * Format a single commit entry as a markdown list item
 * @param {object} commit
 * @returns {string}
 */
function formatEntry(commit) {
  const scope = commit.scope ? `**${commit.scope}**: ` : '';
  const hash = commit.hash ? ` ([${commit.hash.slice(0, 7)}])` : '';
  return `- ${scope}${commit.description}${hash}`;
}

/**
 * Generate Keep a Changelog markdown string
 * @param {object} opts
 * @param {string} opts.version — next version string (e.g. "1.2.0")
 * @param {object[]} opts.commits — parsed commits
 * @param {string|null} opts.lastTag — previous tag for comparison link
 * @returns {string}
 */
export function generateChangelog({ version, commits, lastTag }) {
  const date = new Date().toISOString().slice(0, 10);
  const groups = groupByType(commits);
  const breaking = collectBreakingChanges(commits);

  const lines = [];
  lines.push(`## [${version}] - ${date}`);
  lines.push('');

  if (breaking.length > 0) {
    lines.push('### BREAKING CHANGES');
    lines.push('');
    for (const b of breaking) {
      lines.push(`- ${b}`);
    }
    lines.push('');
  }

  for (const [type, typeCommits] of groups) {
    const label = COMMIT_TYPES[type]?.label ?? 'Other';
    lines.push(`### ${label}`);
    lines.push('');
    for (const commit of typeCommits) {
      lines.push(formatEntry(commit));
    }
    lines.push('');
  }

  if (lastTag) {
    lines.push(
      `[${version}]: https://github.com/NickCirv/release-pilot/compare/${lastTag}...v${version}`
    );
  } else {
    lines.push(
      `[${version}]: https://github.com/NickCirv/release-pilot/releases/tag/v${version}`
    );
  }

  return lines.join('\n');
}

/**
 * High-level: build the full changelog string for the upcoming release
 * @param {string} nextVersion
 * @returns {{ changelog: string, commits: object[], lastTag: string|null, breaking: boolean }}
 */
export function buildChangelog(nextVersion) {
  const lastTag = getLastTag();
  const rawCommits = fetchCommitsSince(lastTag);
  const commits = parseCommits(rawCommits);
  const changelog = generateChangelog({ version: nextVersion, commits, lastTag });
  const breaking = hasBreakingChanges(commits);

  return { changelog, commits, lastTag, breaking };
}
