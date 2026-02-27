/**
 * releaser.js — Full release flow: changelog → bump → commit → tag
 */

import { execFileSync } from 'node:child_process';
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { bump } from './bumper.js';
import { buildChangelog } from './changelog.js';
import { tag } from './tagger.js';
import {
  header,
  printChangelog,
  printVersionBump,
  printBumpReason,
  printTagCreated,
  printDryRunBanner,
  printReleaseSummary,
  info,
} from './formatter.js';

const CHANGELOG_FILE = 'CHANGELOG.md';

/**
 * Prepend new changelog section to CHANGELOG.md (or create it)
 * @param {string} newSection — markdown string for this release
 * @param {boolean} dryRun
 * @param {string} cwd
 * @returns {number} total lines in new changelog
 */
function writeChangelog(newSection, dryRun, cwd = process.cwd()) {
  const path = resolve(cwd, CHANGELOG_FILE);

  const header = `# Changelog\n\nAll notable changes to this project will be documented in this file.\n\nThe format is based on [Keep a Changelog](https://keepachangelog.com/).\n\n`;

  let existing = '';
  if (existsSync(path)) {
    const content = readFileSync(path, 'utf8');
    // Strip the standard header if present, keep only the version sections
    existing = content.replace(/^#[^\n]*\n[\s\S]*?(?=^## )/m, '').trim();
    if (existing) existing = '\n\n' + existing;
  }

  const full = header + newSection + existing + '\n';

  if (!dryRun) {
    writeFileSync(path, full, 'utf8');
  }

  return full.split('\n').length;
}

/**
 * Stage files and create a release commit
 * @param {string} version
 * @param {boolean} dryRun
 */
function commitRelease(version, dryRun) {
  if (dryRun) return;

  execFileSync('git', ['add', 'package.json', CHANGELOG_FILE], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  execFileSync(
    'git',
    ['commit', '-m', `chore(release): v${version}`],
    { stdio: ['pipe', 'pipe', 'pipe'] }
  );
}

/**
 * High-level release orchestrator
 * @param {object} opts
 * @param {boolean} [opts.dryRun]
 * @param {string}  [opts.force] — override bump type
 * @param {boolean} [opts.push]  — push tag to remote (default true)
 * @param {boolean} [opts.preview] — print changelog preview
 */
export async function release({ dryRun = false, force = null, push = true, preview = true } = {}) {
  header('release-pilot');

  if (dryRun) printDryRunBanner();

  // 1. Bump version
  const { current, next, bumpType, commits } = bump({ dryRun, force });

  printVersionBump(current, next, bumpType);
  printBumpReason(commits);

  // 2. Build changelog
  const { changelog } = buildChangelog(next);

  if (preview) printChangelog(changelog);

  // 3. Write CHANGELOG.md
  const lines = writeChangelog(changelog, dryRun);
  info(dryRun ? `Would write ${lines} lines to ${CHANGELOG_FILE}` : `Wrote ${CHANGELOG_FILE}`);

  // 4. Commit
  commitRelease(next, dryRun);
  info(dryRun ? `Would commit: chore(release): v${next}` : `Committed release`);

  // 5. Tag
  const tagMessage = `Release v${next}\n\n${changelog.slice(0, 500)}`;
  const { tag: tagName, pushed } = tag({
    version: next,
    message: tagMessage,
    dryRun,
    push,
  });

  printTagCreated(tagName, pushed && !dryRun);

  // 6. Summary
  printReleaseSummary({
    version: next,
    tag: tagName,
    changelogLines: lines,
    dryRun,
  });
}
