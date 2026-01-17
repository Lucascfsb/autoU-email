"""
Teste rápido do NLP
"""

from utils.nlp_processor import NLPProcessor

nlp = NLPProcessor()

# Teste simples
email = """
Prezados, solicito urgentemente atualização sobre meu processo.
O prazo já expirou e preciso da nota fiscal.
"""

print("🧪 TESTANDO NLP")
print("=" * 60)

result = nlp.preprocess(email)

print(f"\n✅ Keywords: {result['keywords']}")
print(f"✅ Sentimento: {result['sentimento']}")
print(f"✅ Stats: {result['stats']}")
print(f"\n📝 Processado: {result['texto_processado']}")