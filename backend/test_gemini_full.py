from utils.ai_handler import classify_email

print("🚀 TESTE COMPLETO: GEMINI + NLP")
print("=" * 60)

# Email de teste
email_produtivo = """
Prezados,

Segue em anexo a nota fiscal NF-12345 referente ao 
contrato 2024-ABC conforme solicitado.

Atenciosamente,
João Silva
Depto. Financeiro
"""

# Classificar
result = classify_email(email_produtivo)

print(f"\n✅ Classificação: {result['classification']}")
print(f"✅ Confiança: {result['confidence']}")
print(f"✅ Cor: {result['color']}")

# Usa 'nlp_data' em vez de 'nlp'
if 'nlp_data' in result:
    nlp = result['nlp_data']
    
    print(f"\n📊 Dados NLP:")
    print(f"   - Sentimento: {nlp['sentiment']}")
    print(f"   - Confiança NLP: {nlp['nlp_confidence']}")
    print(f"   - Sinais Produtivos: {nlp['productive_signals']}")
    print(f"   - Sinais Improdutivos: {nlp['unproductive_signals']}")
    
    # Mostra top 5 keywords
    print(f"\n🔑 Top 5 Keywords:")
    for i, kw in enumerate(nlp['keywords'][:5], 1):
        print(f"   {i}. {kw['word']} (x{kw['count']})")

print(f"\n💡 Justificativa:")
print(f"   {result['justification']}")

print(f"\n✉️ Sugestão de Resposta:")
print(f"{result['suggestion']}")

print("\n" + "=" * 60)
print("✅ Teste concluído com sucesso!")
print("=" * 60)