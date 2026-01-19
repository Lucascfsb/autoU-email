import React from "react";

interface SuggestionBoxProps {
  suggestion: string;
  onCopy: () => void;
}

export const SuggestionBox: React.FC<SuggestionBoxProps> = ({
  suggestion,
  onCopy,
}) => {
  return (
    <>
      <div className="suggestion-box">
        <label>Sugestão de Resposta:</label>
        <div className="suggestion-text">{suggestion}</div>
      </div>

      <button className="btn-analyze" onClick={onCopy}>
        📋 Copiar para o clipboard
      </button>
    </>
  );
};