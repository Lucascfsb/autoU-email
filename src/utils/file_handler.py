from PyPDF2 import PdfReader

def extract_text_from_file(file):
    final_text = ""
    if file.type == "application/pdf":
        pdf_reader = PdfReader(file)
        for page in pdf_reader.pages:
            final_text += page.extract_text()
    else:
        final_text = str(file.read(), "utf-8")
    return final_text