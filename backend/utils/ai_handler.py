from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

def ai_configuration():
    api_key = os.getenv("GOOGLE_API_KEY")
    return genai.Client(api_key=api_key)

def parse_ai_response(raw_result: str) -> dict:
    if "RESPOSTA SUGERIDA:" in raw_result:
        parts = raw_result.split("RESPOSTA SUGERIDA:")
        classification = parts[0].replace("CLASSIFICAÇÃO:", "").strip()
        suggestion = parts[1].strip()
    else:
        classification = "Indefinido"
        suggestion = raw_result

    return {
        "classificacao": classification,
        "sugestao": suggestion,
        "cor": "produtivo" if "produtivo" in classification.lower() else "improdutivo"
    }

def analyze_email(email_text: str) -> dict:
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
    
    return parse_ai_response(response.text)