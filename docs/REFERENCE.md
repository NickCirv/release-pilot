# Command reference

Use `node bin/pilot.js` from the pinned source checkout described in the [README](../README.md). The entries below describe the inspected implementation.

| Command or argument | Behavior |
| --- | --- |
| `release` | Infer a version, update package metadata/changelog, create a commit and tag, then push the tag unless disabled. |
| `release --dry-run` | Preview the release actions without applying them. |
| `--force TYPE` | Override the inferred bump with major, minor or patch for release/bump. |
| `release --no-push` | Retain local release mutations but skip the remote tag push. |
| `changelog` | Print generated changelog text. |
| `changelog --json` | Print the underlying changelog data. |
| `bump` | Update the version in package.json. |
| `bump --dry-run` | Print the proposed version without writing. |
| `check` | Run readiness checks separately; release does not invoke this command automatically. |

For prerequisites, file writes, external services and known limitations, see [Behavior and limits](../README.md#behavior-and-limits).

Implementation: [bin/pilot.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/bin/pilot.js), [src/releaser.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/releaser.js), [src/changelog.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/changelog.js), [src/tagger.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/tagger.js); [review evidence](RESEARCH.md).
