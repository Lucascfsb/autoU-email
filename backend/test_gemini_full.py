"""
Teste completo Gemini + NLP
"""

from utils.ai_handler import classify_email
from dotenv import load_dotenv

load_dotenv()

email = """
Prezados,

Segue em anexo a Nota Fiscal 12345.
Solicito confirmação de recebimento urgente.

Atenciosamente
"""

print("🚀 TESTE COMPLETO: GEMINI + NLP")
print("=" * 60)

result = classify_email(email)

print(f"\n✅ Classificação: {result['classification']}")
print(f"✅ Confiança: {result['confidence']}")
print(f"✅ NLP Sentimento: {result['nlp']['sentiment_detected']}")
print(f"✅ Keywords: {result['nlp']['keywords'][:3]}")
print(f"\n💬 Sugestão:\n{result['suggestion']}")