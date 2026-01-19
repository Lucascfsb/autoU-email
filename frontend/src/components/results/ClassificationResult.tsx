import React from "react";
import { AnalysisResult } from "../../types";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { NLPMetrics } from "./NLPMetrics";
import { SuggestionBox } from "./SuggestionBox";

interface ClassificationResultProps {
  result: AnalysisResult;
  onCopySuggestion: () => void;
}

export const ClassificationResult: React.FC<ClassificationResultProps> = ({
  result,
  onCopySuggestion,
}) => {
  return (
    <div className="result-content">
      <div className={`result-badge ${result.classification.toLowerCase()}`}>
        {result.classification}
      </div>

      <ConfidenceMeter confidence={result.confidence} />

      {result.justification && (
        <div className="justification-box">
          <label>💡 Por que foi classificado assim?</label>
          <p>{result.justification}</p>
        </div>
      )}

      {result.nlp_data && <NLPMetrics nlpData={result.nlp_data} />}

      <SuggestionBox
        suggestion={result.suggestion}
        onCopy={onCopySuggestion}
      />
    </div>
  );
};