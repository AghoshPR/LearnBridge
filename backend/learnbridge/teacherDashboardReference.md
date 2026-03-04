# Teacher Dashboard Logic Reference

This document serves as a reference for how the Teacher Dashboard is implemented across the frontend and backend, including how data is fetched, calculated, and securely presented.

## 1. Backend Endpoint: `TeacherDashboardDetailView`
**File:** `backend/LearnBridge/teacherapp/views.py`
**URL Path:** `/api/teacher/dashboard/`

This Django REST Framework `APIView` handles assembling the core metrics required for the teacher's dashboard. It ensures that only authenticated users with the `teacher` role can access this information.

### Data Collected:
1. **Total Courses:** Counts all `Course` objects where `teacher=request.user`.
2. **Total Students (Unique):** Queries the `Enrollment` model filtering by the teacher's courses, and counts distinct users (`.values('user').distinct().count()`). It is crucial that `from studentapp.models import Enrollment` is imported to prevent 500 Internal Server Errors.
3. **Live Classes Count:** Counts all `LiveClass` objects associated with the teacher.
4. **Average Rating:** Aggregates the average rating from the `CourseReview` model for the teacher's courses (rounded to 1 decimal place).
5. **Top 3 Courses:** Annotates courses with `student_count` (using `Count('enrollments')`), orders by top enrollments, and calculates the revenue (sum of the price multiplied by each enrollment).
6. **Upcoming Live Classes:** Filters `LiveClass` instances where `start_time > timezone.now()` and returns the top 2 upcoming classes along with their registered student count.

### Expected JSON Response Body:
```json
{
    "total_courses": 12,
    "total_students": 250,
    "live_classes_count": 5,
    "avg_rating": 4.8,
    "top_courses": [
        {
            "id": 1,
            "title": "React Masterclass",
            "student_count": 120,
            "revenue": 50000.0,
            "rating": 4.9
        }
    ],
    "upcoming_classes": [
        {
            "id": 5,
            "title": "State Management Live Q&A",
            "start_time": "2026-03-05T10:00:00Z",
            "registered_count": 30
        }
    ]
}
```

---

## 2. Frontend Implementation: `TeacherDashBoard.jsx`
**File:** `frontend/src/Pages/Teacher/TeacherDashBoard.jsx`

The Dashboard utilizes React `useState` and `useEffect` hooks to retrieve and map the live statistics over the static placeholder data.

### Logic Flow:
1. **State Initialization:** `dashboardData` is initialized with default empty sets (0, empty arrays) to prevent mapping issues during the initial render. `isLoading` is set to `true`.
2. **API Request (useEffect):** On component mount, the component leverages the internal `Api.js` instance to call `Api.get('/teacher/dashboard/')`.
3. **Spinner Implementation:** While data is resolving, an `isLoading` check displays a dynamic loading spinner. This was implemented so the screen doesn't just show `0` or blank arrays off the bat.
4. **Data Mapping:**
    - General Stats overlay the dynamic properties: `dashboardData.total_courses`, `dashboardData.total_students`, etc. into the generic `stats` map.
    - Top Courses mapped mapping elements like `<p>₹{course.revenue}</p>` and `<Star/> {course.rating}` values.
    - Upcoming Classes formats ISO timestamp elements elegantly with `{new Date(cls.start_time).toLocaleString()}`.
5. **UI Improvements:** Sidebar quick actions feature standard `navigate()` routing methods via React Router DOM. All clickable action items like "Create New Course" or "Manage" are supplemented with the `cursor-pointer` utility class logic for best UX practices.
