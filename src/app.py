import streamlit as st
from utils.ai_handler import analyze_email
from utils.file_handler import extract_text_from_file
from utils.customized_style import customized_style

# 1. Configuração da Página
st.set_page_config(page_title="Triagem Financeira IA", page_icon="💰")

# 2. Aplicar Estilo Customizado
customized_style()

# 3. Cabeçalho do Aplicativo
st.title("🛡️ Classificador de e-mails")
st.markdown("---")

# 4. Área de Entrada de Dados
input_option = st.radio("Escolha como inserir o e-mail:", ("Digitar Texto", "Upload de Arquivo (.txt, .pdf)"))

email_content = ""

if input_option == "Digitar Texto":
    email_content = st.text_area("Cole o conteúdo do e-mail recebido:", height=200, placeholder="Digite o email aqui...")
else:
    file = st.file_uploader("Selecione o arquivo para triagem", type=['txt', 'pdf'])
    if file is not None:
        email_content = extract_text_from_file(file)

# 5. Lógica de Execução e Exibição do Resultado
if st.button("🚀 Executar Triagem"):
    if email_content:
        with st.spinner('Analisando informações...'):
            try:
                # Chamada para a IA
                analysis_result = analyze_email(email_content)
                
                st.divider()
                
                # --- LÓGICA DE FORMATAÇÃO DO TEXTO ---
                if "RESPOSTA SUGERIDA:" in analysis_result:
                    partes = analysis_result.split("RESPOSTA SUGERIDA:")
                    # Limpamos os colchetes e espaços para a lógica de cor funcionar
                    classification = partes[0].replace("CLASSIFICAÇÃO:", "").replace("[", "").replace("]", "").strip()
                    suggestion = partes[1].strip()
                else:
                    classification = "Indefinido"
                    suggestion = analysis_result

                # --- LÓGICA DE COR DINÂMICA ---
                # Definimos qual classe CSS usar baseada na resposta da IA
                theme_color = "produtivo" if "Produtivo" in classification else "improdutivo"

                # --- EXIBIÇÃO DO CARD CUSTOMIZADO (A MUDANÇA ESTÁ AQUI) ---
                st.markdown(f'<p class="ia-header">Análise da IA:</p>', unsafe_allow_html=True)
                
                st.markdown(f"""
                    <div class="result-card border-{theme_color}">
                        <span class="badge badge-{theme_color}">{classification}</span>
                        <p style="color: #8b949e; font-size: 0.9em; margin-top: 15px; margin-bottom: 5px;">SUGESTÃO DE RESPOSTA :</p>
                        <p style="color: #E6edf3; font-size: 1.1em; line-height: 1.6; font-style: italic;">
                            "{suggestion}"
                        </p>
                    </div>
                """, unsafe_allow_html=True)
                
            except Exception as error:
                st.error(f"Erro ao processar: {error}")
    else:
        st.warning("Aguardando entrada: Digite um texto ou suba um arquivo.")

# Rodapé
st.markdown("<br><p style='text-align: center; color: #8b949e; font-size: 0.8em;'>Sistema de Triagem Operacional v1.0</p>", unsafe_allow_html=True)