# Teacher Dashboard & Pages - Search and Pagination Implementation Flow

This document outlines the architectural approach and implementation details for adding client-side search and pagination, as well as fixing the teacher profile page layout and statistics across the `TeacherDashboard` ecosystem.

## Objectives
1. **Teacher Profile**: 
   - Fetch real dynamic stats (Total Courses, Total Students, Average Rating) directly from the `TeacherDashboardDetailView` backend API.
   - Remove/Comment out unnecessary elements ("Bank Details" and "Students" sidebar menu link).
2. **Search and Pagination**: 
   - Add responsive and consistent search bars and client-side pagination to `TeacherCourses.jsx`, `TeacherLiveClass.jsx`, `TeacherQACommunity.jsx`, and `TeacherWallet.jsx`.
   - Remove/Comment out the "Students" sidebar menu link from all teacher pages for a unified layout.

## 1. Teacher Profile Enhancements (`TeacherProfile.jsx`)

### 1.1 Data Fetching & State
- Initialized state `statsData` to store `total_courses`, `total_students`, and `avg_rating`.
- Added a `fetchStats` asynchronous function inside the `useEffect` hook.
- Makes a `GET` request to `/teacher/dashboard/`.
- Updated the stats rendering logic to use the fetched `statsData` object instead of hardcoded numbers.

### 1.2 Layout & UI Adjustments
- Found and commented out the entire "Bank Details Section" JSX mapping in `TeacherProfile.jsx`.
- Found the "Students" route in the `sidebarItems` array and commented it out:
  ```javascript
  // { icon: Users, label: 'Students', path: '/teacher/students', active: false },
  ```

## 2. Global Codebase Sidebar Adjustments

To ensure standard navigation across all teacher panels, the "Students" sidebar link was systematically disabled in:
- `TeacherDashBoard.jsx`
- `TeacherManageCourses.jsx`
- `TeacherCourseCategory.jsx`
- `TeacherCourses.jsx`
- `TeacherLiveClass.jsx`
- `TeacherQACommunity.jsx`
- `TeacherWallet.jsx`

## 3. Client-Side Search and Pagination

We utilized a robust client-side approach for filtering data arrays on the frontend. Since these collections are scoped generally closely to a teacher's entity, loading all items initially and paginating client-side produces a snappier user experience.

### Common Implementation Strategy
1. **State Initialization**:
   - `searchQuery`: To cache the user's search text securely.
   - `currentPage`: To track the current page integer offset.
   - `itemsPerPage`: To configure limits (e.g., 5, 8, or 10 depending on the view density).
2. **Filtering Logic (`filteredItems`)**:
   - Arrays are filtered synchronously inside the render cycle. We `.filter()` through fields evaluating if they `.includes()` the `searchQuery.toLowerCase()`.
3. **Pagination Slicing**:
   - Evaluate `totalPages` using `Math.ceil(filteredItems.length / itemsPerPage)`.
   - Extract `currentItems` subset using `.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)`.
4. **UX Hooks**:
   - When a user types into the search field, we reset `currentPage` back to `1` so no empty pages are loaded unexpectedly.

### Component Breakdowns

#### `TeacherCourses.jsx`
- Filtered by course `title` and `category_name`.
- Replaced `courses.map` with `currentCourses.map`.
- Added standard pagination UI controls below the grid layout.

#### `TeacherLiveClass.jsx`
- Implemented **Dual-Type Pagination** because classes are separated into "Upcoming Classes" and "Past Classes".
- Added unique states: `currentPageUpcoming` and `currentPagePast`.
- Applied filtering across the master `classes` array by `title` and `subject`.
- Rendered separate pagination buttons beneath their respective UI wrappers.

#### `TeacherQACommunity.jsx`
- Admin Q&A has two tabs: "Unanswered" and "Answered".
- Created state properties for both pools: `currentPageUnanswered` and `currentPageAnswered`.
- Added an input text box above the tabs, applying a global filter against title, body, and course associations.
- The correct array `currentUnanswered` or `currentAnswered` is piped into UI iteration respectively based on the `activeTab`.

#### `TeacherWallet.jsx`
- Injected search bar functionality inside the Transaction History header header.
- Filtered by `transaction_id`, `purchaser`, and `description`.
- Sliced the `filteredTransactions` block correctly before injecting it gracefully back into the `<tbody>` using `currentTransactions.map`.

## Summary
By caching data to standard states and utilizing slicing algorithms dynamically alongside React hooks, we efficiently augmented the Teacher panels for data scaling. Furthermore, hiding the "Students" tab and fetching live `TeacherDashboardDetailView` statistics harmonizes the interface securely.
