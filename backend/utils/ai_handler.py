from google import genai
from google.genai import types
import os
import json
import re
from dotenv import load_dotenv
from .nlp_processor import NLPProcessor

load_dotenv()

nlp_processor = NLPProcessor()

def get_gemini_client():
    api_key = os.getenv("GOOGLE_API_KEY")
    
    if not api_key:
        print(f"❌ GOOGLE_API_KEY não encontrada!")
        raise ValueError("GOOGLE_API_KEY não encontrada no .env")
        
    client = genai.Client(api_key=api_key)
    return client


def parse_gemini_response(response_text: str) -> dict:
    
    try:
        json_match = re.search(r'\{[^{}]*\}', response_text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except json.JSONDecodeError:
        pass
    
    text_lower = response_text.lower()
    classification = "IMPRODUTIVO"

    if "produtivo" in text_lower and "improdutivo" not in text_lower:
        classification = "PRODUTIVO"

    
    return {
        "classification": classification.upper(),
        "confidence": 0.85,
        "suggestion": response_text,
        "justification": "Classificação baseada em análise do Gemini",
        "color": "produtivo" if "PRODUTIVO" in classification.upper() else "improdutivo"
    }


def classify_email(email_text: str) -> dict:
    """
    Classifica email usando NLP + Google Gemini
    """
    
    print("🔄 Iniciando análise do email...")
    
    # ========================================
    # ETAPA 1: PRÉ-PROCESSAMENTO NLP
    # ========================================
    print("📊 Executando análise NLP...")
    
    try:
        nlp_data = nlp_processor.preprocess(email_text)
    except Exception as e:
        print(f"❌ ERRO no NLP: {e}")
        raise
    
    print(f"   ✓ Keywords: {[w for w, _ in nlp_data.keywords[:3]]}")
    print(f"   ✓ Sentimento NLP: {nlp_data.sentiment.sentiment}")
    print(f"   ✓ Confiança NLP: {nlp_data.sentiment.confidence}")
    
    
    # ========================================
    # ETAPA 2: PROMPT PARA GEMINI
    # ========================================
    prompt = f"""
Classifique este email como PRODUTIVO ou IMPRODUTIVO.

**ANÁLISE NLP:**
- Sentimento: {nlp_data.sentiment.sentiment}
- Confiança: {nlp_data.sentiment.confidence}
- Sinais produtivos: {nlp_data.sentiment.productive_count}
- Sinais improdutivos: {nlp_data.sentiment.unproductive_count}
- Keywords: {', '.join([f"{w}({c})" for w, c in nlp_data.keywords[:5]])}

**EMAIL:**
{email_text}

**CRITÉRIOS:**
✅ PRODUTIVO: suporte, dúvidas, solicitações, documentos, prazos
❌ IMPRODUTIVO: felicitações, marketing, spam, conversas casuais

**RESPONDA EM JSON:**
{{
    "classification": "PRODUTIVO" ou "IMPRODUTIVO",
    "confidence": 0.95,
    "suggestion": "Prezado(a), Recebi sua mensagem. Solicitamos 24 horas para análise técnica e retorno. Atenciosamente,",
    "justification": "Email contém documentos importantes",
    "color": "produtivo" ou "improdutivo"
}}

Retorne APENAS o JSON.
"""

    try:
        # ========================================
        # ETAPA 3: CHAMAR GEMINI
        # ========================================
        print("🤖 Consultando Google Gemini...")
        
        client = get_gemini_client()
        
        config = types.GenerateContentConfig(
            temperature=0.3,
            top_p=0.8,
            top_k=40,
            max_output_tokens=1024,
        )
        
        response = client.models.generate_content(
            model='gemma-3-4b-it',
            contents=prompt,
            config=config
        )
        
        response_text = response.text
        
        # ========================================
        # ETAPA 4: PARSE RESPOSTA
        # ========================================
        print("🔍 Processando resposta...")
        
        result = parse_gemini_response(response_text)
        
        # ========================================
        # ETAPA 5: ADICIONAR DADOS NLP
        # ========================================
        result['nlp'] = {
            'keywords': nlp_data.keywords[:5],
            'sentiment_detected': nlp_data.sentiment.sentiment,
            'confidence_nlp': nlp_data.sentiment.confidence,
            'statistics': {
                'original_word_count': nlp_data.stats.original_word_count,
                'processed_word_count': nlp_data.stats.processed_word_count,
                'unique_word_count': nlp_data.stats.unique_word_count
            }
        }
        
        result['classification'] = result['classification'].upper()
        result['color'] = result['color'].lower()
        
        print(f"✅ Classificação: {result['classification']}")
        print(f"✅ Confiança: {result['confidence']}")
        print(f"✅ Cor: {result['color']}")
        
        return result
        
    except Exception as e:
        print(f"❌ Erro ao processar com Gemini: {e}")
        
        # ========================================
        # FALLBACK: USAR APENAS NLP
        # ========================================
        sentiment_nlp = nlp_data.sentiment.sentiment
        
        if sentiment_nlp == 'produtivo':
            classification = "PRODUTIVO"
            suggestion = "Prezado(a), Recebi sua mensagem. Solicitamos 24 horas para análise técnica e retorno. Atenciosamente,"
        else:
            classification = "IMPRODUTIVO"
            suggestion = "Arquivar. E-mail de marketing não relacionado aos serviços financeiros da instituição."
        
        return {
            "classification": classification,
            "confidence": nlp_data.sentiment.confidence,
            "suggestion": suggestion,
            "justification": f"Classificação via NLP (fallback). Erro: {str(e)}",
            "color": sentiment_nlp if sentiment_nlp in ['produtivo', 'improdutivo'] else 'improdutivo',
            "nlp": {
                'keywords': nlp_data.keywords[:5],
                'sentiment_detected': sentiment_nlp,
                'confidence_nlp': nlp_data.sentiment.confidence,
                'statistics': {
                    'original_word_count': nlp_data.stats.original_word_count,
                    'processed_word_count': nlp_data.stats.processed_word_count,
                    'unique_word_count': nlp_data.stats.unique_word_count
                }
            },
            "erro_tecnico": str(e),
            "modo_fallback": True
        }


def analyze_email(email_text: str) -> dict:
    """Função legada para compatibilidade"""
    result = classify_email(email_text)
    
    return {
        "classification": result.get("classification", "ERRO"),
        "suggestion": result.get("suggestion", "Erro ao processar"),
        "color": result.get("color", "improdutivo"),
        "confidence": result.get("confidence", 0.0),
        "nlp_data": result.get("nlp", {})
    }