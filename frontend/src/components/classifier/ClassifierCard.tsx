import React from "react";
import { TabSelector } from "./TabSelector";
import { TextInput } from "./TextInput";
import { FileUpload } from "./FileUpload";
import { FileInfo } from "./FileInfo";
import { EmailInputs, TabType } from "../../types";

interface ClassifierCardProps {
  emailInputs: EmailInputs;
  currentTab: TabType;
  isLoading: boolean;
  onTabChange: (tab: TabType) => void;
  onTextChange: (text: string) => void;
  onFileSelect: (file: File | null) => void;
  onAnalyze: () => void;
}

export const ClassifierCard: React.FC<ClassifierCardProps> = ({
  emailInputs,
  currentTab,
  isLoading,
  onTabChange,
  onTextChange,
  onFileSelect,
  onAnalyze,
}) => {
  return (
    <section className="card-panel">
      <div className="card-header purple-gradient">
        <h3>Classificar Email</h3>
        <p>Envie seu email para análise e classificação automática</p>
      </div>

      <div className="card-body">
        <TabSelector currentTab={currentTab} onTabChange={onTabChange} />

        {currentTab === "text" ? (
          <TextInput
            value={emailInputs.textContent}
            onChange={onTextChange}
          />
        ) : (
          <>
            <FileUpload
              file={emailInputs.uploadedFile}
              onFileSelect={onFileSelect}
            />
            {emailInputs.uploadedFile && (
              <FileInfo file={emailInputs.uploadedFile} />
            )}
          </>
        )}

        <div className="info-box-tip">
          <span className="info-icon">ℹ️</span>
          <p>
            <strong>Dica de uso:</strong> Cole o texto completo para melhor
            precisão na classificação.
          </p>
        </div>

        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="btn-analyze"
        >
          {isLoading ? "Analisando..." : "⚡ Analisar Email"}
        </button>
      </div>
    </section>
  );
};