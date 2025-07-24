import React from "react";

interface BpmSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
}

const BpmSlider: React.FC<BpmSliderProps> = ({ value, min = 10, max = 240, onChange, onPointerDown, onPointerUp }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "60vw", maxWidth: "700px", minWidth: "260px", margin: "0 auto" }}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        style={{ margin: "1rem 0", width: "100%" }}
      />
    </div>
  );
};

export default BpmSlider;
