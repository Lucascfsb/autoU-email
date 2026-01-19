import React, { useRef, useState } from "react";

interface FileUploadProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  file,
  onFileSelect,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (selectedFile: File): boolean => {
    const MAX_SIZE = 5 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      alert("⚠️ Arquivo muito grande! Tamanho máximo: 5MB");
      return false;
    }

    const allowedFormats = [".txt", ".pdf"];
    const fileName = selectedFile.name.toLowerCase();
    const isValidFormat = allowedFormats.some((format) =>
      fileName.endsWith(format)
    );

    if (!isValidFormat) {
      alert("⚠️ Formato inválido! Use apenas .txt ou .pdf");
      return false;
    }

    return true;
  };

  const handleDragEvent = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
      if (droppedFiles && droppedFiles.length > 0) {
      const selectedFile = droppedFiles[0];
      // ✅ Adiciona verificação se selectedFile existe
      if (selectedFile && validateFile(selectedFile)) {
        onFileSelect(selectedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      onFileSelect(selectedFile);
    } else {
      e.target.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`file-drop-zone ${isDragging ? "dragging" : ""}`}
      onDragEnter={handleDragEvent}
      onDragLeave={handleDragEvent}
      onDragOver={handleDragEvent}
      onDrop={handleDrop}
      onClick={triggerFileSelect}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept=".txt,.pdf"
        onChange={handleFileChange}
        className="file-input-hidden"
      />
      <label className="file-drop-label">
        {file
          ? `✅ ${file.name} (${(file.size / 1024).toFixed(2)} KB)`
          : "📁 Clique para selecionar ou arraste o arquivo aqui"}
      </label>
      <small style={{ color: "#666", fontSize: "12px", marginTop: "8px" }}>
        📎 Formatos: .txt ou .pdf • Tamanho máximo: 5MB
      </small>
    </div>
  );
};