# Source review — release-pilot

## Revision and method

Inspected public commit: [`4eb3de7fef7d82c4f68c875d81628fa75779bb0a`](https://github.com/NickCirv/release-pilot/commit/4eb3de7fef7d82c4f68c875d81628fa75779bb0a). Source tree: `f71ca7ec3514be7a7000250036a61b3dd7b74738`. Capture scope: all eligible text files; 13 of 13 eligible files.

This review read captured implementation and documentation. It did not install dependencies, execute project commands, call project APIs, check package publication or establish live CI status. Examples are source-derived, not captured execution transcripts.

## Claim ledger

| Claim | Evidence | Status |
| --- | --- | --- |
| CLI preview commands | [bin/pilot.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/bin/pilot.js) | Verified in inspected source; execution unverified |
| Write/commit/tag sequence without readiness invocation | [src/releaser.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/releaser.js) | Verified in inspected source; execution unverified |
| Hard-coded changelog URLs | [src/changelog.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/changelog.js) | Verified in inspected source; execution unverified |
| Tag-only push behavior | [src/tagger.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/tagger.js) | Verified in inspected source; execution unverified |

## Findings and verification gaps

The release path does not automatically invoke the separate readiness check. Generated changelog comparison links are hard-coded to NickCirv/release-pilot and need correction when used elsewhere. Package-lock version synchronization, package publication and release rollback are not implemented by this flow. A pushed tag is not evidence of a published npm package.

The captured smoke test only asks Node to syntax-check the entrypoint. It does not exercise behavior, integrations or failure paths. Neither that test nor installation was run in this review.

| Dimension | Result |
| --- | --- |
| Purpose and documented commands | Partially verified: static source inspection |
| Clean installation and examples | Unverified |
| Test suite and live CI | Unverified |
| Performance and security guarantees | Unverified |
| Publication | Local documentation only |

## Documentation inventory

- [README.md](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/README.md) — Rewritten; historic section anchors retained where practical.
- [LICENSE](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/LICENSE) — protected document preserved unchanged.

## Captured source inventory

- [LICENSE](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/LICENSE) — Git blob `05b804beeec7d1a6c933d087387ba4adf6463d93`.
- [README.md](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/README.md) — Git blob `43d7b0fac69504119272696c6531505e6523a2e8`.
- [package.json](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/package.json) — Git blob `b5856c8e0c3ad18dc5c2e87265805d2af759b86f`.
- [.github/workflows/ci.yml](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/.github/workflows/ci.yml) — Git blob `44515034a394670de44454a7a1bd2c7ef0c9836e`.
- [bin/pilot.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/bin/pilot.js) — Git blob `9c098e1fec53f6680fdabee63f3141f5c1427039`.
- [src/bumper.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/bumper.js) — Git blob `4d82715d1c48909af22d34d3f0d80a8a3a71edb6`.
- [src/changelog.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/changelog.js) — Git blob `f9c21da8fe52030fae8f4b2d706fb95b0528a720`.
- [src/formatter.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/formatter.js) — Git blob `e18449f27517117b818ff2be9dde40d9773d7977`.
- [src/index.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/index.js) — Git blob `8276cff3fc32690f9103c160d927a6288d881ff8`.
- [src/parser.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/parser.js) — Git blob `842356dfd826dbfef49370eaaa7203119ec8df17`.
- [src/releaser.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/releaser.js) — Git blob `12c7b4665fa3a2d81746e07b13e12e88e37bf2c2`.
- [src/tagger.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/src/tagger.js) — Git blob `a0af3458d5ffdc640c7d448e8c76b77e948f132e`.
- [test/smoke.test.js](https://github.com/NickCirv/release-pilot/blob/4eb3de7fef7d82c4f68c875d81628fa75779bb0a/test/smoke.test.js) — Git blob `3b508fe56e85e6d6e5be2010f382c9f8787058d5`.

## Scope boundary

Capture excludes lockfiles, binary artwork, generated output, vendored dependencies and files above the acquisition size limit. The tree records their existence; no verification claim is made for omitted content. Protected documents and historical records are not replaced.

## Reference coverage

Added [command reference](REFERENCE.md) from the argument parser, command handlers and source-defined help at the pinned revision. README examples remain unexecuted.
