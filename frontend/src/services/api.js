const API_URL = process.env.REACT_APP_API_URL;

export const analyzeEmail = async (text, file) => {
  const formData = new FormData();
  
  if (text) formData.append('text', text);
  if (file) formData.append('file', file);

  const response = await fetch(`${API_URL}/to_analyze_email`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Falha na comunicação com o servidor');
  }

  return response.json();
};