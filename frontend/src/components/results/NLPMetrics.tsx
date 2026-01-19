import React from "react";
import { AnalysisResult } from "../../types";

interface NLPMetricsProps {
  nlpData: NonNullable<AnalysisResult["nlp_data"]>;
}

export const NLPMetrics: React.FC<NLPMetricsProps> = ({ nlpData }) => {
  return (
    <div className="nlp-metrics">
      <h4>📊 Análise Técnica (NLP)</h4>

      <div className="nlp-stats-grid">
        <div className="nlp-stat">
          <span className="nlp-stat-label">Sentimento NLP</span>
          <span
            className={`nlp-stat-value ${nlpData.sentiment.toLowerCase()}`}
          >
            {nlpData.sentiment}
          </span>
        </div>

        <div className="nlp-stat">
          <span className="nlp-stat-label">Confiança NLP</span>
          <span className="nlp-stat-value">
            {(nlpData.nlp_confidence * 100).toFixed(0)}%
          </span>
        </div>

        <div className="nlp-stat">
          <span className="nlp-stat-label">Sinais Produtivos</span>
          <span className="nlp-stat-value green">
            {nlpData.productive_signals}
          </span>
        </div>

        <div className="nlp-stat">
          <span className="nlp-stat-label">Sinais Improdutivos</span>
          <span className="nlp-stat-value yellow">
            {nlpData.unproductive_signals}
          </span>
        </div>
      </div>

      <div className="keywords-section">
        <label>🔑 Palavras-chave Identificadas</label>
        <div className="keywords-list">
          {nlpData.keywords.slice(0, 8).map((kw, idx) => (
            <span key={idx} className="keyword-tag">
              {kw.word} ({kw.count})
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};