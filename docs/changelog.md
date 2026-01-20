# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2026-01-19

### Features

- **Wishlist Module:** 
  - Updated `WishlistRepository` in the API to support new functionality.
  - Refined the Wishlist UI in the Webapp (`wishlist/page.tsx`) for better user experience.
  - Added stricter typing with `wishlist.types.ts`.

- **DevOps & Automation:**
  - Integrated `Husky` for pre-commit hooks.
  - Added `Commitlint` to enforce Conventional Commits.
  - Set up `standard-version` for automated semantic versioning.
  - Configured `Jest` for backend testing.

- **Docker:**
  - Refined Docker Compose setup for development and production environments.

### Fixes

- **Admin Dashboard:** Adjusted text colors to improve visibility in dark mode.
