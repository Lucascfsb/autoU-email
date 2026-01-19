export interface AnalysisResult {
  classification: string;
  confidence: number;
  justification: string;
  suggestion: string;
  nlp_data?: {
    sentiment: string;
    nlp_confidence: number;
    productive_signals: number;
    unproductive_signals: number;
    keywords: Array<{ word: string; count: number }>;
  };
}

export interface EmailInputs {
  textContent: string;
  uploadedFile: File | null;
}

export interface AnalysisStatus {
  isLoading: boolean;
  analysisResult: AnalysisResult | null;
}

export type TabType = "text" | "file";