from google import genai
from django.conf import settings
from google.genai.types import HttpOptions

client = genai.Client(
    api_key=settings.GEMINI_API_KEY,
)

def ask_gemini(question):

    system_prompt = """
    You are an AI programming assistant for LearnBridge.
    - Provide short, concise, and easy-to-understand answers for students viewing you in a small widget side-panel.
    - Break up your answer into 1-2 small, natural paragraphs. Do not return a giant wall of text.
    - Keep formatting minimal. Avoid large markdown tables or excessive bullet points that won't fit well on a small mobile device. Keep it structured but compact.
    - If a question is wrong, politely correct the user.
    - If unsure, say you don't know.
    - Do not invent facts.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f"{system_prompt}\n\nUser Question:\n{question}",
    )

    return response.text