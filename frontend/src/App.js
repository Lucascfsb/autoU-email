import { useState, useRef } from "react";
import "./App.css";
import { analyzeEmail } from "./services/api";

function App() {
  // Estado para inputs do usuário
  const [emailInputs, setEmailInputs] = useState({
    textContent: "",
    uploadedFile: null,
  });

  const fileInputRef = useRef(null);

  // Estado para controle de análise
  const [analysisStatus, setAnalysisStatus] = useState({
    isLoading: false,
    analysisResult: null,
  });

  // Estado para controle de tabs
  const [currentInputTab, setCurrentInputTab] = useState("text");

  // Estado para controle de drag and drop
  const [isFileDragging, setIsFileDragging] = useState(false);

  const triggerFileSelectPopup = () => {
    fileInputRef.current.click();
  };

  // Handler para eventos de arrastar arquivo
  const handleFileDragEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isEnteringOrOverDragZone =
      event.type === "dragenter" || event.type === "dragover";
    const isLeavingDragZone = event.type === "dragleave";

    if (isEnteringOrOverDragZone) {
      setIsFileDragging(true);
    } else if (isLeavingDragZone) {
      setIsFileDragging(false);
    }
  };

  // Handler para soltar arquivo na zona de drop
  const handleFileDropInZone = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsFileDragging(false);

    const droppedFiles = event.dataTransfer.files;
    const hasDroppedFile = droppedFiles && droppedFiles.length > 0;

    if (hasDroppedFile) {
      const selectedFile = droppedFiles[0];
      setEmailInputs({ ...emailInputs, uploadedFile: selectedFile });
    }
  };

  // Handler para seleção manual de arquivo
  const handleFileSelection = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setEmailInputs({ ...emailInputs, uploadedFile: selectedFile });
    }
  };

  // Handler para mudança de texto
  const handleTextContentChange = (event) => {
    const newTextContent = event.target.value;
    setEmailInputs({ ...emailInputs, textContent: newTextContent });
  };

  // Validação de inputs
  const validateEmailInputs = () => {
    const isTextTabActive = currentInputTab === "text";
    const isFileTabActive = currentInputTab === "file";

    if (isTextTabActive && !emailInputs.textContent) {
      alert("Digite o texto do e-mail.");
      return false;
    }

    if (isFileTabActive && !emailInputs.uploadedFile) {
      alert("Selecione um arquivo.");
      return false;
    }

    return true;
  };

  // Função principal de análise de email
  const handleEmailAnalysisSubmission = async () => {
    const isInputValid = validateEmailInputs();
    if (!isInputValid) return;

    setAnalysisStatus({ isLoading: true, analysisResult: null });

    try {
      const isTextMode = currentInputTab === "text";
      const textToAnalyze = isTextMode ? emailInputs.textContent : "";
      const fileToAnalyze = isTextMode ? null : emailInputs.uploadedFile;

      const analysisData = await analyzeEmail(textToAnalyze, fileToAnalyze);

      setAnalysisStatus({
        isLoading: false,
        analysisResult: analysisData,
      });
    } catch (error) {
      const errorMessage =
        "Falha na comunicação com o servidor. Verifique se o backend está rodando.";
      alert(errorMessage);

      setAnalysisStatus({
        isLoading: false,
        analysisResult: null,
      });
    }
  };

  // Handler para copiar resposta sugerida
  const handleCopySuggestedResponse = () => {
    const suggestedResponse = analysisStatus.analysisResult?.suggestion;
    if (suggestedResponse) {
      navigator.clipboard.writeText(suggestedResponse);
    }
  };

  // Handler para trocar tab
  const handleTabChange = (tabName) => {
    setCurrentInputTab(tabName);
  };

  return (
    <div className="app-wrapper">
      <header className="main-header">
        <div className="header-left">
          <div className="logo-box">
            <div className="logo-icon">🧠</div>
            <div className="logo-text">
              <h2>Email AI Classifier</h2>
              <p>Classificação inteligente de emails</p>
            </div>
          </div>
        </div>

        <div className="header-right">
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">Lucas Castro</span>
              <span className="user-role">Admin</span>
            </div>
            <div className="user-avatar">LC</div>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="welcome-banner">
          <h1>🛡️ Painel de Triagem</h1>
          <h2>
            Utilize IA para classificar comunicações oficiais com precisão.
          </h2>
        </div>

        <section className="metrics-grid">
          <div className="metric-card">
            <div className="metric-icon-bg blue-bg">✉️</div>
            <div className="metric-info">
              <div className="metric-header">
                <h3>1,247</h3>
                <span className="growth-tag green-text">+12%</span>
              </div>
              <p>Emails Processados</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-bg green-bg">✔️</div>
            <div className="metric-info">
              <div className="metric-header">
                <h3>848</h3>
                <span className="growth-tag green-text">68%</span>
              </div>
              <p>Produtivos</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-bg yellow-bg">🕒</div>
            <div className="metric-info">
              <div className="metric-header">
                <h3>399</h3>
                <span className="growth-tag orange-text">32%</span>
              </div>
              <p>Improdutivos</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-bg purple-bg">🤖</div>
            <div className="metric-info">
              <div className="metric-header">
                <h3>1,228</h3>
                <span className="growth-tag orange-text">98.5%</span>
              </div>
              <p>Respostas Geradas</p>
            </div>
          </div>
        </section>

        <main className="main-content-grid">
          <section className="card-panel">
            <div className="card-header purple-gradient">
              <h3>Classificar Email</h3>
              <p>Envie seu email para análise e classificação automática</p>
            </div>

            <div className="card-body">
              <div className="tab-selector">
                <button
                  className={currentInputTab === "text" ? "active" : ""}
                  onClick={() => handleTabChange("text")}
                >
                  ⌨️ Inserir Texto
                </button>
                <button
                  className={currentInputTab === "file" ? "active" : ""}
                  onClick={() => handleTabChange("file")}
                >
                  📁 Upload Arquivo
                </button>
              </div>

              {currentInputTab === "text" ? (
                <div className="input-group">
                  <label>Conteúdo do Email</label>
                  <textarea
                    placeholder="Cole ou digite o conteúdo do email aqui..."
                    value={emailInputs.textContent}
                    onChange={handleTextContentChange}
                  />
                </div>
              ) : (
                <div
                  className={`file-drop-zone ${isFileDragging ? "dragging" : ""}`}
                  onDragEnter={handleFileDragEvent}
                  onDragLeave={handleFileDragEvent}
                  onDragOver={handleFileDragEvent}
                  onDrop={handleFileDropInZone}
                  onClick={triggerFileSelectPopup}
                >
                  <input
                    type="file"
                    id="file-upload"
                    ref={fileInputRef}
                    accept=".eml,.msg,.txt,.pdf"
                    onChange={handleFileSelection}
                    className="file-input-hidden"
                  />
                  <label htmlFor="file-upload" className="file-drop-label">
                    {emailInputs.uploadedFile
                      ? `✅ ${emailInputs.uploadedFile.name}`
                      : "📁 Clique para selecionar ou arraste o arquivo aqui"}
                  </label>
                </div>
              )}

              <div className="info-box-tip">
                <span className="info-icon">ℹ️</span>
                <p>
                  <strong>Dica de uso:</strong> Cole o texto completo para
                  melhor precisão na classificação.
                </p>
              </div>

              <button
                onClick={handleEmailAnalysisSubmission}
                disabled={analysisStatus.isLoading}
                className="btn-analyze"
              >
                {analysisStatus.isLoading
                  ? "Analisando..."
                  : "⚡ Analisar Email"}
              </button>
            </div>
          </section>

          <section className="card-panel">
            <div className="card-header pink-gradient">
              <h3>Resultados da Análise</h3>
              <p>Classificação e resposta automática gerada por IA</p>
            </div>
            <div className="card-body centered">
              {!analysisStatus.analysisResult ? (
                <div className="empty-state">
                  <div className="empty-icon-circle">📂</div>
                  <h4>Nenhuma análise realizada</h4>
                  <p>Envie um email para ver os resultados da classificação</p>
                  <div className="trust-badges">
                    <span>✔️ IA Avançada</span>
                    <span>⚡ Resposta Rápida</span>
                  </div>
                </div>
              ) : (
                <div className="result-content">
                  <div 
                    className={`result-badge ${
                      analysisStatus.analysisResult.classification.toLowerCase()
                    }`}
                  >
                    {analysisStatus.analysisResult.classification}
                  </div>

                  <div className="suggestion-box">
                    <label>Sugestão de Resposta:</label>
                    <div className="suggestion-text">
                      {analysisStatus.analysisResult.suggestion}
                    </div>
                  </div>

                  <button
                    className="btn-copy"
                    onClick={handleCopySuggestedResponse}
                  >
                    📋 Copiar para o clipboard
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>

        <section className="recent-analyses">
          <div className="section-header">
            <h2>Análises Recentes</h2>
            <button className="btn-text">Ver todos →</button>
          </div>
          <table className="custom-table">
            <thead>
              <tr>
                <th>DATA/HORA</th>
                <th>ASSUNTO</th>
                <th>CLASSIFICAÇÃO</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>17/01/2026</td>
                <td>Solicitação de Suporte</td>
                <td>
                  <span className="badge green">Produtivo</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>

      <footer className="main-footer">
        <div className="footer-left">
          <div className="logo-icon-small">🧠</div>
          <span>Email AI Classifier © 2026</span>
        </div>
        <nav className="footer-links">
          <span>Documentação</span>
          <span>API</span>
          <span>Suporte</span>
        </nav>
      </footer>
    </div>
  );
}

export default App;
