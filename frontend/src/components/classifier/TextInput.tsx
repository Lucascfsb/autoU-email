import React from "react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange }) => {
  return (
    <div className="input-group">
      <label>Conteúdo do Email</label>
      <textarea
        placeholder="Cole ou digite o conteúdo do email aqui..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};