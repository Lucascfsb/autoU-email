import React from "react";

interface MetricCardProps {
  icon: string;
  value: string;
  growth: string;
  label: string;
  iconBg: string;
  growthColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  growth,
  label,
  iconBg,
  growthColor,
}) => {
  return (
    <div className="metric-card">
      <div className={`metric-icon-bg ${iconBg}`}>{icon}</div>
      <div className="metric-info">
        <div className="metric-header">
          <h3>{value}</h3>
          <span className={`growth-tag ${growthColor}`}>{growth}</span>
        </div>
        <p>{label}</p>
      </div>
    </div>
  );
};