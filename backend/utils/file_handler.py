from PyPDF2 import PdfReader
import io

def extract_text_from_file(file):
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
            final_text = file.file.read().decode("utf-8")
        
        if not final_text.strip():
            raise ValueError("O arquivo está vazio ou não pôde ser lido")
            
        return final_text
    except Exception as e:
        raise ValueError(f"Erro ao processar arquivo: {str(e)}")