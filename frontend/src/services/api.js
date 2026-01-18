const API_URL = process.env.REACT_APP_API_URL;
const TIMEOUT_MS = 30000; // 30 segundos

export const analyzeEmail = async (text, file) => {
  const formData = new FormData();
  
  if (text) formData.append('text', text);
  if (file) formData.append('file', file);

  // ✅ Cria AbortController para timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${API_URL}/to_analyze_email`, {
      method: 'POST',
      body: formData,
      signal: controller.signal, // ✅ Conecta ao timeout
    });

    clearTimeout(timeoutId); // ✅ Cancela timeout se responder

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 413) {
        throw new Error('⚠️ Arquivo muito grande! Tamanho máximo: 5MB');
      }
      
      if (response.status === 400) {
        throw new Error(`⚠️ ${errorData.detail || 'Dados inválidos'}`);
      }
      
      if (response.status === 500) {
        throw new Error('❌ Erro no servidor. Tente novamente em alguns instantes.');
      }
      
      throw new Error(errorData.detail || 'Falha na comunicação com o servidor');
    }

    return response.json();
    
  } catch (error) {
    clearTimeout(timeoutId);
    
    // ✅ Trata timeout especificamente
    if (error.name === 'AbortError') {
      throw new Error('⏱️ Tempo esgotado. O servidor demorou muito para responder.');
    }
    
    // ✅ Trata erro de rede
    if (error.message === 'Failed to fetch') {
      throw new Error('🌐 Sem conexão com o servidor. Verifique sua internet.');
    }
    
    throw error; // Outros erros
  }
};