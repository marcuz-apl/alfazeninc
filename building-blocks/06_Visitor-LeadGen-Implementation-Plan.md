# Visitor Lead Generation Implementation Plan

This plan details the architecture for adding a **Newsletter / Lead Capture system** to the website, giving visitors an interactivity point without the heavy friction of creating passwords or managing accounts.

## User Review Required

> [!TIP]
> We will place the Newsletter Subscribe form inside the public **Footer** (as this is the most universally expected place for it), and we will display the collected emails inside the existing **Inbox** tab in the CMS Dashboard.

## Proposed Changes

### Database Changes
#### [MODIFY] [db.ts](file:///root/projects/alfazeninc-agy/src/lib/db.ts)
- Add a new initialization block for `CREATE TABLE IF NOT EXISTS subscribers`.
- Fields: `id`, `email`, `status` (active/unsubscribed), `created_at`.

### Backend API Routes
#### [NEW] [route.ts](file:///root/projects/alfazeninc-agy/src/app/api/subscribe/route.ts)
- Public API endpoint handling `POST` requests.
- Accepts an email address, validates the format, and safely inserts it into the `subscribers` table. Handles duplicates gracefully.

#### [NEW] [route.ts](file:///root/projects/alfazeninc-agy/src/app/api/admin/subscribers/route.ts)
- Authenticated admin endpoint to retrieve the list of subscribers.
- Allows the admin to delete subscribers from the list.

### Frontend UI Updates
#### [MODIFY] [Footer.tsx](file:///root/projects/alfazeninc-agy/src/components/Footer.tsx)
- Embed a sleek, minimally-styled email input and "Subscribe" button into the footer layout.
- Add success/error state handling when a user submits their email.

#### [MODIFY] [page.tsx](file:///root/projects/alfazeninc-agy/src/app/admin/page.tsx)
- Refactor the existing "Inbox" tab UI.
- Instead of just displaying "Contact Messages", the Inbox will now feature two sections: 
  1. **Direct Inquiries:** The existing contact form messages.
  2. **Subscriber List:** A new table displaying captured leads, their subscription dates, and a delete button.
- Add fetching logic to load subscribers on mount.

## Verification Plan
1. Check the live Footer to ensure the subscribe input box looks premium and fits the theme.
2. Submit a test email to verify the public API route correctly saves the lead.
3. Open the CMS Dashboard -> Inbox tab and verify the new email appears in the Subscriber List.
4. Verify deletion functionality in the CMS.
5. As per `AGENTS.md`, copy this plan to `./building-blocks/06_Visitor-LeadGen-Implementation-Plan.md` upon approval.
