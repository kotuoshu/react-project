# MyShowsList

MyShowsList is a TV show diary built with React, Vite, React Router and Supabase.

## Live Demo

https://react-project-omega-gules.vercel.app/

## Installation

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and set the Supabase project URL and publishable key. The backend uses the existing `entries` table and the `likes` table defined in `supabase/likes.sql`.

```bash
npm run build
npm run preview
```

## Functional Guide

### 1. Project Overview

**Application Name:** MyShowsList  
**Application Category / Topic:** TV show diary and community catalog.

Users track TV shows they plan to watch, are watching or have completed. They can record ratings and impressions, discover other users' entries and like them.

### 2. User Access & Permissions

Guests can access the home page, catalog, entry details and public author pages. Titles, genres, statuses, ratings, impressions and like counts are public. Authenticated users can also access their personal diary, create entries and like entries. Only the author of an entry can edit or delete it. Supabase row-level security enforces ownership.

### 3. Authentication & Session Handling

On application load, AuthProvider checks the current Supabase user and subscribes to authentication changes. Registration creates an account and prompts for email confirmation when required. Login redirects to the diary or the requested private page. Logout ends the session. The Supabase client persists the session locally and restores it on refresh; AuthContext shares user and loading state.

### 4. Routing Structure

React Router provides public routes (`/`, `/catalog`, `/entries/:id`, `/users/:userId`), private routes (`/my-diary`, `/entries/create`, `/entries/:id/edit`) and guest-only routes (`/login`, `/register`). PrivateRoute and GuestRoute wrap their respective child routes using Outlet. Unauthenticated visitors to private routes are redirected to login; authenticated users cannot access guest-only routes. Unmatched URLs display a 404 page.

### 5. List → Details Flow

The catalog displays public entries ordered by creation date. Visitors can search by title and filter by viewing status. Links open `/entries/:id`; the details page reads the ID using useParams and fetches the associated record. Author links open a public list of that author's entries.

### 6. Data Source & Backend

Supabase provides hosted PostgreSQL, authentication and the data API. The application uses the Supabase JavaScript SDK. The `entries` collection stores the show information and owner ID; `likes` stores one like per user and entry.

### 7. Data Operations (CRUD)

- Create: the entry form validates input and inserts a new record with the authenticated user's ID, then navigates to the diary.
- Read: the catalog, diary, author and details pages fetch records using the Supabase SDK.
- Update: the owner opens the edit form, changes the prefilled values and saves them. The API updates the matching entry and the details page reloads the record.
- Delete: the owner confirms deletion; the API removes the matching record and the application returns to the diary.

Authenticated users can also add or remove their own likes through the API.

### 8. Forms & Validation

The application includes registration, login, creation, editing and catalog search/filter forms or controls. Email is required and uses email input validation. Passwords are required and must contain at least six characters; registration checks password confirmation. Titles must contain 2–100 characters, genre is limited to 60 characters, ratings are optional integers from 1 to 10, and impressions are limited to 500 characters. Database constraints provide additional validation.

### 9. React-Specific Techniques

Components use useState, useEffect, useContext, useParams and useNavigate. The useEntries hook fetches data on mount and when its parameters change; its cleanup prevents stale requests from updating state after unmount. AuthProvider subscribes to authentication events and unsubscribes on unmount. AuthContext shares session state and authentication actions with forms, navigation and route guards. Components are organized into pages, components, context and lib folders and styled using `src/styles.css`.

### 10. Typical User Flow

1. Browse the catalog and open a show entry.
2. Register, confirm the email if required, and log in.
3. Add a show with a viewing status and optional rating or impressions.
4. Open the diary, edit or delete an entry, or like another public entry.

### 11. Error & Edge Case Handling

Authentication errors and unsuccessful API requests are displayed in the interface. Loading indicators appear during data retrieval. Empty lists show a message, missing records show a not-found message and unauthorized editing is blocked by the application and database policies. Forms disable submission while saving.
