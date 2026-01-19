import React from "react";

interface ConfidenceMeterProps {
  confidence: number;
}

export const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({
  confidence,
}) => {
  const getColor = () => {
    if (confidence >= 0.8) return "#22c55e";
    if (confidence >= 0.6) return "#eab308";
    return "#ef4444";
  };

  return (
    <div className="confidence-meter">
      <label>Confiança da Classificação</label>
      <div className="confidence-bar-container">
        <div
          className="confidence-bar-fill"
          style={{
            width: `${confidence * 100}%`,
            backgroundColor: getColor(),
          }}
        />
      </div>
      <span className="confidence-value">{(confidence * 100).toFixed(0)}%</span>
    </div>
  );
};