# 🧠 Email AI Classifier

[![Python](https://img.shields.io/badge/Python-3.8%2B-blue?logo=python)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0%2B-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-AI-4285F4?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Sistema inteligente de classificação de emails usando IA Generativa (Google Gemini) e Processamento de Linguagem Natural (NLP).**

Classifica automaticamente emails como **Produtivos** ou **Improdutivos** e gera sugestões de resposta personalizadas.

---

## 📋 **Índice**

- [✨ Funcionalidades](#-funcionalidades)
- [🎯 Demonstração](#-demonstração)
- [🏗️ Arquitetura](#-arquitetura)
- [🚀 Instalação](#-instalação)
- [⚙️ Configuração](#-configuração)
- [🎮 Como Usar](#-como-usar)
- [📊 Métricas de Análise](#-métricas-de-análise)
- [🛠️ Tecnologias](#-tecnologias)
- [📂 Estrutura do Projeto](#-estrutura-do-projeto)
- [🔌 API Endpoints](#-api-endpoints)
- [🧪 Testes](#-testes)
- [🤝 Contribuindo](#-contribuindo)
- [📄 Licença](#-licença)

---

## ✨ **Funcionalidades**

### 🎯 **Classificação Inteligente**
- ✅ **Classificação Automática**: Identifica emails produtivos vs. improdutivos
- ✅ **Análise NLP**: Processamento de linguagem natural com análise de sentimento
- ✅ **Confiança Percentual**: Exibe nível de certeza da classificação (0-100%)
- ✅ **Justificativa Explicativa**: Mostra por que o email foi classificado

### 🤖 **IA Generativa (Google Gemini)**
- 🧠 **Sugestões de Resposta**: Gera respostas contextualizadas automaticamente
- 🎯 **Análise de Contexto**: Entende intenção e tom da mensagem
- 📊 **Palavras-chave**: Identifica termos relevantes e frequência

### 📁 **Interface Moderna**
- 💬 **Input Duplo**: Digite texto ou faça upload de arquivo (.txt, .pdf)
- 🎨 **Design Responsivo**: Funciona em desktop, tablet e mobile
- 📊 **Dashboard com Métricas**: Visualize estatísticas em tempo real
- 📋 **Copiar Sugestão**: Um clique para copiar resposta gerada

### 🔍 **Análise Detalhada**
- 📈 **Sinais Produtivos**: Conta termos relacionados a trabalho/documentos
- 🔔 **Sinais Improdutivos**: Detecta mensagens casuais/promocionais
- 🏷️ **Tags de Keywords**: Visualize palavras-chave extraídas
- 🎯 **Sentimento NLP**: Analisa tom (produtivo/improdutivo)

---

## 🎯 **Demonstração**

### **Email Produtivo**
```
Input:
"Prezada equipe, segue em anexo a segunda via do boleto 
referente ao contrato 2024-XYZ. Prazo de pagamento: 15/02/2026."

Output:
✅ PRODUTIVO (98% confiança)
💡 Contém: boleto, contrato, prazo → solicitação formal

Sugestão: "Prezado(a), recebemos o boleto. Pagamento será 
processado até 15/02/2026. Agradecemos."
```

### **Email Improdutivo**
```
Input:
"Olá! Venha conhecer nossa nova campanha de marketing digital.
Descontos especiais nesta semana!"

Output:
⚠️ IMPRODUTIVO (95% confiança)
💡 Proposta comercial sem solicitação formal

Sugestão: "Prezado representante, agradecemos o contato. 
No momento não estamos buscando novas propostas."
```

---

## 🏗️ **Arquitetura**

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Input Text │  │ Upload File │  │  Dashboard  │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
                           ▼ HTTP POST
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  main.py (API Router)                            │   │
│  └──────────────────────────────────────────────────┘   │
│           ▼                    ▼                    ▼    │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────┐  │
│  │ file_handler │    │nlp_processor │    │ai_handler│  │
│  │  (.txt/.pdf) │    │  (spaCy)     │    │ (Gemini) │  │
│  └──────────────┘    └──────────────┘    └──────────┘  │
└─────────────────────────────────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                           │
│  ┌──────────────────────┐    ┌──────────────────────┐  │
│  │ Google Gemini 1.5    │    │ spaCy pt_core_news_lg│  │
│  │ (LLM Classification) │    │ (NLP Portuguese)     │  │
│  └──────────────────────┘    └──────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 **Instalação**

### **Pré-requisitos**

- **Python**: 3.8 ou superior
- **Node.js**: 16.0 ou superior
- **npm** ou **yarn**
- **Chave API**: Google Gemini ([Obter aqui](https://ai.google.dev/))

---

### **1️⃣ Clone o Repositório**

```bash
git clone https://github.com/seu-usuario/email-ai-classifier.git
cd email-ai-classifier
```

---

### **2️⃣ Configurar Backend**

```bash
cd backend

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

# Baixar modelo NLP em português
python -m spacy download pt_core_news_lg
```

---

### **3️⃣ Configurar Frontend**

```bash
cd ../frontend

# Instalar dependências
npm install
# ou
yarn install
```

---

## ⚙️ **Configuração**

### **Backend (.env)**

Crie o arquivo `.env` na pasta `backend/`:

```env
# filepath: backend/.env

# Google Gemini API Key (OBRIGATÓRIO)
GEMINI_API_KEY=sua_chave_api_aqui

# Configurações do servidor
PORT=8000
HOST=0.0.0.0

# Configurações de arquivo
MAX_FILE_SIZE=5242880  # 5MB em bytes
ALLOWED_EXTENSIONS=txt,pdf
```

📌 **Como obter a chave do Gemini:**
1. Acesse: https://ai.google.dev/
2. Clique em "Get API Key"
3. Copie a chave e cole no `.env`

---

### **Frontend (.env)**

Crie o arquivo `.env` na pasta `frontend/`:

```env
# filepath: frontend/.env

# URL do backend
REACT_APP_API_URL=http://localhost:8000
```

---

## 🎮 **Como Usar**

### **1️⃣ Iniciar Backend**

```bash
cd backend

# Ativar ambiente virtual (se não estiver ativo)
venv\Scripts\activate  # Windows
# ou
source venv/bin/activate  # Linux/Mac

# Iniciar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

✅ **Backend rodando em**: http://localhost:8000  
📚 **Documentação**: http://localhost:8000/docs

---

### **2️⃣ Iniciar Frontend**

```bash
cd frontend

# Iniciar aplicação React
npm start
# ou
yarn start
```

✅ **Frontend rodando em**: http://localhost:3000

---

### **3️⃣ Usar a Aplicação**

#### **Opção 1: Inserir Texto**
1. Clique na aba **"Inserir Texto"**
2. Cole ou digite o conteúdo do email
3. Clique em **"⚡ Analisar Email"**
4. Veja o resultado no card direito

#### **Opção 2: Upload de Arquivo**
1. Clique na aba **"Upload Arquivo"**
2. Arraste ou selecione um arquivo `.txt` ou `.pdf`
3. Veja as informações do arquivo carregado
4. Clique em **"⚡ Analisar Email"**
5. Copie a sugestão gerada com **"📋 Copiar"**

---

## 📊 **Métricas de Análise**

### **1. Classificação Principal**
- **PRODUTIVO**: Email contém solicitações, documentos, prazos
- **IMPRODUTIVO**: Mensagens casuais, promocionais, saudações

### **2. Confiança NLP**
```
Alta:   ≥ 80%  → 🟢 Verde
Média:  60-79% → 🟡 Amarelo
Baixa:  < 60%  → 🔴 Vermelho
```

### **3. Sinais Detectados**

#### **Sinais Produtivos** 🟢
- Palavras-chave: `boleto`, `contrato`, `prazo`, `urgente`
- Tom: Formal, objetivo, profissional
- Presença: Datas, valores, documentos

#### **Sinais Improdutivos** 🟡
- Palavras-chave: `oferta`, `promoção`, `parabéns`, `feliz`
- Tom: Casual, promocional, pessoal
- Ausência: Solicitações formais

---

## 🛠️ **Tecnologias**

### **Frontend**
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React** | 18.3.1 | Biblioteca UI para construção de interfaces |
| **Fetch API** | ES6 Nativo | Cliente HTTP para requisições REST |
| **CSS3** | - | Estilização customizada com variáveis CSS |
| **FormData API** | Nativo | Upload de arquivos e envio de dados |

### **Backend**
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Python** | 3.8+ | Linguagem principal |
| **FastAPI** | 0.100+ | Framework web assíncrono |
| **Uvicorn** | 0.23+ | Servidor ASGI de alta performance |
| **spaCy** | 3.7+ | Processamento de Linguagem Natural |
| **PyPDF2** | 3.0+ | Extração de texto de arquivos PDF |
| **Google Gemini** | 1.5 | IA Generativa para classificação |
| **python-dotenv** | 1.0+ | Gerenciamento de variáveis de ambiente |

### **APIs Externas**
| Serviço | Versão | Descrição |
|---------|--------|-----------|
| **Google Gemini API** | 1.5 Flash | Modelo de linguagem para análise |
| **spaCy Model** | pt_core_news_lg | Modelo NLP em português |

---

## 📂 **Estrutura do Projeto**

```
autoU-email/
├── backend/                    # Servidor FastAPI
│   ├── main.py                # Router principal da API
│   ├── requirements.txt       # Dependências Python
│   ├── .env                   # Variáveis de ambiente (criar)
│   ├── .env.example           # Exemplo de configuração
│   └── utils/                 # Módulos utilitários
│       ├── ai_handler.py      # Integração Google Gemini
│       ├── file_handler.py    # Processamento de arquivos
│       └── nlp_processor.py   # Análise NLP com spaCy
│
├── frontend/                  # Aplicação React
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js            # Componente principal
│   │   ├── App.css           # Estilos globais
│   │   ├── index.js          # Entry point
│   │   ├── services/
│   │   │   └── api.js        # Cliente Axios
│   │   └── styles/           # CSS modular
│   │       ├── ClassifierCard.css
│   │       ├── ResultsCard.css
│   │       ├── Header.css
│   │       ├── Footer.css
│   │       ├── Metrics.css
│   │       ├── Table.css
│   │       ├── Layout.css
│   │       └── global.css
│   ├── package.json
│   └── .env                  # Variáveis de ambiente (criar)
│
├── data_example/              # Exemplos de emails
│   ├── productive_example_1.txt
│   └── unproductive_example_1.txt
│
└── README.md                  # Documentação
```

---

## 🔌 **API Endpoints**

### **Base URL**: `http://localhost:8000`

---

### **1. Analisar Email**

**POST** `/analyze`

#### **Request Body**
```json
{
  "text": "Prezada equipe, segue em anexo o boleto..."
}
```

#### **Response** (200 OK)
```json
{
  "classification": "PRODUTIVO",
  "confidence": 0.98,
  "justification": "O email solicita a segunda via de um boleto...",
  "suggestion": "Prezado Setor de Infraestrutura, recebido!...",
  "nlp_data": {
    "sentiment": "PRODUTIVO",
    "nlp_confidence": 1.0,
    "productive_signals": 3,
    "unproductive_signals": 0,
    "keywords": [
      {"word": "boleto", "count": 1},
      {"word": "contrato", "count": 1},
      {"word": "prazo", "count": 1}
    ]
  }
}
```

#### **Erros Possíveis**
```json
// 400 Bad Request
{
  "detail": "O campo 'text' é obrigatório e não pode estar vazio."
}

// 500 Internal Server Error
{
  "detail": "Erro ao processar a requisição: [mensagem]"
}
```

---

### **2. Health Check**

**GET** `/`

#### **Response** (200 OK)
```json
{
  "status": "OK",
  "message": "API de Classificação de Emails está funcionando!"
}
```

---

### **3. Documentação Interativa**

**GET** `/docs`  

---

## 🧪 **Testes**

### **Backend**

#### **Testar Integração Gemini**
```bash
cd backend
python test_gemini_full.py
```

#### **Testar NLP**
```bash
python test_nlp.py
```

#### **Testar API com cURL**
```bash
curl -X POST "http://localhost:8000/analyze" \
  -H "Content-Type: application/json" \
  -d '{"text":"Segue boleto em anexo. Prazo: 15/02/2026."}'
```

---

### **Frontend**

#### **Testes Manuais**
1. **Upload de arquivo > 5MB** → Deve exibir erro
2. **Upload de formato inválido** (`.docx`) → Deve rejeitar
3. **Texto vazio** → Botão "Analisar" desabilitado
4. **Análise com sucesso** → Card direito mostra resultado

#### **Verificar Build**
```bash
cd frontend
npm run build
# ou
yarn build
```

---

## 🤝 **Contribuindo**

Contribuições são bem-vindas! Siga os passos:

### **1. Fork o Projeto**
```bash
git clone https://github.com/seu-usuario/email-ai-classifier.git
cd email-ai-classifier
```

### **2. Crie uma Branch**
```bash
git checkout -b feature/nova-funcionalidade
```

### **3. Faça suas Alterações**
```bash
git add .
git commit -m "feat: adiciona nova funcionalidade X"
```

### **4. Push para o GitHub**
```bash
git push origin feature/nova-funcionalidade
```

### **5. Abra um Pull Request**
Vá para o GitHub e clique em **"Compare & pull request"**

---

## 📝 **Padrões de Commit**

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nova funcionalidade
fix: correção de bug
docs: alteração na documentação
style: formatação de código
refactor: refatoração
test: adição de testes
chore: tarefas de build/config
```

---

## 🐛 **Problemas Conhecidos**

### **1. Erro: "GEMINI_API_KEY não encontrada"**
**Solução**: Verifique se o arquivo `.env` está na pasta `backend/` e contém:
```env
GEMINI_API_KEY=sua_chave_aqui
```

### **2. Erro: "pt_core_news_lg não encontrado"**
**Solução**: Execute:
```bash
python -m spacy download pt_core_news_lg
```

### **3. CORS Error no Frontend**
**Solução**: Verifique se o backend está rodando e a URL em `frontend/.env` está correta:
```env
REACT_APP_API_URL=http://localhost:8000
```

### **4. Upload de PDF não funciona**
**Solução**: Certifique-se de que `PyPDF2` está instalado:
```bash
pip install PyPDF2==3.0.1
```

---

## 📈 **Roadmap**

### **Futuras Funcionalidades**
- [ ] Autenticação de usuários (JWT)
- [ ] Histórico de análises salvo em banco de dados
- [ ] Exportar relatórios em PDF/CSV
- [ ] Suporte a múltiplos idiomas (inglês, espanhol)
- [ ] Integração com Gmail API
- [ ] Dashboard avançado com gráficos (Chart.js)
- [ ] Modelo fine-tuned customizado
- [ ] Dark mode automático

---

## 🔒 **Segurança**

### **Boas Práticas Implementadas**
✅ Variáveis sensíveis em `.env` (não commitadas)  
✅ CORS configurado no FastAPI  
✅ Validação de tamanho de arquivo (5MB max)  
✅ Sanitização de inputs no backend  
✅ HTTPS recomendado em produção  

### **Recomendações de Produção**
- Use **HTTPS** (SSL/TLS)
- Configure **rate limiting** (ex: 100 req/min)
- Implemente **logs** estruturados
- Use **Docker** para deploy consistente
- Configure **variáveis de ambiente** no servidor

---

## 📄 **Licença**

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

```
MIT License

Copyright (c) 2026 Email AI Classifier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👨‍💻 **Autor**

**Lucas Castro**  
📧 Email: [lucascfsb@gmail.com](mailto:lucascfsb@gmail.com)  
🔗 GitHub: [@Lucascfsb](https://github.com/Lucascfsb/)  
💼 LinkedIn: [Lucas Castro](https://www.linkedin.com/in/lucas-castrof/)

---

## 🙏 **Agradecimentos**

- [Google Gemini](https://ai.google.dev/) - IA Generativa
- [spaCy](https://spacy.io/) - Processamento de Linguagem Natural
- [FastAPI](https://fastapi.tiangolo.com/) - Framework web moderno
- [React](https://reactjs.org/) - Biblioteca UI
- Comunidade open source 💙

---

## 📞 **Suporte**

Encontrou algum problema? Abra uma [issue](https://github.com/seu-usuario/email-ai-classifier/issues) no GitHub.

---

<div align="center">

**Feito com ❤️ e ☕ por Lucas Castro**

⭐ **Se este projeto foi útil, deixe uma estrela no GitHub!** ⭐

</div>
