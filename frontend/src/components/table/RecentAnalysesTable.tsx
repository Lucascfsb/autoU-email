import React from "react";

export const RecentAnalysesTable: React.FC = () => {
  return (
    <section className="recent-analyses">
      <div className="section-header">
        <h2>Análises Recentes</h2>
        <button className="btn-text">Ver todos →</button>
      </div>
      <table className="custom-table">
        <thead>
          <tr>
            <th>DATA/HORA</th>
            <th>ASSUNTO</th>
            <th>CLASSIFICAÇÃO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>17/01/2026</td>
            <td>Solicitação de Suporte</td>
            <td>
              <span className="badge green">Produtivo</span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
};