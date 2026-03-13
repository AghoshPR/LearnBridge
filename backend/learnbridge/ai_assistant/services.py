from google import genai
from django.conf import settings
from google.genai.types import HttpOptions

client = genai.Client(
    api_key=settings.GEMINI_API_KEY,
)


def ask_gemini(question):
    try:
        system_prompt = """
        You are an AI Learning Assistant for LearnBridge.
        - You are a helpful chatbot here to clear doubts, explain concepts, or just chat with students about their learning journey.
        - While you are an expert in programming and education, you can also engage in friendly, professional general conversation to help the student feel comfortable.
        - Provide short, concise, and easy-to-understand answers for students viewing you in a small widget side-panel.
        - Break up your answer into 1-2 small, natural paragraphs. Do not return a giant wall of text.
        - Keep formatting minimal. Avoid large markdown tables or excessive bullet points that won't fit well on a small mobile device. Keep it structured but compact.
        - If a question is wrong, politely correct the user.
        - If unsure, say you don't know.
        - Do not invent facts.
        """

        response = client.models.generate_content(
            model="gemini-flash-lite-latest",
            contents=question,
            config={
                "system_instruction": system_prompt
            }
        )

        return response.text
    except Exception as e:
        print(f"Error in ask_gemini: {str(e)}")
        raise e
