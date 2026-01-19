import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="main-header">
      <div className="header-left">
        <div className="logo-box">
          <div className="logo-icon">🧠</div>
          <div className="logo-text">
            <h2>Email AI Classifier</h2>
            <p>Classificação inteligente de emails</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Usuário</span>
            <span className="user-role">Admin</span>
          </div>
          <div className="user-avatar">US</div>
        </div>
      </div>
    </header>
  );
};