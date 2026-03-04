# How the AI Assistant Works (Frontend to Backend)

This document explains the flow of a user's question from the React frontend to the Django backend, how the Google Gemini AI processes it, and how the answer is returned to the user.

## 1. The Frontend (React)

The journey starts in the `CourseVideos.jsx` component on the frontend.

**What happens here:**
1.  **User Input:** The user types a question into the text input field and clicks the send button (or presses Enter).
2.  **State Update (User Message):** The `handleAskAI` function is triggered. It immediately takes the user's input (`aiInput`) and adds it to the `aiMessages` state array as a "user" message. This makes the message appear instantly in the chat window on the screen.
3.  **Loading State:** The `aiLoading` state is set to `true`, which shows a "thinking..." indicator to let the user know the AI is working.
4.  **API Request:** The frontend makes an HTTP POST request to the backend API endpoint (`/ai/ask/`) using the custom `Api` service (Axios). It sends the user's question in the JSON body: `{ question: "User's question here" }`.

**Code Snippet (`CourseVideos.jsx`):**
```javascript
const handleAskAI  = async () => {
    if (!aiInput.trim()) return;

    const userMessage = aiInput;

    // 1. Update UI with user message immediately
    setAiMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setAiInput("");
    setAiLoading(true);

    try {
        // 2. Send request to Django backend
        const res = await Api.post("/ai/ask/", {
            question: userMessage,
        });

        // 3. Update UI with AI's response
        setAiMessages(prev => [...prev, { sender: "ai", text: res.data.answer }]);
    } catch (error) {
        // Handle potential errors
    } finally {
        setAiLoading(false);
    }
}
```

---

## 2. The API Gateway (Django URLs)

The fetch request from the frontend hits the Django server, specifically the main `LearnBridge/urls.py` file.

**What happens here:**
1.  Django looks at the requested URL path (`/api/ai/ask/`).
2.  It matches the `/api/` part and routes it to the included `ai_assistant.urls`.
3.  Inside `ai_assistant/urls.py`, it matches the `ai/ask/` path and directs the request to the `AskGeminiView` view class.

**Code Snippet (`LearnBridge/urls.py` & `ai_assistant/urls.py`):**
```python
# LearnBridge/urls.py
urlpatterns = [
    # ... other routes
    path("api/", include("ai_assistant.urls")), # Forwards to ai_assistant app
]

# ai_assistant/urls.py
urlpatterns = [
    path("ai/ask/", AskGeminiView.as_view()), # Maps to the view
]
```

---

## 3. The Backend Controller (Django Views)

The request has now reached the `AskGeminiView` class in `ai_assistant/views.py`. This is where the core logic of the API endpoint lives.

**What happens here:**
1.  **Authentication Check:** The view uses `permission_classes = [IsAuthenticated]`. Django automatically checks if the user making the request has a valid session/token. If not, it rejects the request.
2.  **Extract Data:** If authenticated, the view extracts the `question` from the request body (`request.data.get("question")`).
3.  **Validation:** It checks if a question was actually provided. If it's missing, it returns a `400 Bad Request` error.
4.  **Call Service Layer:** It passes the extracted question to a helper function called `ask_gemini` located in the `services.py` file.
5.  **Return Response:** Once `ask_gemini` returns the AI's generated textual answer, the view wraps it in a JSON response (`{"answer": answer}`) and sends it back to the React frontend with a `200 OK` status.

**Code Snippet (`ai_assistant/views.py`):**
```python
class AskGeminiView(APIView):
    permission_classes = [IsAuthenticated] # Ensures only logged-in users can ask

    def post(self, request):
        question = request.data.get("question")

        if not question:
            return Response({"error": "Question is required"}, status=400)

        try:
            # Send question to the service logic
            answer = ask_gemini(question) 
            # Return the generated answer
            return Response({"answer": answer}) 
        except Exception as e:
            return Response({"error": str(e)}, status=500)
```

---

## 4. The Service Layer (Google Gemini Integration)

The `ask_gemini` function in `ai_assistant/services.py` is responsible for communicating with Google's AI models.

**What happens here:**
1.  **Initialization:** A Gemini `Client` is initialized using the `GEMINI_API_KEY` stored securely in the Django settings (which pulls from your `.env` file).
2.  **System Prompt:** A "system prompt" is defined. This is a set of hidden instructions given to the AI *before* the user's question. It sets the persona and rules (e.g., "You are an AI programming assistant... Don't invent facts").
3.  **Generate Content:** The `client.models.generate_content()` method is called. This is the actual network request to Google's servers. It passes:
    *   The model name to use (`"gemini-2.5-flash"`).
    *   The combined text of the system prompt and the user's specific question.
4.  **Return Result:** Google processes the prompt, generates a response, and sends it back to Django. The `ask_gemini` function extracts just the text content (`response.text`) and returns it back to the View.

**Code Snippet (`ai_assistant/services.py`):**
```python
client = genai.Client(
    api_key=settings.GEMINI_API_KEY, # Authenticate with Google
)

def ask_gemini(question):
    # Hidden rules for the AI
    system_prompt = """
    You are an AI programming assistant for LearnBridge.
    - Answer clearly and technically correct.
    - If question is wrong, politely correct the user.
    - If unsure, say you don't know.
    - Do not invent facts.
    """

    # Make the API call to Google
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"{system_prompt}\n\nUser Question:\n{question}",
    )

    # Return the generated string
    return response.text
```

---

## 5. Back to Frontend (The Loop Closes)

1.  The `Axios` request in `CourseVideos.jsx` receives the JSON response (`{ "answer": "The AI's generated response text..." }`).
2.  The `try...catch` block succeeds.
3.  `setAiMessages` is called again, this time adding a new message object with `sender: "ai"` and the text received from the backend.
4.  React automatically re-renders the chat UI, displaying the AI's response bubble.
5.  The `finally` block executes, setting `aiLoading(false)`, which hides the "thinking..." indicator.
6.  The process is complete!
