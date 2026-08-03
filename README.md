# ClaudeshortVideoGen

Two projects in this repo:

- **[`claudeshortvideos/`](./claudeshortvideos)** — the CLI-driven video-generation pipeline
  (Python tools + a Remotion/TypeScript renderer) that produces faceless short-form videos
  across three styles: 100%-animated (`make-short`), paper-collage documentary (`make-vox`),
  and AI-video-clip (`make-ai-short`). Forked from
  [hassancs91/claude-faceless-shorts-creator](https://github.com/hassancs91/claude-faceless-shorts-creator)
  (MIT licensed) and extended since.
- **[`ai-shorts-web/`](./ai-shorts-web)** — the website wrapper: log in, submit a topic, approve
  a drafted script + cost estimate, and get the finished video delivered to your Google Drive.
  Currently a first working slice — see that project's own README for status and setup.

Each subdirectory keeps its own git history (merged in via `git subtree`) and its own LICENSE.
