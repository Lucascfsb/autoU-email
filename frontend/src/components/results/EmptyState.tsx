import React from "react";

export const EmptyState: React.FC = () => {
  return (
    <div className="empty-state">
      <div className="empty-icon-circle">📂</div>
      <h4>Nenhuma análise realizada</h4>
      <p>Envie um email para ver os resultados da classificação</p>
    </div>
  );
};