import { useState } from "react";
import "./App.css";
import { analyzeEmail } from "./services/api";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { WelcomeBanner } from "./components/layout/WelcomeBanner";
import { MetricsGrid } from "./components/metrics/MetricsGrid";
import { ClassifierCard } from "./components/classifier/ClassifierCard";
import { ResultsCard } from "./components/results/ResultsCard";
import { RecentAnalysesTable } from "./components/table/RecentAnalysesTable";
import { EmailInputs, AnalysisStatus, TabType } from "./types/index";

function App() {
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
    if (currentInputTab === "text" && !emailInputs.textContent) {
      alert("Digite o texto do e-mail.");
      return false;
    }

    if (currentInputTab === "file" && !emailInputs.uploadedFile) {
      alert("Selecione um arquivo.");
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

  return (
    <div className="app-wrapper">
      <Header />

      <div className="container">
        <WelcomeBanner />
        <MetricsGrid />

        <main className="main-content-grid">
          <ClassifierCard
            emailInputs={emailInputs}
            currentTab={currentInputTab}
            isLoading={analysisStatus.isLoading}
            onTabChange={handleTabChange}
            onTextChange={handleTextChange}
            onFileSelect={handleFileSelect}
            onAnalyze={handleAnalyze}
          />

          <ResultsCard
            result={analysisStatus.analysisResult}
            onCopySuggestion={handleCopySuggestion}
          />
        </main>

        <RecentAnalysesTable />
      </div>

      <Footer />
    </div>
  );
}

export default App;