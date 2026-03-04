# Admin Page Pagination & Search Implementation

This document explains how pagination and search filtering were successfully implemented across the remaining LearnBridge admin pages (`AdminTags.jsx`, `AdminCoupon.jsx`, `AdminOffer.jsx`, `AdminWallet.jsx`, and `AdminTeachers.jsx`).

## Objective
The goal was to provide a consistent user experience for administrators when navigating large lists of data. While larger and more complex datasets (like `AdminCourses`, `AdminUsers`, and `AdminCategories`) rely on server-side pagination (API endpoints with `?page=` and `?search=` parameters), we used **client-side pagination and filtering** for the remaining modules, as they typically handle smaller datasets where performance overhead is minimal, aligning with prior design decisions.

## 1. State Management
For each targeted page, additional React states were introduced to manage the current view and user input:

```javascript
// Example from AdminCoupon.jsx
const [searchQuery, setSearchQuery] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
```

## 2. Dynamic Search Filtering
Before the data is paginated, it is filtered based on the `searchQuery`. All strings are converted to lowercase to ensure case-insensitive matching. In some components, the search spans multiple fields.

**Code Snippet (`AdminOffer.jsx`):**
```javascript
const filteredOffers = offers.filter(offer =>
  (offer.title && offer.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (categories.find(c => Number(c.id) === Number(offer.category))?.name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
  (courses.find(c => Number(c.id) === Number(offer.course))?.title?.toLowerCase().includes(searchQuery.toLowerCase()))
);
```

Whenever the `searchQuery` changes (via the input field's `onChange` event handler), `setCurrentPage(1)` is additionally called to reset the user's view back to the first page of the new search results, preventing them from being stranded on an empty page.

## 3. Client-Side Pagination Logic
Once the dataset is filtered, it is sliced to only display the subset of items meant for the `currentPage`.

**Code Snippet:**
```javascript
const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentOffers = filteredOffers.slice(indexOfFirstItem, indexOfLastItem);
```
The table map functions iterating over the original state (e.g., `offers.map()`) were updated to iterate over the paginated subset (e.g., `currentOffers.map()`).

## 4. UI Adjustments
1. **Search Input:** A visually consistent Search bar (utilizing the `Search` icon from `lucide-react`) was embedded in the header of each page, adjacent to the "Add" action buttons.
2. **Pagination Controls:** A flexible pagination control bar is rendered below the tables (provided `totalPages > 0`). It includes "Prev" and "Next" buttons with dynamic `disabled` states, as well as numbered page buttons mapped directly to the `totalPages` variable.

## 5. Specific Page Adaptations
- **`AdminTeachers.jsx`**: Features two distinct tables ("Pending Approvals" and "Approved Teachers"). Independent pagination states (`currentPagePending` and `currentPageApproved`) were implemented so the user can navigate each list asynchronously without affecting the other.
- **`AdminTags.jsx`**, **`AdminWallet.jsx`**, **`AdminCoupon.jsx`**: Single-table implementations followed the exact standard structure. All tables display a friendly "No items found" message if the `searchQuery` yields zero results.
