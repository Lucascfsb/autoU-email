import { useState } from 'react';
import './App.css';
import { analyzeEmail } from './services/api';

function App() {
  const [inputs, setInputs] = useState({ text: '', file: null });
  const [status, setStatus] = useState({ loading: false, resultado: null });

  const handleSubmit = async () => {
    if (!inputs.text && !inputs.file) {
      return alert("Por favor, digite um texto ou selecione um arquivo.");
    }

    setStatus({ loading: true, resultado: null });
    
    try {
      const data = await analyzeEmail(inputs.text, inputs.file);
      setStatus({ loading: false, resultado: data });
    } catch (error) {
      console.error(error);
      alert(error.message);
      setStatus({ ...status, loading: false });
    }
  };

  return (
    <div className="container">
      <h1>🛡️ Classificador de E-mails</h1>
      
      <div className="input-section">
        <textarea 
          placeholder="Cole o e-mail aqui..."
          value={inputs.text}
          onChange={(e) => setInputs({ ...inputs, text: e.target.value })}
        />
        
        <p>OU</p>
        
        <input 
          type="file" 
          accept=".txt,.pdf" 
          onChange={(e) => setInputs({ ...inputs, file: e.target.files[0] })} 
        />
      </div>

      <button onClick={handleSubmit} disabled={status.loading} className="btn-executar">
        {status.loading ? "Analisando..." : "🚀 Executar Triagem"}
      </button>

      {status.resultado && (
        <div className={`result-card border-${status.resultado.cor}`}>
          <h3 className={`title-${status.resultado.cor}`}>
            {status.resultado.classificacao}
          </h3>
          <p><strong>Sugestão de Resposta:</strong></p>
          <p className="suggestion-text">"{status.resultado.sugestao}"</p>
        </div>
      )}
    </div>
  );
}

export default App;