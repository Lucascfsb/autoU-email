import React from "react";
import { MetricCard } from "./MetricCard";

export const MetricsGrid: React.FC = () => {
  const metrics = [
    {
      icon: "✉️",
      value: "1,247",
      growth: "12%",
      label: "Emails Processados",
      iconBg: "blue-bg",
      growthColor: "green-text",
    },
    {
      icon: "✔️",
      value: "848",
      growth: "68%",
      label: "Produtivos",
      iconBg: "green-bg",
      growthColor: "green-text",
    },
    {
      icon: "🕒",
      value: "399",
      growth: "32%",
      label: "Improdutivos",
      iconBg: "yellow-bg",
      growthColor: "orange-text",
    },
    {
      icon: "🤖",
      value: "1,228",
      growth: "98.5%",
      label: "Respostas Geradas",
      iconBg: "purple-bg",
      growthColor: "orange-text",
    },
  ];

  return (
    <section className="metrics-grid">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </section>
  );
};