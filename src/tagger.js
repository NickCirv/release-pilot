/**
 * tagger.js — Create annotated git tags and push to remote
 */

import { execFileSync } from 'node:child_process';

/**
 * Check whether a given tag already exists locally
 * @param {string} tag
 * @returns {boolean}
 */
export function tagExists(tag) {
  try {
    execFileSync('git', ['rev-parse', '--verify', `refs/tags/${tag}`], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Create an annotated git tag
 * @param {string} version — e.g. "1.2.0" (v prefix added automatically)
 * @param {string} message — tag annotation message
 * @param {boolean} dryRun
 * @returns {string} — the full tag name created (e.g. "v1.2.0")
 */
export function createTag(version, message, dryRun = false) {
  const tag = version.startsWith('v') ? version : `v${version}`;

  if (tagExists(tag)) {
    throw new Error(`Tag "${tag}" already exists. Delete it first or bump the version.`);
  }

  if (!dryRun) {
    execFileSync('git', ['tag', '-a', tag, '-m', message], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  }

  return tag;
}

/**
 * Push a tag to the remote
 * @param {string} tag — full tag name e.g. "v1.2.0"
 * @param {string} remote — default "origin"
 * @param {boolean} dryRun
 */
export function pushTag(tag, remote = 'origin', dryRun = false) {
  if (dryRun) return;

  try {
    execFileSync('git', ['push', remote, tag], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (err) {
    throw new Error(`Failed to push tag "${tag}" to "${remote}": ${err.message}`);
  }
}

/**
 * Check if a remote is configured
 * @param {string} remote
 * @returns {boolean}
 */
export function hasRemote(remote = 'origin') {
  try {
    execFileSync('git', ['remote', 'get-url', remote], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * High-level: create and push an annotated tag
 * @param {object} opts
 * @param {string} opts.version
 * @param {string} opts.message
 * @param {string} [opts.remote]
 * @param {boolean} [opts.dryRun]
 * @param {boolean} [opts.push] — whether to push after tagging
 * @returns {{ tag, pushed }}
 */
export function tag({ version, message, remote = 'origin', dryRun = false, push = true }) {
  const tagName = createTag(version, message, dryRun);
  let pushed = false;

  if (push) {
    if (!hasRemote(remote)) {
      // No remote configured — skip push silently
      pushed = false;
    } else {
      pushTag(tagName, remote, dryRun);
      pushed = true;
    }
  }

  return { tag: tagName, pushed };
}
