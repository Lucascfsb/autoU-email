import { useState } from "react";
import { analyzeEmail } from "../services/api";
import { EmailInputs, AnalysisStatus, TabType, AnalysisResult } from "../types";

export const useEmailAnalyzer = () => {
  const [emailInputs, setEmailInputs] = useState<EmailInputs>({
    textContent: "",
    uploadedFile: null,
  });

  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>({
    isLoading: false,
    analysisResult: null,
  });

  const [currentInputTab, setCurrentInputTab] = useState<TabType>("text");

  const handleTabChange = (tab: TabType) => {
    setCurrentInputTab(tab);
  };

  const handleTextChange = (text: string) => {
    setEmailInputs({ ...emailInputs, textContent: text });
  };

  const handleFileSelect = (file: File | null) => {
    setEmailInputs({ ...emailInputs, uploadedFile: file });
  };

  const validateInputs = (): boolean => {
    if (currentInputTab === "text" && !emailInputs.textContent.trim()) {
      alert("⚠️ Digite o texto do e-mail.");
      return false;
    }

    if (currentInputTab === "file" && !emailInputs.uploadedFile) {
      alert("⚠️ Selecione um arquivo.");
      return false;
    }

    return true;
  };

  const handleAnalyze = async () => {
    if (!validateInputs()) return;

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
      alert((error as Error).message);
      setAnalysisStatus({
        isLoading: false,
        analysisResult: null,
      });
    }
  };

  const handleCopySuggestion = () => {
    const suggestion = analysisStatus.analysisResult?.suggestion;
    if (suggestion) {
      navigator.clipboard.writeText(suggestion);
      alert("✅ Resposta copiada para a área de transferência!");
    }
  };

  const resetForm = () => {
    setEmailInputs({
      textContent: "",
      uploadedFile: null,
    });
    setAnalysisStatus({
      isLoading: false,
      analysisResult: null,
    });
  };

  return {
    emailInputs,
    analysisStatus,
    currentInputTab,
    handleTabChange,
    handleTextChange,
    handleFileSelect,
    handleAnalyze,
    handleCopySuggestion,
    resetForm,
  };
};