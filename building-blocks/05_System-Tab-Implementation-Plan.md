# System Information Tab Implementation Plan

This plan details the addition of a new "System" tab inside the CMS Dashboard to display real-time server information, including CPU, Memory, OS version, Node environment, and GPU availability.

## User Review Required

> [!WARNING]
> Because this Next.js project may be deployed to a standard Node.js server, Docker container, or serverless environment (like Vercel), GPU detection is highly dependent on the host. In isolated cloud containers, GPU access is usually restricted or non-existent unless explicitly configured.
>
> I will build the backend to safely attempt detection, but if no GPU is found, it will gracefully fallback to displaying "Not Detected / N/A".

## Proposed Changes

### Backend API (Server Metrics)

#### [NEW] [route.ts](file:///root/projects/alfazeninc-agy/src/app/api/admin/system/route.ts)
Create a new authenticated API endpoint that utilizes the native Node.js `os` and `child_process` modules to fetch:
- **OS:** Platform, Release, Arch, Uptime
- **CPU:** Model, Core Count, Load Averages
- **Memory:** Total Memory, Free Memory, Usage Percentage
- **Environment:** Node.js version
- **GPU:** Safe execution of shell checks (if applicable on the host OS), gracefully falling back to "Virtual Environment / N/A".

### Admin UI Components

#### [MODIFY] [page.tsx](file:///root/projects/alfazeninc-agy/src/app/admin/page.tsx)
- Add `'system'` to the `activeTab` state type and the rendered navigation tabs array, placing it at the very right corner.
- Render the `<SystemTab />` component when active.

#### [NEW] [SystemTab.tsx](file:///root/projects/alfazeninc-agy/src/app/admin/components/SystemTab.tsx)
Create a dedicated React component to fetch and display the data beautifully.
- We will use existing UI components (`admin-stat-card`, `card`) to match the CMS aesthetic.
- Include auto-refresh functionality or a manual "Refresh Metrics" button to see memory and CPU load changes in real-time.

## Verification Plan
1. Ensure the new Tab appears on the far right of the navigation row.
2. Click the Tab and verify the API correctly returns server metrics without crashing.
3. Validate that the UI accurately displays percentages (e.g., Memory Usage) using visual progress bars or clean metric cards.
4. Per `AGENTS.md` guidelines, I will also copy this Implementation Plan into the `./building-blocks/05_System-Tab-Implementation-Plan.md` directory for historical archiving.
