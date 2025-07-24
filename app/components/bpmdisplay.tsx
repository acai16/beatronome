import React, { useState, useRef, useEffect } from "react";

interface BpmDisplayProps {
  bpm: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

const BpmDisplay: React.FC<BpmDisplayProps> = ({ bpm, min = 10, max = 240, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(bpm.toString());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(bpm.toString());
  }, [bpm]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue)) {
      const clampedValue = Math.max(min, Math.min(max, numValue));
      onChange(clampedValue);
    } else {
      setInputValue(bpm.toString());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setInputValue(bpm.toString());
    }
  };

  if (isEditing) {
    return (
      <div
        style={{
          background: "#fff8ec",
          borderRadius: "16px",
          boxShadow: "inset 0 2px 12px #b0b0b0, 0 1px 4px #b0b0b033",
          border: "2px solid #000",
          padding: "1.2rem 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "120px",
          maxWidth: "180px"
        }}
      >
        <label style={{ marginBottom: "0.5rem", fontWeight: 600 }}>BPM</label>
        <input
          ref={inputRef}
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          style={{
            fontSize: "1.5rem",
            padding: "0.5rem 1rem",
            borderRadius: "8px",
            border: "1px solid #000",
            background: "#fff",
            width: "100%",
            textAlign: "center"
          }}
        />
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      style={{
        background: "#fff8ec",
        borderRadius: "16px",
        boxShadow: "inset 0 2px 12px #b0b0b0, 0 1px 4px #b0b0b033",
        border: "2px solid #000",
        padding: "1.2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minWidth: "120px",
        maxWidth: "180px",
        cursor: "pointer"
      }}
    >
      <label style={{ marginBottom: "0.5rem", fontWeight: 600 }}>BPM</label>
      <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>{bpm}</div>
    </div>
  );
};

export default BpmDisplay; 