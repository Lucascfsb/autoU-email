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
        
    except json.JSONDecodeError:
        pass
    
    # Estratégia 3: Fallback com análise textual
    print("⚠️ Não conseguiu parsear JSON, usando fallback...")
    classification = extract_classification_from_text(response_text)
    return create_fallback_response(response_text, classification)


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

Retorne no formato JSON abaixo (substitua os valores entre aspas com conteúdo real):

{{
    "classification": "PRODUTIVO",
    "confidence": 0.95,
    "suggestion": "Prezado Sr. João, agradecemos o envio do contrato. Nosso departamento jurídico analisará em até 48h e retornaremos com posicionamento. Atenciosamente, Equipe Financeira",
    "justification": "Email contém anexo de contrato solicitado anteriormente",
    "color": "produtivo"
}}

IMPORTANTE: A "suggestion" deve ser escrita como se você estivesse respondendo diretamente ao remetente, sendo específica ao conteúdo recebido.
"""

# =============================================================================
# PROCESSAMENTO NLP
# =============================================================================

def perform_nlp_analysis(email_text: str):

    print("📊 Executando análise NLP...")
    nlp_data = nlp_processor.preprocess(email_text)
    
    print(f"   ✓ Keywords: {[w for w, _ in nlp_data.keywords[:3]]}")
    print(f"   ✓ Sentimento NLP: {nlp_data.sentiment.sentiment}")
    print(f"   ✓ Confiança NLP: {nlp_data.sentiment.confidence}")
    
    return nlp_data


# =============================================================================
# CHAMADA AO GEMINI
# =============================================================================

def call_gemini_api(prompt: str) -> str:

    print("🤖 Consultando Google Gemini...")
    
    client = get_gemini_client()
    
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
    
    return response.text


# =============================================================================
# ENRIQUECIMENTO DE DADOS
# =============================================================================

def enrich_result_with_nlp(result: dict, nlp_data) -> dict:

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
    
    return result


def create_nlp_fallback_result(nlp_data, error: Exception) -> dict:

    sentiment = nlp_data.sentiment.sentiment
    
    if sentiment == 'produtivo':
        classification = "PRODUTIVO"
        suggestion = "Prezado(a), Recebi sua mensagem. Solicitamos 24 horas para análise técnica e retorno. Atenciosamente,"
    else:
        classification = "IMPRODUTIVO"
        suggestion = "Arquivar. E-mail de marketing não relacionado aos serviços financeiros da instituição."
    
    return {
        "classification": classification,
        "confidence": nlp_data.sentiment.confidence,
        "suggestion": suggestion,
        "justification": f"Classificação via NLP (fallback). Erro: {str(error)}",
        "color": sentiment if sentiment in ['produtivo', 'improdutivo'] else 'improdutivo',
        "nlp": {
            'keywords': nlp_data.keywords[:5],
            'sentiment_detected': sentiment,
            'confidence_nlp': nlp_data.sentiment.confidence,
            'statistics': {
                'original_word_count': nlp_data.stats.original_word_count,
                'processed_word_count': nlp_data.stats.processed_word_count,
                'unique_word_count': nlp_data.stats.unique_word_count
            }
        },
        "erro_tecnico": str(error),
        "modo_fallback": True
    }


# =============================================================================
# CLASSIFICAÇÃO PRINCIPAL
# =============================================================================

def classify_email(email_text: str) -> dict:

    print("🔄 Iniciando análise do email...")
    
    # Etapa 1: Análise NLP
    try:
        nlp_data = perform_nlp_analysis(email_text)
    except Exception as e:
        print(f"❌ ERRO no NLP: {e}")
        raise
    
    # Etapa 2: Classificação com Gemini
    try:
        prompt = build_classification_prompt(email_text, nlp_data)
        response_text = call_gemini_api(prompt)
        
        print("🔍 Processando resposta...")
        result = parse_gemini_response(response_text)
        
        result = enrich_result_with_nlp(result, nlp_data)
        
        print(f"✅ Classificação: {result['classification']}")
        print(f"✅ Confiança: {result['confidence']}")
        print(f"✅ Cor: {result['color']}")
        
        return result
        
    except Exception as e:
        print(f"❌ Erro ao processar com Gemini: {e}")
        print(f"❌ Tipo do erro: {type(e)}")
        
        import traceback
        traceback.print_exc()
        
        return create_nlp_fallback_result(nlp_data, e)
