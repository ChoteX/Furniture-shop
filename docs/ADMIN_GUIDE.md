# Bowen Admin User Guide (MVP)

## 1. Login
1. Open `/login`.
2. Sign in with an `admin` account.
3. Open `/admin` from main navigation.

## 2. Approve or reject new accounts
1. In `Pending approvals`, review user profile request.
2. Click `Approve` or `Reject`.
3. Approved users become active immediately.

Behavior by role:
- `authorized_dealer`: full non-admin access
- `architect`: technical/material access
- `press`: press photo access

## 3. Manage news
1. In `Create News Post`, enter bilingual fields:
- `Title (KA/EN)`
- `Excerpt (KA/EN)`
- `Content (KA/EN)`
- `Category`
2. Keep `Publish immediately` checked for instant publishing.
3. Click `Save`.
4. Use `Publish/Unpublish` buttons in news list for status changes.

## 4. User list
- `Users` table shows account role and status.
- Use approvals workflow for activation; direct role edit is not part of MVP UI yet.

## 5. Operational notes
- Every approval and news admin action writes an audit log in DB.
- Email notifications are not yet implemented (tracked in TODO).
