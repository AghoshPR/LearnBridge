# Course Completion Flow (Frontend to Backend)

This document explains the flow of a student marking a course as completed from the React frontend to the Django backend, and how this state interacts with the user's profile and courses list.

## 1. The Frontend (CourseVideos.jsx)

The journey starts in the `CourseVideos.jsx` component on the frontend when a student is watching a course.

**What happens here:**
1.  **Mounting / State Initialization:** When the component loads, the `useEffect` hook triggers an `Api.get()` request to fetch the student's current enrollment status for the active course. The state variable `courseStatus` initializes from this call (resolving to `"in_progress"` or `"completed"`).
2.  **User Interacts:** The user clicks the **"Mark as Completed"** (or **"Completed"**) toggle button located right above the Course Playlist.
3.  **API Toggle Request:** The `toggleCourseStatus` function fires. This triggers an `Api.post()` request to the backend without any body, purely indicating that the user wants to toggle their enrollment status for the active `courseId`.
4.  **UI Updates:** The backend toggles the database state and responds with the new status (e.g., `"completed"`). The React state `courseStatus` updates immediately, changing the toggle's styling to a green completed badge, and a success toast notification appears.

**Code Snippet (`CourseVideos.jsx`):**
```javascript
const [courseStatus, setCourseStatus] = useState("in_progress");

useEffect(() => {
    // 1. Fetch initial status on load
    Api.get(`/student/courses/${courseId}/status/`)
      .then(res => setCourseStatus(res.data.status));
}, [courseId]);

const toggleCourseStatus = async () => {
    // 2. Fire structural change to API
    const res = await Api.post(`/student/courses/${courseId}/status/`);
    
    // 3. Update React frontend actively
    setCourseStatus(res.data.status);
    if (res.data.status === 'completed') {
        toast.success("Course marked as completed! 🎉");
    } else {
        toast.success("Course marked as in progress.");
    }
}
```

---

## 2. The API Gateway (Django URLs)

The fetch request from the frontend hits the Django server in `studentapp/urls.py`.

**What happens here:**
The router identifies the HTTP method (GET or POST) matching `/api/student/courses/<course_id>/status/` and forwards it to `CourseEnrollmentStatusView`.

**Code Snippet (`studentapp/urls.py`):**
```python
urlpatterns = [
    # ...
    path("courses/<int:course_id>/status/", CourseEnrollmentStatusView.as_view()),
]
```

---

## 3. The Backend Controller (Django Views)

The request hits `CourseEnrollmentStatusView` inside `studentapp/views.py`.

**What happens here:**
1.  **Authentication:** `permission_classes = [IsAuthenticated]` guarantees that only verified students can modify or view enrollment states.
2.  **Verify Enrollment:** `Enrollment.objects.get(user=request.user, course_id=course_id)` finds the exact relational map tying the user and the course. If it's not found, it fails with a 404.
3.  **Toggle Logic (POST):** Depending on the active state, `enrollment.status` is flipped between `"completed"` and `"in_progress"`.
4.  **Save & Response:** `enrollment.save()` commits the data to the PostgreSQL database, and it immediately returns the updated string so the frontend remains in sync.

**Code Snippet (`studentapp/views.py`):**
```python
class CourseEnrollmentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        # Fetch current status
        enrollment = Enrollment.objects.get(user=request.user, course_id=course_id)
        return Response({"status": enrollment.status})

    def post(self, request, course_id):
        # Toggle completion flag
        enrollment = Enrollment.objects.get(user=request.user, course_id=course_id)
        if enrollment.status == "in_progress":
            enrollment.status = "completed"
        else:
            enrollment.status = "in_progress"
            
        enrollment.save()
        return Response({"status": enrollment.status})
```

---

## 4. Reflecting Changes in Models & Profile (MyCourses.jsx & StudentProfile.jsx)

Because the change has been properly committed to the database layer, any subsequent components reflecting database states update automatically:

**A. My Courses (`MyCourses.jsx`)**
`MyCourseView` (which queries all student enrollments) blindly queries the `Enrollment` model. The frontend immediately reflects the modified `status` field for this course, moving its tag dynamically to "Completed".

**B. Student Profile (`StudentProfile.jsx`)**
On the Student Profile dashboard, we upgraded the API mapping (`StudentProfile` View) to dynamically calculate `Enrollment` statistics using Django's highly optimized `.count()` operator. 

When a user visits `StudentProfile.jsx`, React hits the backend profile endpoint, which dynamically computes:
```python
# From `views.py` (StudentProfile GET representation)
total_enrolled = Enrollment.objects.filter(user=user).count()
completed = Enrollment.objects.filter(user=user, status='completed').count()
in_progress = Enrollment.objects.filter(user=user, status='in_progress').count()
```

This returns a `stats` dictionary. The React UI maps these objects into the Statistics Cards:
*   Enrolled Courses
*   Completed (Increments by +1)
*   In Progress (Decrements by -1)

**Result:** A fully synchronous architectural flow ensuring data integrity between the Video Player, the Database, the "My Courses" layout, and the Student Profile Metrics!
