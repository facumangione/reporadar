# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-06-02

### Added
- Project scaffolding: monorepo with client/, server/, docs/
- FastAPI backend with GitHub REST API v3 integration
- Search endpoint with filters: language, stars, license, last activity
- Redis cache with graceful fallback when unavailable
- Pydantic models for repository data validation
- React frontend with Vite, TypeScript, and Tailwind CSS
- Search bar with query input
- Filter bar: language, star range, activity, license
- Repository card grid with stats and topics
- Zustand store for search state management
- Pagination support
