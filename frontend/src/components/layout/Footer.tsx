import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="main-footer">
      <div className="footer-left">
        <div className="logo-icon-small">🧠</div>
        <span>Email AI Classifier © 2026</span>
      </div>
      <nav className="footer-links">
        <a href="https://github.com/Lucascfsb/autoU-email#readme" target="_blank" rel="noopener noreferrer">
          Documentação
        </a>
        <a href="https://autou-email.onrender.com/docs" target="_blank" rel="noopener noreferrer">
          API
        </a>
        <a href="https://github.com/Lucascfsb/autoU-email/" target="_blank" rel="noopener noreferrer">
          Suporte
        </a>
      </nav>
    </footer>
  );
};