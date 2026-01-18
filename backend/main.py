from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from utils.ai_handler import classify_email 
from utils.file_handler import extract_text_from_file, validate_file_size
import traceback

app = FastAPI(title="AutoU Email API")

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://auto-u-email.vercel.app", 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/to_analyze_email")
async def handle_analyze_request(
    text: Optional[str] = Form(None), 
    file: Optional[UploadFile] = File(None)
):
    email_content = ""

    # PASSO 1: Processa arquivo (se enviado)
    if file:
        # ✅ NOVA VALIDAÇÃO: Tamanho do arquivo
        await validate_file_size(file)
        
        # ✅ NOVA VALIDAÇÃO: Formato do arquivo
        if not file.filename.lower().endswith(('.pdf', '.txt')):
            raise HTTPException(
                status_code=400,
                detail="Formato inválido. Apenas .pdf ou .txt são aceitos."
            )
        
        email_content = extract_text_from_file(file)
    
    # PASSO 2: Usa texto direto (se enviado)
    elif text:
        email_content = text

    # PASSO 3: Valida se tem conteúdo
    if not email_content or email_content.strip() == "":
        raise HTTPException(
            status_code=400, 
            detail="O conteúdo do e-mail não pode estar vazio."
        )

    # PASSO 4: Classifica com IA
    try:
        result = classify_email(email_content)
        return result

    except ValueError as ve:
        # Erros de validação (arquivo ilegível, etc)
        raise HTTPException(status_code=400, detail=str(ve))

    except Exception as error:  
        print(f"❌ ERRO NO MAIN.PY: {error}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail=f"Erro interno no processamento: {str(error)}"
        )