import React from "react";
import { AnalysisResult } from "../../types";
import { EmptyState } from "./EmptyState";
import { ClassificationResult } from "./ClassificationResult";

interface ResultsCardProps {
  result: AnalysisResult | null;
  onCopySuggestion: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  result,
  onCopySuggestion,
}) => {
  return (
    <section className="card-panel">
      <div className="card-header pink-gradient">
        <h3>Resultados da Análise</h3>
        <p>Classificação e resposta automática gerada por IA</p>
      </div>
      <div className="card-body centered">
        {!result ? (
          <EmptyState />
        ) : (
          <ClassificationResult
            result={result}
            onCopySuggestion={onCopySuggestion}
          />
        )}
      </div>
    </section>
  );
};