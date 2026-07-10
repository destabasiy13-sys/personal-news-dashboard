# Personal News Dashboard — Project Overview

## Purpose

Personal News Dashboard is a full-stack news aggregator: it pulls headlines from multiple outlets into a single searchable, filterable feed, and lets registered users save articles to read later. It's built as a portfolio project demonstrating a complete request lifecycle — a background job that fetches and normalizes third-party data, a relational schema built around that data, session-based auth, and a public-facing analytics page — rather than a purely CRUD-driven demo.

## Problem

Following news across multiple outlets means checking several sites individually, each with its own layout, ads, and pace of updates. There's no single place to scan headlines from a curated set of trusted sources side by side, search across all of them at once, or keep a personal reading list without relying on a third-party aggregator's account.

## Solution

The backend periodically fetches top headlines from five sources (BBC News, Al Jazeera English, Associated Press, Independent, The Times of India) via a third-party news API and caches them in a local database, deduplicated by article URL. The frontend presents this cached feed with search, per-source filtering, and pagination. Registered users can save articles to a personal reading list and revisit them later; a public stats page surfaces aggregate numbers (article counts by source, most-saved articles) without requiring an account.

## Core Features

**Authentication**
- Register, login, logout
- Email verification on registration (non-blocking — verification status doesn't gate access to the app)
- Persistent, database-backed sessions

**News Feed**
- Headlines cached from 5 sources via a scheduled background job (refreshed automatically on an interval, plus an on-demand manual refresh)
- Search by keyword, filter by source, pagination
- Deduplication by article URL

**Saved Articles**
- Authenticated users can save/unsave articles from the feed
- Dedicated "Saved Articles" page listing everything a user has kept

**Stats**
- Public page showing article counts per source and the most-saved articles site-wide — no login required

**Settings & UX**
- Account settings page
- Dark mode toggle
- Responsive, mobile-friendly layout

## Security

- Passwords are hashed before storage
- Sessions are database-backed rather than in-memory, so they survive a server restart
- Saved articles and account data are scoped to the authenticated user — one user cannot read or modify another's saved list
- Email verification uses a random, expiring token rather than a predictable value

## Technical Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js, Express |
| Database | MySQL (`mysql2`) |
| Auth | express-session with a MySQL-backed store, bcrypt |
| Scheduled jobs | node-cron |
| Email | Nodemailer |

## Scope

This is a focused portfolio project, not a production news product. It's scoped to demonstrate:

- Integrating and normalizing data from a third-party API on a recurring schedule
- Relational schema design around externally-sourced, deduplicated data
- Full authentication with persistent sessions and email verification
- Search, filtering, and pagination over a live dataset
- A public, unauthenticated analytics endpoint alongside authenticated user-specific routes
- Practical security fundamentals: password hashing, per-user data isolation, non-blocking handling of external service calls (email delivery) so a slow or unavailable third party can't degrade the core user experience
