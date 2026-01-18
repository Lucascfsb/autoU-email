import { useState, useRef } from "react";
import "./App.css";
import { analyzeEmail } from "./services/api";

function App() {
  const [emailInputs, setEmailInputs] = useState({
    textContent: "",
    uploadedFile: null,
  });

  const fileInputRef = useRef(null);

  const [analysisStatus, setAnalysisStatus] = useState({
    isLoading: false,
    analysisResult: null,
  });

  const [currentInputTab, setCurrentInputTab] = useState("text");

  const [isFileDragging, setIsFileDragging] = useState(false);

  const triggerFileSelectPopup = () => {
    fileInputRef.current.click();
  };

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

  const handleFileDropInZone = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsFileDragging(false);

    const droppedFiles = event.dataTransfer.files;
    const hasDroppedFile = droppedFiles && droppedFiles.length > 0;

    if (hasDroppedFile) {
      const selectedFile = droppedFiles[0];

      // VALIDAÇÃO: Tamanho do arquivo (5MB)
      const MAX_SIZE = 5 * 1024 * 1024;
      if (selectedFile.size > MAX_SIZE) {
        alert("⚠️ Arquivo muito grande! Tamanho máximo: 5MB");
        return;
      }

      // VALIDAÇÃO: Formato do arquivo
      const allowedFormats = [".txt", ".pdf"];
      const fileName = selectedFile.name.toLowerCase();
      const isValidFormat = allowedFormats.some((format) =>
        fileName.endsWith(format),
      );

      if (!isValidFormat) {
        alert("⚠️ Formato inválido! Use apenas .txt ou .pdf");
        return;
      }

      setEmailInputs({ ...emailInputs, uploadedFile: selectedFile });
    }
  };

  const handleFileSelection = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      // VALIDAÇÃO: Tamanho do arquivo (5MB)
      const MAX_SIZE = 5 * 1024 * 1024;
      if (selectedFile.size > MAX_SIZE) {
        alert("⚠️ Arquivo muito grande! Tamanho máximo: 5MB");
        event.target.value = ""; // Limpa o input
        return;
      }

      setEmailInputs({ ...emailInputs, uploadedFile: selectedFile });
    }
  };

  const handleTextContentChange = (event) => {
    const newTextContent = event.target.value;
    setEmailInputs({ ...emailInputs, textContent: newTextContent });
  };

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
      // Mostra a mensagem de erro específica da API
      alert(error.message);

      setAnalysisStatus({
        isLoading: false,
        analysisResult: null,
      });
    }
  };

  const handleCopySuggestedResponse = () => {
    const suggestedResponse = analysisStatus.analysisResult?.suggestion;
    if (suggestedResponse) {
      navigator.clipboard.writeText(suggestedResponse);
      alert("✅ Resposta copiada para a área de transferência!");
    }
  };

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
              <span className="user-name">Usuário</span>
              <span className="user-role">Admin</span>
            </div>
            <div className="user-avatar">US</div>
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
                <span className="growth-tag green-text">12%</span>
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
                <>
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
                      accept=".txt,.pdf"
                      onChange={handleFileSelection}
                      className="file-input-hidden"
                    />
                    <label className="file-drop-label">
                      {emailInputs.uploadedFile
                        ? `✅ ${emailInputs.uploadedFile.name} (${(emailInputs.uploadedFile.size / 1024).toFixed(2)} KB)`
                        : "📁 Clique para selecionar ou arraste o arquivo aqui"}
                    </label>
                    <small
                      style={{
                        color: "#666",
                        fontSize: "12px",
                        marginTop: "8px",
                      }}
                    >
                      📎 Formatos: .txt ou .pdf • Tamanho máximo: 5MB
                    </small>
                  </div>

                  {emailInputs.uploadedFile && (
                    <div className="content-analysis-panel">
                      <div className="text-statistics">
                        <h4>📊 Informações do Arquivo</h4>
                        <div className="stats-grid">
                          <div className="stat-item">
                            <span className="stat-label">Nome</span>
                            <span
                              className="stat-value"
                              style={{ fontSize: "14px" }}
                            >
                              {emailInputs.uploadedFile.name.length > 20
                                ? emailInputs.uploadedFile.name.substring(
                                    0,
                                    20,
                                  ) + "..."
                                : emailInputs.uploadedFile.name}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Tamanho</span>
                            <span className="stat-value">
                              {(emailInputs.uploadedFile.size / 1024).toFixed(
                                1,
                              )}{" "}
                              KB
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Formato</span>
                            <span className="stat-value">
                              {emailInputs.uploadedFile.name
                                .split(".")
                                .pop()
                                .toUpperCase()}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Status</span>
                            <span
                              className="stat-value"
                              style={{ color: "#22c55e", fontSize: "16px" }}
                            >
                              ✓ Pronto
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="helpful-tips">
                        <h4>💡 O que a IA Analisará</h4>
                        <ul>
                          <li>
                            <span className="tip-icon">🔍</span>
                            <span>
                              Palavras-chave relacionadas a trabalho e
                              documentos
                            </span>
                          </li>
                          <li>
                            <span className="tip-icon">🎯</span>
                            <span>
                              Tom da mensagem (formal, urgente, casual)
                            </span>
                          </li>
                          <li>
                            <span className="tip-icon">📊</span>
                            <span>Presença de prazos, números e anexos</span>
                          </li>
                          <li>
                            <span className="tip-icon">⚡</span>
                            <span>Contexto e intenção da comunicação</span>
                          </li>
                        </ul>
                      </div>

                      <div className="ready-indicator">
                        <div className="ready-icon">✅</div>
                        <div className="ready-text">
                          <strong>Arquivo Carregado com Sucesso</strong>
                          <span>
                            Clique em "Analisar Email" para processar o conteúdo
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
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
                    className={`result-badge ${analysisStatus.analysisResult.classification.toLowerCase()}`}
                  >
                    {analysisStatus.analysisResult.classification}
                  </div>

                  <div className="confidence-meter">
                    <label>Confiança da Classificação</label>
                    <div className="confidence-bar-container">
                      <div
                        className="confidence-bar-fill"
                        style={{
                          width: `${analysisStatus.analysisResult.confidence * 100}%`,
                          backgroundColor:
                            analysisStatus.analysisResult.confidence >= 0.8
                              ? "#22c55e"
                              : analysisStatus.analysisResult.confidence >= 0.6
                                ? "#eab308"
                                : "#ef4444",
                        }}
                      />
                    </div>
                    <span className="confidence-value">
                      {(analysisStatus.analysisResult.confidence * 100).toFixed(
                        0,
                      )}
                      %
                    </span>
                  </div>

                  {analysisStatus.analysisResult.justification && (
                    <div className="justification-box">
                      <label>💡 Por que foi classificado assim?</label>
                      <p>{analysisStatus.analysisResult.justification}</p>
                    </div>
                  )}

                  {analysisStatus.analysisResult.nlp_data && (
                    <div className="nlp-metrics">
                      <h4>📊 Análise Técnica (NLP)</h4>

                      <div className="nlp-stats-grid">
                        <div className="nlp-stat">
                          <span className="nlp-stat-label">Sentimento NLP</span>
                          <span
                            className={`nlp-stat-value ${analysisStatus.analysisResult.nlp_data.sentiment.toLowerCase()}`}
                          >
                            {analysisStatus.analysisResult.nlp_data.sentiment}
                          </span>
                        </div>

                        <div className="nlp-stat">
                          <span className="nlp-stat-label">Confiança NLP</span>
                          <span className="nlp-stat-value">
                            {(
                              analysisStatus.analysisResult.nlp_data
                                .nlp_confidence * 100
                            ).toFixed(0)}
                            %
                          </span>
                        </div>

                        <div className="nlp-stat">
                          <span className="nlp-stat-label">
                            Sinais Produtivos
                          </span>
                          <span className="nlp-stat-value green">
                            {
                              analysisStatus.analysisResult.nlp_data
                                .productive_signals
                            }
                          </span>
                        </div>

                        <div className="nlp-stat">
                          <span className="nlp-stat-label">
                            Sinais Improdutivos
                          </span>
                          <span className="nlp-stat-value yellow">
                            {
                              analysisStatus.analysisResult.nlp_data
                                .unproductive_signals
                            }
                          </span>
                        </div>
                      </div>

                      <div className="keywords-section">
                        <label>🔑 Palavras-chave Identificadas</label>
                        <div className="keywords-list">
                          {analysisStatus.analysisResult.nlp_data.keywords
                            .slice(0, 8)
                            .map((kw, idx) => (
                              <span key={idx} className="keyword-tag">
                                {kw.word} ({kw.count})
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="suggestion-box">
                    <label>Sugestão de Resposta:</label>
                    <div className="suggestion-text">
                      {analysisStatus.analysisResult.suggestion}
                    </div>
                  </div>

                  <button
                    className="btn-analyze"
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
