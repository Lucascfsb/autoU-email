from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

def ai_configuration():
    api_key = os.getenv("GOOGLE_API_KEY")
    return genai.Client(api_key=api_key)

def analyze_email(email_text):
    client = ai_configuration()
    prompt = f"""
    Aja como um triador de emails do setor financeiro rigoroso.
    Analise o texto abaixo e siga estas regras:
    1. Classifique em: Produtivo (assuntos reais, boletos, notas, dúvidas) ou Improdutivo (spam, propagandas).
    2. Se for Produtivo, gere uma resposta solicitando 24h para análise técnica.
    3. Se for Improdutivo, sugira arquivamento interno.

    Texto do e-mail:
    {email_text}
    
    Responda EXATAMENTE neste formato:
    CLASSIFICAÇÃO: Tipo
    RESPOSTA SUGERIDA: Sua resposta
    """
    
    response = client.models.generate_content(
        model='gemma-3-4b-it',
        contents=prompt
    )
    return response.text