# Admin Q&A Community Flow (Frontend to Backend)

This document explains the flow of managing the Q&A Community data within the Admin Interface, demonstrating how moderation (viewing, approving, and deleting user questions) operates between React and Django.

## 1. The Frontend (AdminQA_Community.jsx)

The `AdminQA_Community.jsx` acts as the moderation dashboard for any questions submitted by users across the platform.

**What happens here:**
1.  **State Management & Mounting:** We initialize a React state array `questions` and hook it into a `useEffect`. The component listens to two primary dependency variables: `activeTab` (either `'all'` or `'reported'`) and `searchQuery`. 
2.  **API Retrieval:** Whenever the tab changes, the component dispatches an HTTP GET request via Axios `Api.get('/qna/admin/questions/', { params: { status: activeTab } })`.
3.  **Moderation Actions:** Administrators can review listed items. Clicking **Delete** or **Approve** triggers specialized REST operations hooked directly to that question's unique database ID.

**Code snippet (`AdminQA_Community.jsx`):**
```javascript
  const fetchQuestions = async () => {
    try {
      const res = await Api.get('/qna/admin/questions/', { params: { status: activeTab } });
      setQuestions(res.data);
    } catch (err) {
      toast.error("Failed to load questions");
    }
  };

  const handleApprove = async (id) => {
    try {
      // POST mapping for 'approval' or 'restoration' of safe-status
      await Api.post(`/qna/admin/questions/${id}/action/`);
      toast.success("Question approved/kept");
      fetchQuestions(); // Refresh UI dynamically
    } catch (err) { ... }
  };
```

---

## 2. API Gateway (urls.py)

The frontend HTTP requests enter the backend router within `qna/urls.py`, which is cleanly parsed and routed appropriately. 

**Code Map (`qna/urls.py`):**
```python
urlpatterns = [
    # ...
    # admin QNA URL mappings
    path('admin/questions/', AdminQuestionListView.as_view()),
    path('admin/questions/<int:pk>/action/', AdminQuestionActionView.as_view()),
]
```

---

## 3. Data Retrieval & Serialization (views.py: AdminQuestionListView)

`AdminQuestionListView` is where the read-only fetch takes place. 

1. **Permissions Verification:** `permission_classes = [IsAdmin]` ensures that any request block without a highly-secured Admin cookie payload is aborted instantly.
2. **Querying:** Based on the `status` search parameter (`all` vs `reported`), Django filters the `Question` model database. For `'reported'` requests, it explicitly looks for `status="reported"`. For `'all'`, we exclude any `deleted` files to maintain history logs without cluttering the UI.
3. **Optimized Aggregation:** It manually constructs a lightweight JSON dictionary that explicitly matches what the frontend table is prepared to map. This handles edge data relationships like grabbing `user.username` via a foreign key relationship directly.

**Data Response Model:**
```python
data.append({
    "id": q.id,
    "question": q.title,
    "author": q.user.username,
    "answers": q.answers.count() if hasattr(q, 'answers') else 0,
    "views": q.views_count,
    "status": q.status,
    "date": q.created_at.strftime("%Y-%m-%d"),
    "reports": 1 if q.status == 'reported' else 0,
})
```

---

## 4. Execution of Moderation (views.py: AdminQuestionActionView)

This is a specific "Action" view endpoint responsible for mutative (destructive or constructive) actions on a single entity model explicitly identified by `<int:pk>`.

1. **Delete Call (DELETE HTTP Method):** 
   - Instead of physically destroying the row out of the PostgreSQL database—which breaks foreign keys attached to replies, views, or bookmarks—the moderation logic utilizes a **soft delete**.
   - `q.status = 'deleted'`
   - This hides it from the student population while maintaining relational integrity.

2. **Approve Call (POST HTTP Method):** 
   - Restores the question status strictly back to `'active'`.
   - Used heavily for restoring reported or hidden messages that the Admin deems appropriate for the platform context.

```python
class AdminQuestionActionView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        q = Question.objects.get(pk=pk)
        q.status = 'deleted'
        q.save()
        return Response({"message": "Question deleted successfully"})
            
    def post(self, request, pk):
        q = Question.objects.get(pk=pk)
        q.status = 'active'
        q.save()
        return Response({"message": "Question approved"})
```

---

## Summary
The combination of `useEffect` bindings dynamically refreshing the state via `/qna/admin/questions/` allows for a reactive internal Admin Panel. Soft deletions allow for historical platform integrity alongside strong `IsAdmin` authentication measures protecting data exposure.
