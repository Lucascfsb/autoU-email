from google import genai
from google.genai import types
import os
import json
import re
from dotenv import load_dotenv
from .nlp_processor import NLPProcessor

load_dotenv()

# =============================================================================
# CONFIGURAÇÕES
# =============================================================================
GEMINI_MODEL = 'gemma-3-4b-it'
TEMPERATURE = 0.3
TOP_P = 0.8
TOP_K = 40
MAX_TOKENS = 1024

nlp_processor = NLPProcessor()

# =============================================================================
# FUNÇÕES DE UTILIDADE
# =============================================================================

def get_gemini_client():
    api_key = os.getenv("GOOGLE_API_KEY")
    
    if not api_key:
        print("❌ GOOGLE_API_KEY não encontrada!")
        raise ValueError("GOOGLE_API_KEY não encontrada no .env")
        
    return genai.Client(api_key=api_key)


def remove_markdown_blocks(text: str) -> str:
    text = re.sub(r'^```(?:json)?\s*', '', text.strip())
    text = re.sub(r'\s*```$', '', text)
    return text


def extract_json_from_text(text: str) -> dict:
    json_pattern = r'\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}'
    json_match = re.search(json_pattern, text, re.DOTALL)
    
    if json_match:
        return json.loads(json_match.group())
    
    raise json.JSONDecodeError("JSON não encontrado no texto", text, 0)


# =============================================================================
# PARSING DE RESPOSTA DO GEMINI
# =============================================================================

def parse_gemini_response(response_text: str) -> dict:
    print(f"📄 Resposta bruta do Gemini:\n{response_text}\n")
    
    # Estratégia 1: Tentar parsear diretamente
    try:
        cleaned_text = remove_markdown_blocks(response_text)
        parsed = json.loads(cleaned_text)
        print("✅ JSON parseado com sucesso!")
        return parsed
        
    except json.JSONDecodeError:
        pass
    
    # Estratégia 2: Extrair JSON do texto
    try:
        parsed = extract_json_from_text(response_text)
        print("✅ JSON extraído do texto!")
        return parsed
        
    except json.JSONDecodeError as e:
        print(f"❌ Falha ao parsear JSON: {e}")
        raise ValueError(f"Resposta do Gemini não contém JSON válido: {response_text[:200]}")


def validate_gemini_result(result: dict) -> dict:
    """Valida e normaliza a resposta do Gemini"""
    required_fields = ['classification', 'confidence', 'suggestion', 'color']
    
    for field in required_fields:
        if field not in result:
            raise ValueError(f"Campo obrigatório ausente: {field}")
    
    # Normalizar classificação
    if result['classification'].upper() not in ['PRODUTIVO', 'IMPRODUTIVO']:
        raise ValueError(f"Classificação inválida: {result['classification']}")
    
    # Validar confiança
    if not isinstance(result['confidence'], (int, float)) or not 0 <= result['confidence'] <= 1:
        print(f"⚠️ Confiança inválida ({result['confidence']}), usando 0.5")
        result['confidence'] = 0.5
    
    return result


# =============================================================================
# GERAÇÃO DE PROMPT
# =============================================================================

def build_classification_prompt(email_text: str, nlp_data) -> str:
    keywords_str = ', '.join([w for w, _ in nlp_data.keywords[:5]])
    
    return f"""
Você é um assistente de triagem de emails. Analise o email abaixo e:

1. Classifique como PRODUTIVO ou IMPRODUTIVO
2. Crie uma resposta adequada e personalizada

**ANÁLISE NLP PRÉVIA:**
- Sentimento detectado: {nlp_data.sentiment.sentiment}
- Confiança NLP: {nlp_data.sentiment.confidence}
- Palavras-chave: {keywords_str}
- Sinais produtivos: {nlp_data.sentiment.productive_count}
- Sinais improdutivos: {nlp_data.sentiment.unproductive_count}

**CONTEÚDO DO EMAIL:**
{email_text}

**CRITÉRIOS DE CLASSIFICAÇÃO:**
- PRODUTIVO: suporte técnico, solicitações formais, documentos, contratos, prazos, dúvidas importantes
- IMPRODUTIVO: marketing, propaganda, felicitações genéricas, spam, conversas casuais

**INSTRUÇÕES PARA RESPOSTA:**
- Se PRODUTIVO: Confirme recebimento, agradeça, informe prazo de retorno (24-48h)
- Se IMPRODUTIVO: Seja educado mas breve, agradeça mas indique que será arquivado

Retorne no formato JSON abaixo:

{{
    "classification": "PRODUTIVO",
    "confidence": 0.95,
    "suggestion": "Prezado Sr. João, agradecemos o envio do contrato. Nosso departamento jurídico analisará em até 48h e retornaremos com posicionamento. Atenciosamente, Equipe Financeira",
    "justification": "Email contém anexo de contrato solicitado anteriormente",
    "color": "produtivo"
}}

IMPORTANTE: A "suggestion" deve ser específica ao conteúdo recebido.
"""


