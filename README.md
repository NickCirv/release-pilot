<p align="center">
  <img src="banner.svg" width="600" />
</p>

<h1 align="center">release-pilot</h1>
<p align="center"><strong>Stop writing changelogs. Start shipping.</strong></p>

<p align="center">
  <a href="#install"><img src="https://img.shields.io/badge/npx-release--pilot-blue?style=flat-square" alt="npx" /></a>
  <img src="https://img.shields.io/badge/zero%20config-✓-green?style=flat-square" alt="zero config" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square" alt="node" />
  <img src="https://img.shields.io/github/license/NickCirv/release-pilot?style=flat-square" alt="license" />
</p>

<p align="center">
  <em>One command. Changelog generated. Version bumped. Tag pushed. Done.</em>
</p>

---

## The problem

You just merged 47 commits. Now you need a changelog, a version bump, a git tag, and somehow you need to remember what "fix: stuff" meant 3 weeks ago. release-pilot reads your conventional commits and does it all in one shot.

## Install

```bash
npx release-pilot check    # ready?
npx release-pilot release  # ship it
```

No global install required. No config file. No CI pipeline. Just `npx` and go.

---

## See it in action

```
$ npx release-pilot check

──────────────────────────────────────────────────
  release-pilot
──────────────────────────────────────────────────

  ✔  Working tree is clean
  ✔  On branch: main
  ✔  Remote "origin" is configured

  🚀  Ready to release.
```

```
$ npx release-pilot release --dry-run

──────────────────────────────────────────────────
  release-pilot
──────────────────────────────────────────────────

  ┌─────────────────────────────────────┐
  │        DRY RUN — no changes made    │
  └─────────────────────────────────────┘

Version Bump

  1.2.3  →  1.3.0  (minor)

  · 12 commits analysed
  · 3 new feature(s)
  · 2 bug fix(es)

Changelog Preview

## [1.3.0] - 2026-02-27

### Added
  · feat: streaming support for large file exports
  · feat: configurable retry strategy on upload failures
  · feat: dark mode preference stored in localStorage

### Fixed
  · fix: memory leak when closing WebSocket connections
  · fix: incorrect date format in weekly summary headers

  → Would write 48 lines to CHANGELOG.md
  → Would commit: chore(release): v1.3.0

Git Tag

  ✔  Tag created: v1.3.0
  ⚠  Remote not configured — tag not pushed

──────────────────────────────────────────────────
  🚀  Release 1.3.0
──────────────────────────────────────────────────

  ✔  Changelog generated   (48 lines)
  ✔  package.json bumped   → 1.3.0
  ✔  Git commit created
  ✔  Tag created           v1.3.0
```

---

## Commands

| Command | What it does |
|---------|-------------|
| `release` | Full flow: bump → changelog → commit → tag → push |
| `changelog` | Preview what the changelog would look like, no files touched |
| `bump` | Just bump the version in `package.json`, nothing else |
| `check` | Is the repo ready? Clean tree, right branch, remote configured |

### Key flags

- `--dry-run` — See everything without touching anything
- `--force major|minor|patch` — Override the auto-detected bump
- `--no-push` — Tag locally, don't push to remote

---

## How it works

1. **Reads** your git log since the last tag (`git log v1.2.3..HEAD`)
2. **Parses** conventional commits — `feat:` bumps minor, `fix:` bumps patch, `BREAKING CHANGE:` bumps major
3. **Generates** a [Keep a Changelog](https://keepachangelog.com/) formatted `CHANGELOG.md`, prepended to any existing entries
4. **Bumps** `package.json`, commits `chore(release): vX.Y.Z`, creates an annotated git tag, and pushes

Conventional commit types recognized: `feat`, `fix`, `chore`, `perf`, `refactor`, `docs`, `test`, `ci`, `build`, `style`, `revert`

Breaking changes detected via `!` suffix (e.g. `feat!: drop Node 16`) or `BREAKING CHANGE:` in the commit body.

---

## Why not X?

> **semantic-release** needs a CI environment and a mountain of config.
> **standard-version** is unmaintained and archived.
> **release-it** needs a config file and interactive prompts.
>
> release-pilot needs nothing. `npx` and go.

---

## Built by [@NickCirv](https://github.com/NickCirv) · MIT License
