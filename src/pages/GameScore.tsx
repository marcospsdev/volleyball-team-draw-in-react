import { useState } from "react";
import { Button, Card } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { keyframes } from "@emotion/react";

// Define a interface das props para o componente
interface GameScoreProps {
  scores: { scoreA: number; scoreB: number };
  setScores: React.Dispatch<
    React.SetStateAction<{ scoreA: number; scoreB: number }>
  >;
}

// O componente agora recebe as props
function GameScore({ scores, setScores }: GameScoreProps) {
  // Mantemos apenas os estados de animação, que são locais ao componente
  const [animateA, setAnimateA] = useState<"left" | "right" | null>(null);
  const [animateB, setAnimateB] = useState<"left" | "right" | null>(null);

  const resetScores = () => {
    // Acessa o setScores via props para resetar o placar no App.tsx
    setScores({ scoreA: 0, scoreB: 0 });
  };

  const pulse = keyframes`
    0% { background-color: rgba(255,255,255,0); }
    50% { background-color: rgba(255,255,255,0.25); }
    100% { background-color: rgba(255,255,255,0); }
  `;

  const handleCardClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    team: "A" | "B",
  ) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - left;
    const isRight = clickX > width / 2;

    if (team === "A") {
      setScores((prevScores) => ({
        ...prevScores,
        scoreA: isRight
          ? prevScores.scoreA + 1
          : Math.max(prevScores.scoreA - 1, 0),
      }));
      setAnimateA(isRight ? "right" : "left");
      setTimeout(() => setAnimateA(null), 200);
    } else {
      setScores((prevScores) => ({
        ...prevScores,
        scoreB: isRight
          ? prevScores.scoreB + 1
          : Math.max(prevScores.scoreB - 1, 0),
      }));
      setAnimateB(isRight ? "right" : "left");
      setTimeout(() => setAnimateB(null), 200);
    }
  };

  const renderCard = (
    team: "A" | "B",
    score: number,
    gradient: string,
    animate: "left" | "right" | null,
  ) => (
    <Card
      onClick={(e) => handleCardClick(e, team)}
      sx={{
        flex: 1,
        minHeight: "220px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "16px",
        background: gradient,
        color: "white",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        cursor: "pointer",
        userSelect: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span className="text-lg font-medium">{`Time ${team}`}</span>
      <div className="flex items-center gap-4 mt-2 relative">
        {/* Overlay de animação */}
        {animate && (
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: animate === "left" ? 0 : "50%",
              width: "50%",
              animation: `${pulse} 0.2s ease-in-out`,
              borderRadius: "16px",
            }}
          />
        )}

        <RemoveIcon sx={{ fontSize: 40, opacity: 0.5 }} />
        <span className="text-7xl font-extrabold">{score}</span>
        <AddIcon sx={{ fontSize: 40, opacity: 0.5 }} />
      </div>
    </Card>
  );

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-4">
      <h1 className="text-3xl font-bold text-gray-800">Placar da Partida</h1>

      <div className="flex flex-col md:flex-row gap-6 w-full max-w-3xl">
        {renderCard(
          "A",
          scores.scoreA,
          "linear-gradient(135deg, #3B82F6, #1E40AF)",
          animateA,
        )}
        {renderCard(
          "B",
          scores.scoreB,
          "linear-gradient(135deg, #EF4444, #7F1D1D)",
          animateB,
        )}
      </div>

      <Button
        variant="contained"
        color="secondary"
        startIcon={<RefreshIcon />}
        onClick={resetScores}
        className="rounded-full px-6 py-2 shadow-lg"
      >
        Resetar Placar
      </Button>
    </div>
  );
}

export default GameScore;
