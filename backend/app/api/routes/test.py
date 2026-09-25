from app.core.llm import llm
from fastapi import APIRouter

router = APIRouter(
    prefix="/test",
    tags=["Testing"]
)


@router.get("/llm")
async def test_llm():
    try:
        response = llm.invoke("Say hello in one sentence.")

        # Extract only the text
        if hasattr(response, "text"):
            answer = response.text
        elif hasattr(response, "content"):
            if isinstance(response.content, str):
                answer = response.content
            elif isinstance(response.content, list):
                answer = " ".join(
                    item.get("text", "")
                    for item in response.content
                    if isinstance(item, dict)
                )
            else:
                answer = str(response.content)
        else:
            answer = str(response)

        return {
            "success": True,
            "model": "gemini-3.5-flash",
            "response": answer
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }