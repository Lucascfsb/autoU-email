import React from "react";
import { TabType } from "../../types";

interface TabSelectorProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  currentTab,
  onTabChange,
}) => {
  return (
    <div className="tab-selector">
      <button
        className={currentTab === "text" ? "active" : ""}
        onClick={() => onTabChange("text")}
      >
        ⌨️ Inserir Texto
      </button>
      <button
        className={currentTab === "file" ? "active" : ""}
        onClick={() => onTabChange("file")}
      >
        📁 Upload Arquivo
      </button>
    </div>
  );
};