# Teacher Q&A Community Feature Explanation

This document explains the step-by-step flow of how a student's question reaches the Teacher's Q&A community in the LearnBridge platform, and how the entire system communicates.

## 1. Database Model Constraints (`qna/models.py`)

In `LearnBridge/qna/models.py`, the `Question` model has a relationship with the `Course` model:
```python
class Question(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=True, blank=True)
    # ...
```
- **Why this matters**: When a student posts a question, they have the option to select a specific course from a dropdown menu. 
- The `Course` model inherently has a `teacher` field (representing the creator of the course).
- By linking the question to a course during creation, we are indirectly linking the question to the teacher who teaches that course. Making it `null=True, blank=True` allows students to still ask general public questions that aren't tied to a specific course.

## 2. Serialization (`qna/serializers.py`)

In `LearnBridge/qna/serializers.py`, we created the `TeacherQuestionSerializer` which is tailored specifically for the teacher's React frontend.
```python
class TeacherQuestionSerializer(serializers.ModelSerializer):
    author = serializers.CharField(source="user.username", read_only=True)
    tags = AdminTagSerializer(many=True, read_only=True)
    answers_count = serializers.IntegerField(source="answers.count", read_only=True)
    course = serializers.CharField(source="course.title", read_only=True)
    upvotes = serializers.IntegerField(source="likes_count", read_only=True)

    class Meta:
        model = Question
        fields = ["id", "title", "body", "course", "author", "created_at", "answers_count", "upvotes", "tags"]
```
- **What it does**: It transforms the database query objects into JSON format for the frontend.
- **Why it is structured this way**: Your frontend `TeacherQACommunity.jsx` was looking for specific variable names to render the UI, such as `question.author` (for the student's name), `question.course` (for the actual title string of the course instead of a numerical ID), and `question.upvotes` (instead of likes_count). 
- We use the `source=` parameter to map the existing backend fields (`user.username`, `likes_count`) seamlessly to match what the frontend expects without altering the actual database structure.

## 3. The API View Logic (`qna/views.py`)

In `LearnBridge/qna/views.py`, the `TeacherQuestionListView` handles fetching the exact data the teacher needs.
```python
class TeacherQuestionListView(APIView):
    permission_classes = [IsTeacher]

    def get(self, request):
        search = request.GET.get("search", "").strip()

        # The core filtering logic
        questions = Question.objects.filter(
            status="active",
            course__teacher=request.user   # <--- The Magic Line!
        ).select_related("user", "course").prefetch_related("tags")
```
- **How it filters**: Django ORM allows querying across relationships. Double underscores `course__teacher=request.user` looks through the `Question` table, finds the related `Course`, and checks if the `teacher` column matches the currently logged-in user making the request.
- **Result**: The endpoint only returns questions that are specifically asked inside courses taught by the logged-in teacher. Questions related to other teachers' courses or general questions (where course is empty) are safely ignored.

The second view, `TeacherAnswerCreateView`, handles allowing a teacher to answer a question.
```python
        try:
            # Ensures they can only answer a question on THEIR course!
            question = Question.objects.get(pk=pk, course__teacher=request.user)
        except Question.DoesNotExist:
            return Response({"error": "Question not found or unauthorized"}, status=404)
```

## 4. URL Routing (`qna/urls.py`)

In `LearnBridge/qna/urls.py`, we exposed the API endpoints to the web:
```python
    path('teacher/questions/', TeacherQuestionListView.as_view()),
    path('teacher/answer/<int:pk>/', TeacherAnswerCreateView.as_view()),
```
- Using your main URL config (`LearnBridge/urls.py`), these are prefixed with `/api/qna/`.
- So when the frontend calls `/api/qna/teacher/questions/`, Django catches it and hands it to the `TeacherQuestionListView`.

## 5. Frontend Integration (`TeacherQACommunity.jsx`)

On the frontend, when the Teacher navigates to the Q&A page, here is exactly what happens:
1. **Fetching**: `useEffect(() => { fetchTeacherQuestions() }, [])` runs as soon as the component mounts.
2. **API Call**: `fetchTeacherQuestions()` makes an Axios GET request to `/api/qna/teacher/questions/`.
3. **State Update**: The response JSON (formatted beautifully by our Serializer with properties like `author` and `upvotes`) is stored into the React `questions` state variable array.
4. **Data Splitting**: The UI dynamically filters the total `questions` array into two lists for the tabs:
   - `unansweredQuestions` (where `answers_count === 0`) 
   - `answeredQuestions` (where `answers_count > 0`).
5. **Replying**: When a teacher clicks "Answer Question" and types a response, an Axios POST request is sent to `/api/qna/teacher/answer/<question_id>/`, passing the answer text. The backend associates it with the teacher and the question, completes the response, and the frontend re-runs `fetchTeacherQuestions()` to instantly refresh the interface and move the question into the "Answered" tab.

### Summary
1. Student asks question about "Python Basics" course.
2. Database links the question to "Python Basics" and indirectly to "Teacher A".
3. Teacher A visits portal. API fetches only questions linked to Teacher A.
4. Serializer formats the data properly for React.
5. Teacher A answers, API creates the answer object, UI refreshes.
