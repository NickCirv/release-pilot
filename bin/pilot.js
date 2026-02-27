#!/usr/bin/env node

/**
 * bin/pilot.js — CLI entry point for release-pilot
 */

import { program } from 'commander';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pkg = require(resolve(__dirname, '../package.json'));

program
  .name('release-pilot')
  .description('Automated releases with AI-style changelogs from conventional commits')
  .version(pkg.version);

// ─── release (default command) ────────────────────────────────────────────────

program
  .command('release', { isDefault: true })
  .description('Run the full release flow: bump version, generate changelog, commit, tag, push')
  .option('--dry-run', 'Preview all actions without making any changes', false)
  .option('--force <type>', 'Override bump type: major | minor | patch')
  .option('--no-push', 'Skip pushing tag to remote')
  .action(async (opts) => {
    try {
      const { releaseCommand } = await import('../src/index.js');
      await releaseCommand({
        dryRun: opts.dryRun,
        force: opts.force || null,
        push: opts.push,
      });
    } catch (err) {
      const { printError } = await import('../src/index.js');
      printError(err.message);
      process.exit(1);
    }
  });

// ─── changelog ────────────────────────────────────────────────────────────────

program
  .command('changelog')
  .description('Preview the changelog for the next release without making any changes')
  .option('--json', 'Output raw JSON instead of formatted markdown', false)
  .action(async (opts) => {
    try {
      const { changelogCommand } = await import('../src/index.js');
      await changelogCommand({ json: opts.json });
    } catch (err) {
      const { printError } = await import('../src/index.js');
      printError(err.message);
      process.exit(1);
    }
  });

// ─── bump ─────────────────────────────────────────────────────────────────────

program
  .command('bump')
  .description('Bump the version in package.json without creating a tag or commit')
  .option('--dry-run', 'Show what the next version would be without writing it', false)
  .option('--force <type>', 'Override bump type: major | minor | patch')
  .action(async (opts) => {
    try {
      const { bumpCommand } = await import('../src/index.js');
      await bumpCommand({
        dryRun: opts.dryRun,
        force: opts.force || null,
      });
    } catch (err) {
      const { printError } = await import('../src/index.js');
      printError(err.message);
      process.exit(1);
    }
  });

// ─── check ────────────────────────────────────────────────────────────────────

program
  .command('check')
  .description('Check if the repo is ready for a release (clean working tree, on main/master)')
  .action(async () => {
    try {
      const { checkCommand } = await import('../src/index.js');
      const ready = await checkCommand();
      if (!ready) process.exit(1);
    } catch (err) {
      const { printError } = await import('../src/index.js');
      printError(err.message);
      process.exit(1);
    }
  });

program.parse();
