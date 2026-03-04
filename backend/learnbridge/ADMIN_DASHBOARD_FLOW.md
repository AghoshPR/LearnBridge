# How the Admin Dashboard Works (Frontend to Backend)

This document explains the data flow of the Admin Dashboard, detailing how statistics and recent activity metrics are fetched from the Django backend and dynamically displayed in the React frontend.

## 1. The Frontend (React)

The journey starts in the `AdminDashboard.jsx` component inside the frontend `admin` module.

**What happens here:**
1.  **Component Mount:** When the admin navigates to the dashboard, the page initializes multiple state variables like `stats` (for numerical totals), `recentUsers` (an array of newly registered students), and `recentCourses` (an array of newly created courses) using the `useState` hook.
2.  **Trigger Data Fetching:** The `useEffect` hook fires immediately when the page renders. This prevents the page from making redundant API calls.
3.  **API Request:** Inside the `useEffect`, the frontend makes an HTTP GET request to the backend API endpoint (`/admin/dashboard-stats/`) using the custom `Api` library (Axios instance configured with authentication tokens).

**Code Snippet (`AdminDashboard.jsx`):**
```javascript
const [stats, setStats] = useState({
    total_users: 0,
    active_courses: 0,
    pending_teachers: 0,
    qna_posts: 0
});
const [recentUsers, setRecentUsers] = useState([]);
const [recentCourses, setRecentCourses] = useState([]);

useEffect(() => {
    // Make request to the backend API
    Api.get('/admin/dashboard-stats/')
        .then(res => {
            // Update UI with the returned real data
            setStats(res.data.stats);
            setRecentUsers(res.data.recent_users);
            setRecentCourses(res.data.recent_courses);
        })
        .catch(err => {
            console.error('Failed to fetch dashboard stats', err);
        });
}, []);
```

---

## 2. The API Gateway (Django URLs)

The fetch request from the frontend hits the Django server, specifically the main `LearnBridge/urls.py` file.

**What happens here:**
1.  Django looks at the requested URL path (`/api/admin/dashboard-stats/`).
2.  It matches the `/api/admin/` part and routes handling to the included `adminapp.urls`.
3.  Inside `adminapp/urls.py`, it matches the `dashboard-stats/` path and directs the request to the `AdminDashboardStatsView` view class.

**Code Snippet (`LearnBridge/urls.py` & `adminapp/urls.py`):**
```python
# LearnBridge/urls.py
urlpatterns = [
    # ... other routes
    path('api/admin/', include('adminapp.urls')), # Forwards to adminapp
]

# adminapp/urls.py
urlpatterns = [
    # ... other admin endpoints
    path("dashboard-stats/", AdminDashboardStatsView.as_view()), # Maps to the view
]
```

---

## 3. The Backend Controller (Django Views)

The request has now reached the `AdminDashboardStatsView` class in `adminapp/views.py`. This is where the core logic of collecting database metrics lives.

**What happens here:**
1.  **Authorization Check:** The view uses `permission_classes = [IsAdmin]`. Django automatically verifies that the user making the request possesses an active admin token or session. If not, the request is violently rejected (`403 Forbidden`).
2.  **Aggregate Total Counts:** The view queries the database models (`User`, `Course`, `TeacherProfile`, `Question`) using Django's `.count()` method to quickly aggregate the required top-level statistics (total students, active courses, pending approval requests, active questions).
3.  **Fetch Recent Activity:** 
    - Queries the latest 5 registered users utilizing Python slicing (`[:5]`) mapped over reverse chronological queries (`-date_joined`).
    - Queries the latest 5 courses constructed in the app.
4.  **Assemble and Return payload:** The collected objects are formatted into standard python dictionaries and packaged inside a clean `Response`. Django REST Framework (DRF) translates this response into the requested JSON string with a `200 OK` HTTP status.

**Code Snippet (`adminapp/views.py`):**
```python
class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdmin] # Protects view from unauthorized scraping

    def get(self, request):
        # 1. Gather all numerical statistics using Django ORM
        total_users = User.objects.filter(role="student", is_deleted=False).count()
        active_courses = Course.objects.filter(status="published", is_deleted=False).count()
        pending_teachers = TeacherProfile.objects.filter(status="pending").count()
        qna_posts = Question.objects.filter(status="active").count()

        # 2. Gather 5 newest students
        recent_users = User.objects.filter(role="student", is_deleted=False).order_by("-date_joined")[:5]
        recent_users_data = [
            {"id": u.id, "username": u.username, "email": u.email, "date_joined": u.date_joined} 
            for u in recent_users
        ]

        # 3. Gather 5 newest courses
        recent_courses = Course.objects.filter(is_deleted=False).order_by("-created_at")[:5]
        recent_courses_data = [
            {"id": c.id, "title": c.title, "teacher": c.teacher.username, "status": c.status, "created_at": c.created_at} 
            for c in recent_courses
        ]

        # 4. Formatter JSON payload
        return Response({
            "stats": {
                "total_users": total_users,
                "active_courses": active_courses,
                "pending_teachers": pending_teachers,
                "qna_posts": qna_posts
            },
            "recent_users": recent_users_data,
            "recent_courses": recent_courses_data
        })
```

---

## 4. Back to Frontend (The Loop Closes)

1.  The `Axios` promise in `AdminDashboard.jsx` resolves optimally. 
2.  The React `.then()` block executes.
3.  State functions (`setStats`, `setRecentUsers`, `setRecentCourses`) allocate the parsed JSON body fields to the specific frontend variables.
4.  React immediately triggers a DOM re-render.
5.  The `<StatsCard />` components swap "0" values with proper aggregated metrics.
6.  `recentUsers.map(...)` and `recentCourses.map(...)` generate and stack distinct list items detailing the new users/courses visually on the UI.
7.  The dashboard dynamically presents truthful application data.
