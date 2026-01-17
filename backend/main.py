from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from utils.ai_handler import analyze_email
from utils.file_handler import extract_text_from_file

app = FastAPI(title="AutoU Email API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/to_analyze_email")
async def handle_analyze_request(
    text: Optional[str] = Form(None), 
    file: Optional[UploadFile] = File(None)
):
    email_content = ""

    if file:
        email_content = extract_text_from_file(file)
    elif text:
        email_content = text

    if not email_content or email_content.strip() == "":
        raise HTTPException(status_code=400, detail="O conteúdo do e-mail não pode estar vazio.")

    try:
        result = analyze_email(email_content)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro interno no processamento: {str(e)}")