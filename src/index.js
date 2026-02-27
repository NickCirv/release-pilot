/**
 * src/index.js — Public API barrel for release-pilot
 *
 * Re-exports all public functions from the six core modules and exposes
 * convenience command functions used by the CLI.
 */

// ─── parser ───────────────────────────────────────────────────────────────────
export {
  parseCommit,
  parseCommits,
  COMMIT_TYPES,
} from './parser.js';

// ─── changelog ────────────────────────────────────────────────────────────────
export {
  getLastTag,
  fetchCommitsSince,
  groupByType,
  hasBreakingChanges,
  collectBreakingChanges,
  generateChangelog,
  buildChangelog,
} from './changelog.js';

// ─── bumper ───────────────────────────────────────────────────────────────────
export {
  determineBumpType,
  calcNextVersion,
  readCurrentVersion,
  writeVersion,
  bump,
} from './bumper.js';

// ─── tagger ───────────────────────────────────────────────────────────────────
export {
  tagExists,
  createTag,
  pushTag,
  hasRemote,
  tag,
} from './tagger.js';

// ─── formatter ────────────────────────────────────────────────────────────────
export {
  sym,
  header,
  subheader,
  printChangelog,
  printVersionBump,
  printBumpReason,
  printTagCreated,
  printDryRunBanner,
  printDryRunStep,
  printReleaseSummary,
  printError,
  info,
} from './formatter.js';

// ─── releaser ─────────────────────────────────────────────────────────────────
export { release } from './releaser.js';

// ─── CLI command functions ────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import { release as _release } from './releaser.js';
import {
  getLastTag,
  fetchCommitsSince,
  buildChangelog,
} from './changelog.js';
import { parseCommits } from './parser.js';
import { bump } from './bumper.js';
import {
  header,
  subheader,
  printChangelog,
  printVersionBump,
  printBumpReason,
  printDryRunBanner,
  printDryRunStep,
  printError,
  info,
  sym,
} from './formatter.js';
import chalk from 'chalk';

/**
 * Full release flow — called by `release-pilot release`
 * @param {object} opts
 * @param {boolean} [opts.dryRun]
 * @param {string|null} [opts.force]
 * @param {boolean} [opts.push]
 */
export async function releaseCommand({ dryRun = false, force = null, push = true } = {}) {
  await _release({ dryRun, force, push });
}

/**
 * Changelog preview — called by `release-pilot changelog`
 * @param {object} opts
 * @param {boolean} [opts.json]
 */
export async function changelogCommand({ json = false } = {}) {
  const lastTag = getLastTag();
  const rawCommits = fetchCommitsSince(lastTag);
  const commits = parseCommits(rawCommits);

  // Compute next version for the preview heading
  const { determineBumpType, calcNextVersion, readCurrentVersion } = await import('./bumper.js');
  const current = readCurrentVersion();
  const bumpType = determineBumpType(commits);
  const next = calcNextVersion(current, bumpType);

  const { changelog, breaking } = buildChangelog(next);

  if (json) {
    process.stdout.write(
      JSON.stringify({ version: next, bumpType, breaking, commits, changelog }, null, 2) + '\n'
    );
    return;
  }

  header('Changelog Preview');
  info(`Next version: ${chalk.bold(next)}  (${bumpType} bump)`);
  printChangelog(changelog);
}

/**
 * Version bump only — called by `release-pilot bump`
 * @param {object} opts
 * @param {boolean} [opts.dryRun]
 * @param {string|null} [opts.force]
 */
export async function bumpCommand({ dryRun = false, force = null } = {}) {
  header('Version Bump');

  if (dryRun) printDryRunBanner();

  const { current, next, bumpType, commits } = bump({ dryRun, force });

  printVersionBump(current, next, bumpType);
  printBumpReason(commits);

  if (dryRun) {
    printDryRunStep('Would write version', next);
  } else {
    info(`package.json updated  ${chalk.gray(`${current} → ${next}`)}`);
  }
}

/**
 * Readiness check — called by `release-pilot check`
 * @returns {boolean} true if ready for release
 */
export async function checkCommand() {
  header('Release Readiness Check');

  let ready = true;

  // 1. Working tree clean?
  try {
    const status = execFileSync('git', ['status', '--porcelain'], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    if (status) {
      console.log(`  ${sym.cross}  Working tree has uncommitted changes`);
      ready = false;
    } else {
      console.log(`  ${sym.check}  Working tree is clean`);
    }
  } catch {
    console.log(`  ${sym.cross}  Cannot run git status — is this a git repo?`);
    ready = false;
  }

  // 2. On main or master?
  try {
    const branch = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'pipe'],
    }).trim();

    if (branch === 'main' || branch === 'master') {
      console.log(`  ${sym.check}  On branch: ${chalk.bold(branch)}`);
    } else {
      console.log(`  ${sym.warn}  On branch: ${chalk.yellow(branch)} (expected main or master)`);
      ready = false;
    }
  } catch {
    console.log(`  ${sym.cross}  Cannot determine current branch`);
    ready = false;
  }

  // 3. Remote configured?
  try {
    execFileSync('git', ['remote', 'get-url', 'origin'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    console.log(`  ${sym.check}  Remote "origin" is configured`);
  } catch {
    console.log(`  ${sym.warn}  No remote "origin" — tag will not be pushed`);
  }

  console.log('');

  if (ready) {
    console.log(`  ${sym.rocket}  ${chalk.green.bold('Ready to release.')}`);
  } else {
    console.log(`  ${sym.cross}  ${chalk.red.bold('Not ready. Fix the issues above first.')}`);
  }

  console.log('');
  return ready;
}
