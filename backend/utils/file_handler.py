import io
import chardet
from PyPDF2 import PdfReader
from fastapi import UploadFile, HTTPException

MAX_FILE_SIZE = 5 * 1024 * 1024 

async def validate_file_size(file: UploadFile):
    content = await file.read()
    size = len(content)
    
    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, 
            detail=f"Arquivo muito grande ({size/1024/1024:.2f}MB). Máximo permitido: 5MB"
        )

    await file.seek(0)
    return file

def extract_text_from_file(file: UploadFile) -> str:
    try:
        final_text = ""
        content_type = getattr(file, "content_type", "")
        
        if "pdf" in content_type:
            pdf_content = file.file.read() 
            pdf_reader = PdfReader(io.BytesIO(pdf_content))
            
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text:
                    final_text += text + "\n"
        
        else:
            raw_content = file.file.read()
            
            detected = chardet.detect(raw_content)
            encoding = detected['encoding'] or 'utf-8'
            
            try:
                final_text = raw_content.decode(encoding)
            except (UnicodeDecodeError, LookupError):
                final_text = raw_content.decode('latin-1')
        
        if not final_text.strip():
            raise ValueError("O conteúdo extraído está vazio ou é ilegível.")
            
        return final_text

    except Exception as e:
        raise ValueError(f"Erro técnico na extração: {str(e)}")