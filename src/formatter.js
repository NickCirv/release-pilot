/**
 * formatter.js — Chalk-powered terminal output helpers
 */

import chalk from 'chalk';

// Brand accent
const accent = chalk.hex('#3B82F6');
const accentBold = chalk.hex('#3B82F6').bold;

// ─── Symbols ────────────────────────────────────────────────────────────────

export const sym = {
  check:   chalk.green('✔'),
  cross:   chalk.red('✘'),
  arrow:   accent('→'),
  bullet:  chalk.gray('·'),
  warn:    chalk.yellow('⚠'),
  tag:     chalk.cyan('⌘'),
  rocket:  '🚀',
  skip:    chalk.gray('(skipped)'),
};

// ─── Section headers ─────────────────────────────────────────────────────────

export function header(text) {
  const bar = '─'.repeat(50);
  console.log('');
  console.log(accentBold(bar));
  console.log(accentBold(`  ${text}`));
  console.log(accentBold(bar));
  console.log('');
}

export function subheader(text) {
  console.log('');
  console.log(chalk.bold.underline(text));
  console.log('');
}

// ─── Changelog preview ───────────────────────────────────────────────────────

export function printChangelog(changelogText) {
  subheader('Changelog Preview');
  const lines = changelogText.split('\n');
  for (const line of lines) {
    if (line.startsWith('## ')) {
      console.log(accentBold(line));
    } else if (line.startsWith('### ')) {
      console.log(chalk.cyan.bold(line));
    } else if (line.startsWith('- ')) {
      const formatted = line.replace(/^\- /, `  ${sym.bullet} `);
      console.log(chalk.white(formatted));
    } else if (line.startsWith('[')) {
      console.log(chalk.gray(line));
    } else {
      console.log(line);
    }
  }
}

// ─── Version bump visualization ──────────────────────────────────────────────

export function printVersionBump(current, next, bumpType) {
  subheader('Version Bump');

  const bumpColor = {
    major: chalk.red.bold,
    minor: chalk.yellow.bold,
    patch: chalk.green.bold,
  }[bumpType] || chalk.white.bold;

  console.log(
    `  ${chalk.gray(current)}  ${sym.arrow}  ${accentBold(next)}  ${bumpColor(`(${bumpType})`)}`
  );
  console.log('');
}

// ─── Bump type reason summary ────────────────────────────────────────────────

export function printBumpReason(commits) {
  const breaking = commits.filter(c => c.breaking).length;
  const feats = commits.filter(c => c.type === 'feat').length;
  const fixes = commits.filter(c => c.type === 'fix').length;

  console.log(`  ${sym.bullet} ${chalk.white(`${commits.length} commits analysed`)}`);
  if (breaking > 0) console.log(`  ${sym.bullet} ${chalk.red.bold(`${breaking} breaking change(s)`)}`);
  if (feats > 0)    console.log(`  ${sym.bullet} ${chalk.yellow(`${feats} new feature(s)`)}`);
  if (fixes > 0)    console.log(`  ${sym.bullet} ${chalk.green(`${fixes} bug fix(es)`)}`);
  console.log('');
}

// ─── Tag confirmation ─────────────────────────────────────────────────────────

export function printTagCreated(tagName, pushed) {
  subheader('Git Tag');
  console.log(`  ${sym.check}  Tag created: ${accentBold(tagName)}`);
  if (pushed) {
    console.log(`  ${sym.check}  Pushed to remote`);
  } else {
    console.log(`  ${sym.warn}  Remote not configured — tag not pushed`);
  }
  console.log('');
}

// ─── Dry-run indicators ───────────────────────────────────────────────────────

export function printDryRunBanner() {
  console.log('');
  console.log(chalk.yellow.bold('  ┌─────────────────────────────────────┐'));
  console.log(chalk.yellow.bold('  │        DRY RUN — no changes made    │'));
  console.log(chalk.yellow.bold('  └─────────────────────────────────────┘'));
  console.log('');
}

export function printDryRunStep(label, value) {
  console.log(`  ${sym.skip}  ${chalk.gray(label + ':')}  ${chalk.white(value)}`);
}

// ─── Release summary ──────────────────────────────────────────────────────────

export function printReleaseSummary({ version, tag, changelogLines, dryRun }) {
  header(`${sym.rocket}  Release ${version}`);

  if (dryRun) printDryRunBanner();

  console.log(`  ${sym.check}  Changelog generated   ${chalk.gray(`(${changelogLines} lines)`)}`);
  console.log(`  ${sym.check}  package.json bumped   ${accentBold('→ ' + version)}`);
  console.log(`  ${sym.check}  Git commit created`);
  console.log(`  ${sym.check}  Tag created           ${accentBold(tag)}`);
  console.log('');

  if (!dryRun) {
    console.log(accent('  All done. Ship it. 🚀'));
  }
  console.log('');
}

// ─── Error output ─────────────────────────────────────────────────────────────

export function printError(msg) {
  console.error(`\n  ${sym.cross}  ${chalk.red.bold('Error:')} ${chalk.red(msg)}\n`);
}

// ─── Info line ────────────────────────────────────────────────────────────────

export function info(msg) {
  console.log(`  ${sym.arrow}  ${chalk.white(msg)}`);
}
