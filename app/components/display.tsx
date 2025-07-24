import React, { useState } from "react";

interface Instrument {
  name: string;
  file: string;
}

interface DrumMachineGridProps {
  instruments: Instrument[];
  steps: number;
  grid: boolean[][];
  currentStep: number;
  onToggle: (row: number, col: number) => void;
  sectionLength: number;
  sections: number;
}

const DrumMachineGrid: React.FC<DrumMachineGridProps> = ({ instruments, steps, grid, currentStep, onToggle, sectionLength, sections }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragValue, setDragValue] = useState<boolean | null>(null);
  const [lastDraggedCell, setLastDraggedCell] = useState<{ row: number; col: number } | null>(null);

  const handleMouseDown = (row: number, col: number) => {
    const currentValue = grid[row][col];
    setIsDragging(true);
    setDragValue(!currentValue);
    setLastDraggedCell({ row, col });
    onToggle(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isDragging && dragValue !== null && lastDraggedCell) {
      if (lastDraggedCell.row !== row || lastDraggedCell.col !== col) {
        setLastDraggedCell({ row, col });
        if (grid[row][col] !== dragValue) {
          onToggle(row, col);
        }
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragValue(null);
    setLastDraggedCell(null);
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div
        style={{
          minWidth: 1600,
          maxWidth: 1600,
          width: "100%",
          margin: "2rem auto",
          minHeight: 400,
          background: "#fff8ec",
          borderRadius: 24,
          border: "2px solid #000",
          boxShadow: "inset 0 4px 24px #b0b0b0, 0 2px 8px #b0b0b033",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 2rem"
        }}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
          {instruments.map((inst, rowIdx) => (
            <div key={inst.name} style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "center" }}>
              <span style={{ width: 70, fontWeight: 600, textAlign: "center" }}>{inst.name}</span>
              <div style={{ display: "flex", gap: "0.5rem", flex: 1, justifyContent: "center" }}>
                {Array.from({ length: steps }).map((_, colIdx) => {
                  const isActive = grid[rowIdx][colIdx];
                  const isCurrent = colIdx === currentStep;
                  const isDownbeat = colIdx % sectionLength === 0;
                  let background = isActive
                    ? (isCurrent ? "#1976d2" : "#000")
                    : (isCurrent ? "#b3d8f7" : (isDownbeat ? "#bdbdbd" : "#fff"));
                  return (
                    <button
                      key={colIdx}
                      onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                      onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        border: isCurrent ? "2px solid #1976d2" : "2px solid #000",
                        background,
                        transition: "background 0.1s, border 0.1s",
                        outline: "none",
                        cursor: "pointer",
                        userSelect: "none"
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DrumMachineGrid;