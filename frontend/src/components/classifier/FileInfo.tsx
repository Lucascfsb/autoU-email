import React from "react";

interface FileInfoProps {
  file: File;
}

export const FileInfo: React.FC<FileInfoProps> = ({ file }) => {
  return (
    <div className="content-analysis-panel">
      <div className="text-statistics">
        <h4>📊 Informações do Arquivo</h4>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Nome</span>
            <span className="stat-value" style={{ fontSize: "14px" }}>
              {file.name.length > 20
                ? file.name.substring(0, 20) + "..."
                : file.name}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Tamanho</span>
            <span className="stat-value">
              {(file.size / 1024).toFixed(1)} KB
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Formato</span>
            <span className="stat-value">
              {file.name.split(".").pop()?.toUpperCase()}
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
            <span>Palavras-chave relacionadas a trabalho e documentos</span>
          </li>
          <li>
            <span className="tip-icon">🎯</span>
            <span>Tom da mensagem (formal, urgente, casual)</span>
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
          <span>Clique em "Analisar Email" para processar o conteúdo</span>
        </div>
      </div>
    </div>
  );
};