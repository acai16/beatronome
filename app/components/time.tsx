import React from "react";

const TIME_SIGNATURES = [
  { label: "4/4", value: "4/4" },
  { label: "3/4", value: "3/4" },
  { label: "5/4", value: "5/4" },
  { label: "7/8", value: "7/8" },
];

interface TimeSignatureSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const TimeSignatureSelector: React.FC<TimeSignatureSelectorProps> = ({ value, onChange }) => (
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
    <label style={{ marginBottom: "0.5rem", fontWeight: 600 }}>Time Signature</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ fontSize: "1.5rem", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #000", background: "#fff" }}
    >
      {TIME_SIGNATURES.map(ts => (
        <option key={ts.value} value={ts.value}>{ts.label}</option>
      ))}
    </select>
  </div>
);

export default TimeSignatureSelector;