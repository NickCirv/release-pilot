/**
 * bumper.js — Determine semver bump and update package.json
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseCommits, COMMIT_TYPES } from './parser.js';
import { getLastTag, fetchCommitsSince, hasBreakingChanges } from './changelog.js';

/**
 * Determine the bump type from parsed commits
 * @param {object[]} commits
 * @returns {'major'|'minor'|'patch'}
 */
export function determineBumpType(commits) {
  if (hasBreakingChanges(commits)) return 'major';

  const types = new Set(commits.map(c => c.type));

  if (types.has('feat')) return 'minor';

  // Everything else = patch
  return 'patch';
}

/**
 * Calculate the next version string given current version and bump type
 * @param {string} current — e.g. "1.2.3"
 * @param {'major'|'minor'|'patch'} bumpType
 * @returns {string}
 */
export function calcNextVersion(current, bumpType) {
  const clean = current.replace(/^v/, '');
  const parts = clean.split('.').map(Number);

  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid semver: "${current}"`);
  }

  let [major, minor, patch] = parts;

  switch (bumpType) {
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'patch':
      patch += 1;
      break;
  }

  return `${major}.${minor}.${patch}`;
}

/**
 * Read the current version from package.json
 * @param {string} cwd — working directory
 * @returns {string}
 */
export function readCurrentVersion(cwd = process.cwd()) {
  const pkgPath = resolve(cwd, 'package.json');
  try {
    const raw = readFileSync(pkgPath, 'utf8');
    const pkg = JSON.parse(raw);
    if (!pkg.version) throw new Error('No version field in package.json');
    return pkg.version;
  } catch (err) {
    throw new Error(`Cannot read package.json at ${pkgPath}: ${err.message}`);
  }
}

/**
 * Write a new version to package.json (preserves formatting)
 * @param {string} newVersion
 * @param {string} cwd — working directory
 */
export function writeVersion(newVersion, cwd = process.cwd()) {
  const pkgPath = resolve(cwd, 'package.json');
  const raw = readFileSync(pkgPath, 'utf8');
  const pkg = JSON.parse(raw);
  pkg.version = newVersion;
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

/**
 * High-level: analyse commits, compute next version, optionally write it
 * @param {object} opts
 * @param {boolean} opts.dryRun — if true, do not write
 * @param {string} [opts.force] — override bump type: 'major'|'minor'|'patch'
 * @returns {{ current, next, bumpType, commits }}
 */
export function bump({ dryRun = false, force = null } = {}) {
  const lastTag = getLastTag();
  const rawCommits = fetchCommitsSince(lastTag);
  const commits = parseCommits(rawCommits);
  const current = readCurrentVersion();
  const bumpType = force || determineBumpType(commits);
  const next = calcNextVersion(current, bumpType);

  if (!dryRun) {
    writeVersion(next);
  }

  return { current, next, bumpType, commits };
}
