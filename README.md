![release-pilot — Nicholas Ashkar editorial artwork](assets/nicholas-ashkar/banner.png)

# release-pilot

Draft and apply a conventional-commit release sequence for a local Git repository.

Computes a version bump, prepares a changelog and can commit/tag the release. Start with preview commands to inspect the proposed changes.


<a id="install"></a>

## Quickstart

Package runtime requirement: Node.js `>=20`. Git is needed to obtain this pinned source checkout.

```bash
git clone https://github.com/NickCirv/release-pilot.git
cd release-pilot
git checkout 4eb3de7fef7d82c4f68c875d81628fa75779bb0a
npm install --ignore-scripts
node bin/pilot.js changelog
```

This source-derived example has not been executed in this review. The command previews the next changelog without writing release files. Run it from the repository being released.




<a id="commands"></a>

<a id="flags"></a>

<a id="how-it-works"></a>

## Usage

```bash
node /path/to/release-pilot/bin/pilot.js release --dry-run
node /path/to/release-pilot/bin/pilot.js bump --dry-run --force patch
node /path/to/release-pilot/bin/pilot.js check
```

A real `release` modifies package.json and CHANGELOG.md, commits, creates an annotated tag and pushes that tag by default. `--no-push` suppresses the remote tag push.

[Command reference](docs/REFERENCE.md) covers arguments, modes and output controls.



<a id="why-not-x"></a>

<a id="what-it-is-not"></a>

## Behavior and limits

The release path does not automatically invoke the separate readiness check. Generated changelog comparison links are hard-coded to NickCirv/release-pilot and need correction when used elsewhere. Package-lock version synchronization, package publication and release rollback are not implemented by this flow. A pushed tag is not evidence of a published npm package.

## Development

Declared package scripts:

| Script | Command |
| --- | --- |
| `start` | `node ./bin/pilot.js` |
| `lint` | `node --check src/*.js bin/pilot.js` |
| `test` | `node --test` |

The smoke test syntax-checks the entrypoint; it does not exercise CLI behavior or integrations.

## Research

[Source review and claim ledger](docs/RESEARCH.md) records revision `4eb3de7fef7d`, inspected files and verification gaps.

## License and attribution

Protected license and attribution files remain unchanged: [LICENSE](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/LICENSE).

[Artwork credits](assets/nicholas-ashkar/CREDITS.md) · [Nicholas Ashkar — consulting](https://nicholashkar.com/#oxblood-contact)
