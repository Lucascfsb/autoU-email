import streamlit as st

def customized_style():
    st.markdown("""
        <style>
        .ia-header {
            color: #00A8E8;
            font-weight: bold;
            font-size: 24px;
            margin-bottom: 10px;
        }

        .result-card {
            background-color: #161B22;
            border: 1px solid #30363d; 
            padding: 20px; 
            border-radius: 8px;
            margin-top: 10px;
        }

        /* Classes auxiliares para cores dinâmicas */
        .border-produtivo { border-left: 8px solid #00A8E8; }
        .border-improdutivo { border-left: 8px solid #FF4B4B; }
        
        .badge-produtivo { background-color: #00A8E8; }
        .badge-improdutivo { background-color: #FF4B4B; }

        .badge {
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
        }

        div.stButton > button:first-child {
            background-color: #00A8E8;
            color: white;
            border: none;
            width: 100%;
            height: 3em;
            font-weight: bold;
            transition: 0.3s;
        }
        div.stButton > button:hover {
            background-color: #007bbd;
            color: white;
        }
        </style>
    """, unsafe_allow_html=True)