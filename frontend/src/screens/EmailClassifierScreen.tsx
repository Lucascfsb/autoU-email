import React from "react";
import { useEmailAnalyzer } from "../hooks/useEmailAnalyzer";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { WelcomeBanner } from "../components/layout/WelcomeBanner";
import { MetricsGrid } from "../components/metrics/MetricsGrid";
import { ClassifierCard } from "../components/classifier/ClassifierCard";
import { ResultsCard } from "../components/results/ResultsCard";
import { RecentAnalysesTable } from "../components/table/RecentAnalysesTable";

export const EmailClassifierScreen: React.FC = () => {
  const {
    emailInputs,
    analysisStatus,
    currentInputTab,
    handleTabChange,
    handleTextChange,
    handleFileSelect,
    handleAnalyze,
    handleCopySuggestion,
  } = useEmailAnalyzer();

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
};