# =============================================================================
# FALLBACK NLP
# =============================================================================

def create_nlp_fallback_result(nlp_result, error: Exception = None) -> dict:
    """
    Gera resultado baseado apenas no NLP quando Gemini falha
    """
    sentiment = nlp_result.sentiment.sentiment
    
    # Define resposta baseada no sentimento
    if sentiment == 'produtivo':
        suggestion = (
            "Prezado(a),\n\n"
            "Recebemos sua mensagem e estamos analisando o conteúdo. "
            "Nossa equipe retornará em até 24-48 horas úteis com um posicionamento.\n\n"
            "Atenciosamente,\n"
            "Equipe de Atendimento"
        )
    else:
        suggestion = (
            "Prezado(a),\n\n"
            "Agradecemos o contato. Sua mensagem foi recebida e será arquivada "
            "para referência futura.\n\n"
            "Atenciosamente,\n"
            "Equipe de Atendimento"
        )
    
    # Prepara dados NLP para frontend
    nlp_data = {
        "keywords": [{"word": word, "count": count} for word, count in nlp_result.keywords[:10]],
        "sentiment": sentiment.upper(),
        "nlp_confidence": round(nlp_result.sentiment.confidence, 2),
        "productive_signals": nlp_result.sentiment.productive_count,
        "unproductive_signals": nlp_result.sentiment.unproductive_count,
    }
    
    # Justificativa
    if error:
        justification = f"Classificação baseada em análise NLP local (Gemini indisponível). Detectados {nlp_result.sentiment.productive_count} sinais produtivos e {nlp_result.sentiment.unproductive_count} sinais improdutivos."
    else:
        justification = f"Classificação baseada em análise NLP local. Detectados {nlp_result.sentiment.productive_count} sinais produtivos e {nlp_result.sentiment.unproductive_count} sinais improdutivos."
    
    return {
        "classification": sentiment.upper(),
        "confidence": nlp_result.sentiment.confidence,
        "suggestion": suggestion,
        "justification": justification,
        "color": sentiment.lower() if sentiment in ['produtivo', 'improdutivo'] else 'improdutivo',
        "nlp_data": nlp_data,
    }


# =============================================================================
# CLASSIFICAÇÃO PRINCIPAL
# =============================================================================

def classify_email(email_content: str) -> dict:
    """
    Classifica email usando NLP + Gemini AI
    """
    print("\n🔄 Iniciando análise do email...")
    
    # Análise NLP
    print("📊 Executando análise NLP...")
    nlp_processor = NLPProcessor()
    nlp_result = nlp_processor.preprocess(email_content)
    
    print(f"   ✓ Keywords: {[word for word, _ in nlp_result.keywords[:5]]}")
    print(f"   ✓ Sentimento NLP: {nlp_result.sentiment.sentiment}")
    print(f"   ✓ Confiança NLP: {nlp_result.sentiment.confidence}")
    
    # Prepara dados NLP para retornar ao frontend
    nlp_data = {
        "keywords": [{"word": word, "count": count} for word, count in nlp_result.keywords[:10]],
        "sentiment": nlp_result.sentiment.sentiment.upper(),
        "nlp_confidence": round(nlp_result.sentiment.confidence, 2),
        "productive_signals": nlp_result.sentiment.productive_count,
        "unproductive_signals": nlp_result.sentiment.unproductive_count,
    }
    
    # Consulta Gemini
    try:
        print("🤖 Consultando Google Gemini...")
        client = get_gemini_client()
        
        prompt = build_classification_prompt(email_content, nlp_result)
        
        config = types.GenerateContentConfig(
            temperature=TEMPERATURE,
            top_p=TOP_P,
            top_k=TOP_K,
            max_output_tokens=MAX_TOKENS,
        )
        
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
            config=config
        )
        
        print("🔍 Processando resposta...")
        result = parse_gemini_response(response.text)
        validate_gemini_result(result)
        
        print(f"✅ Classificação: {result['classification']}")
        print(f"✅ Confiança: {result['confidence']}")
        print(f"✅ Cor: {result['color']}\n")
        
        # Adiciona dados NLP ao resultado
        result['nlp_data'] = nlp_data
        
        return result
        
    except Exception as error:
        print(f"⚠️ Erro ao consultar Gemini: {error}")
        print("🔄 Usando fallback (apenas NLP)\n")
        
        return create_nlp_fallback_result(nlp_result, error)