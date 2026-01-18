import io
import chardet
from PyPDF2 import PdfReader
from fastapi import UploadFile, HTTPException

# =============================================================================
# CONFIGURAÇÕES / CONSTANTES
# =============================================================================
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB em bytes

# =============================================================================
# FUNÇÕES DE VALIDAÇÃO
# =============================================================================

async def validate_file_size(file: UploadFile):
    """
    Valida se o arquivo não ultrapassa o limite de segurança.
    Necessário para evitar sobrecarga de memória (Ataques DoS).
    """
    # Lê o conteúdo para medir o tamanho
    content = await file.read()
    size = len(content)
    
    if size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413, 
            detail=f"Arquivo muito grande ({size/1024/1024:.2f}MB). Máximo permitido: 5MB"
        )
    
    # IMPORTANTE: Após ler, o "cursor" do arquivo está no fim. 
    # Precisamos voltar para o início (0) para que a próxima função consiga ler.
    await file.seek(0)
    return file

# =============================================================================
# FUNÇÕES DE EXTRAÇÃO DE TEXTO
# =============================================================================

def extract_text_from_file(file: UploadFile) -> str:
    """
    Extrai texto de arquivos PDF ou Texto Puro com detecção automática de encoding.
    """
    try:
        final_text = ""
        # Obtém o tipo do arquivo (ex: application/pdf)
        content_type = getattr(file, "content_type", "")
        
        # Caso 1: Processamento de PDF
        if "pdf" in content_type:
            pdf_content = file.file.read() 
            pdf_reader = PdfReader(io.BytesIO(pdf_content))
            
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text:
                    final_text += text + "\n"
        
        # Caso 2: Processamento de Arquivos de Texto (TXT, CSV, etc)
        else:
            raw_content = file.file.read()
            
            # Usa o 'analista de sinais' chardet para descobrir a codificação
            detected = chardet.detect(raw_content)
            encoding = detected['encoding'] or 'utf-8'
            
            try:
                final_text = raw_content.decode(encoding)
            except (UnicodeDecodeError, LookupError):
                # Plano de contingência se o encoding detectado falhar
                final_text = raw_content.decode('latin-1')
        
        # Validação final: Garante que não estamos enviando lixo ou vazio para a IA
        if not final_text.strip():
            raise ValueError("O conteúdo extraído está vazio ou é ilegível.")
            
        return final_text

    except Exception as e:
        # Repassa o erro de forma clara
        raise ValueError(f"Erro técnico na extração: {str(e)}")