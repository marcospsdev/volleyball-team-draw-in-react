import { useState } from "react";
import {
  Button,
  TextField,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  Shuffle,
  Male,
  Female,
  ContentCopy,
  RotateLeft,
} from "@mui/icons-material";

type Player = {
  id: number;
  name: string;
  gender: "M" | "F";
};

interface TeamDrawProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  teams: Player[][];
  setTeams: React.Dispatch<React.SetStateAction<Player[][]>>;
}

const teamColors = [
  { header: "bg-red-500", text: "text-red-500", emoji: "🔴" },
  { header: "bg-blue-500", text: "text-blue-500", emoji: "🔵" },
  { header: "bg-yellow-500", text: "text-yellow-500", emoji: "🟡" },
  { header: "bg-green-500", text: "text-green-500", emoji: "🟢" },
  { header: "bg-pink-500", text: "text-pink-500", emoji: "🌸" },
];

function TeamDraw({ players, setPlayers, teams, setTeams }: TeamDrawProps) {
  const [previousTeams, setPreviousTeams] = useState<Player[][]>([]);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"M" | "F">("M");

  const [isResetModalOpen, setIsResetModal] = useState(false);
  const [isShuffleModalOpen, setIsShuffleModal] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "info" | "warning" | "error"
  >("success");

  const playersPerTeam = 4;

  const addPlayer = () => {
    if (name.trim() === "") return;
    const newPlayer: Player = {
      id: Date.now(),
      name: name.toUpperCase(),
      gender,
    };
    setPlayers([...players, newPlayer]);
    setName("");
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  const handleOpenResetModal = () => {
    setIsResetModal(true);
  };

  const handleCloseResetModal = () => {
    setIsResetModal(false);
  };

  const handleConfirmReset = () => {
    setPlayers([]);
    setTeams([]);
    setPreviousTeams([]);
    handleCloseResetModal();
    setSnackbarMessage("A lista foi resetada com sucesso!");
    setSnackbarSeverity("info");
    setSnackbarOpen(true);
  };

  const handleOpenShuffleModal = () => {
    setIsShuffleModal(true);
  };

  const handleCloseShuffleModal = () => {
    setIsShuffleModal(false);
  };

  const shuffleTeams = () => {
    const shuffled: Player[] = [...players].sort(() => Math.random() - 0.5);

    const maxTeams = Math.ceil(shuffled.length / playersPerTeam);

    let newTeams: Player[][] = Array.from({ length: maxTeams }, () => []);

    const females = shuffled.filter((p) => p.gender === "F");
    const males = shuffled.filter((p) => p.gender === "M");

    for (let i = 0; i < newTeams.length; i++) {
      if (females.length > 0) {
        newTeams[i].push(females.pop()!);
      }
    }

    let index = 0;
    const remainingPlayers = [...males, ...females];
    while (remainingPlayers.length > 0) {
      const player = remainingPlayers.pop()!;
      newTeams[index % maxTeams].push(player);
      index++;
    }

    if (previousTeams.length > 0) {
      newTeams = newTeams.map((team, i) => {
        const prev = previousTeams[i] || [];
        const intersection = team.filter((p) =>
          prev.some((prevPlayer) => prevPlayer.id === p.id),
        );
        if (intersection.length > 2) {
          const others = newTeams
            .flat()
            .filter((p) => !team.some((teamPlayer) => teamPlayer.id === p.id));
          const replaced = others.slice(0, intersection.length);
          const remainingTeam = team.filter(
            (p) => !intersection.some((intP) => intP.id === p.id),
          );
          return [...remainingTeam, ...replaced];
        }
        return team;
      });
    }

    setPreviousTeams(newTeams);
    setTeams(newTeams);
    setIsShuffleModal(false);
    setSnackbarMessage("Times sorteados com sucesso!");
    setSnackbarSeverity("success");
    setSnackbarOpen(true);
  };

  const handleCopyTeams = () => {
    let teamsText = "🚨 *TIMES SORTEADOS!* 🚨\n\n";

    teams.forEach((team, index) => {
      const teamEmoji = teamColors[index]?.emoji || "";
      teamsText += `${teamEmoji} *Time ${index + 1}:*\n`;

      team.forEach((player) => {
        const genderEmoji = player.gender === "M" ? "♂️" : "♀️";
        teamsText += `- ${player.name} ${genderEmoji}\n`;
      });

      teamsText += "\n";
    });

    teamsText += "\n\nBy Marquinhos & Luquinhas App ©";

    navigator.clipboard.writeText(teamsText).then(() => {
      setSnackbarMessage("Times copiados! Agora é só colar no WhatsApp.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const totalPlayers = players.length;
  const maleCount = players.filter((p) => p.gender === "M").length;
  const femaleCount = players.filter((p) => p.gender === "F").length;

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div className="p-4 max-w-lg mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
        Sorteio de Times
      </h1>
      <p className="text-center text-sm mb-4 text-gray-500">
        Adicione jogadores e sorteie times equilibrados.
      </p>

      <Card className="mb-6 shadow-md">
        <CardContent>
          <div className="flex gap-2 items-center mb-2">
            <TextField
              label="Nome"
              variant="outlined"
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPlayer()}
              className="flex-1"
            />
            <IconButton
              onClick={() => setGender("M")}
              className={`rounded-full ${gender === "M" ? "bg-blue-100" : ""}`}
            >
              <Male sx={{ color: gender === "M" ? "blue" : "gray" }} />
            </IconButton>
            <IconButton
              onClick={() => setGender("F")}
              className={`rounded-full ${gender === "F" ? "bg-pink-100" : ""}`}
            >
              <Female sx={{ color: gender === "F" ? "pink" : "gray" }} />
            </IconButton>
            <Button
              variant="contained"
              onClick={addPlayer}
              disabled={name.trim() === ""}
            >
              Adicionar
            </Button>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            Total: {totalPlayers} | Homens: {maleCount} | Mulheres:{" "}
            {femaleCount}
          </div>

          <List className="flex flex-wrap gap-2">
            {players.map((player) => (
              <Chip
                key={player.id}
                label={player.name}
                onDelete={() => removePlayer(player.id)}
                color={player.gender === "M" ? "primary" : "secondary"}
              />
            ))}
          </List>
        </CardContent>
      </Card>

      <div className="text-center mb-6 flex flex-col items-center">
        <Button
          variant="contained"
          size="large"
          startIcon={<Shuffle />}
          onClick={handleOpenShuffleModal}
          disabled={totalPlayers < playersPerTeam * 2}
          sx={{ width: "fit-content" }}
        >
          Sortear Times
        </Button>

        {teams.length > 0 && (
          <Button
            variant="outlined"
            startIcon={<ContentCopy />}
            onClick={handleCopyTeams}
            sx={{ width: "fit-content", marginTop: "1rem" }}
          >
            Copiar Times
          </Button>
        )}

        {totalPlayers > 0 && (
          <Button
            variant="text"
            startIcon={<RotateLeft />}
            onClick={handleOpenResetModal}
            color="error"
            sx={{ width: "fit-content", marginTop: "1rem" }}
          >
            Resetar Lista
          </Button>
        )}
      </div>

      {teams.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Times Sorteados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teams.map((team, i) => {
              const teamHeaderColor =
                i < teamColors.length ? teamColors[i].header : null;
              const teamTextColor =
                i < teamColors.length ? teamColors[i].text : null;
              const randomColor = getRandomColor();
              return (
                <Card
                  key={i}
                  className={`shadow-md overflow-hidden ${teamTextColor ? teamTextColor : ""} ${
                    i === teams.length - 1 ? "mb-24" : ""
                  }`}
                >
                  <div
                    className={`flex justify-center items-center py-2 text-white font-bold ${teamHeaderColor}`}
                    style={
                      !teamHeaderColor ? { backgroundColor: randomColor } : {}
                    }
                  >
                    Time {i + 1}
                  </div>
                  <CardContent>
                    <List dense>
                      {team.map((p, idx) => (
                        <ListItem
                          key={idx}
                          className="p-0 flex items-center gap-2"
                        >
                          <span
                            className={`w-3 h-3 rounded-full ${
                              p.gender === "M" ? "bg-blue-500" : "bg-pink-500"
                            }`}
                          />
                          <ListItemText primary={p.name.toUpperCase()} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Dialog
        open={isShuffleModalOpen}
        onClose={handleCloseShuffleModal}
        aria-labelledby="shuffle-confirmation-title"
        aria-describedby="shuffle-confirmation-description"
      >
        <DialogTitle id="shuffle-confirmation-title">
          {"Confirmar Sorteio"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="shuffle-confirmation-description">
            Deseja realmente sortear novos times?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseShuffleModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={shuffleTeams} color="success" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isResetModalOpen}
        onClose={handleCloseResetModal}
        aria-labelledby="reset-confirmation-title"
        aria-describedby="reset-confirmation-description"
      >
        <DialogTitle id="reset-confirmation-title">
          {"Confirmação de Reset"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="reset-confirmation-description">
            Tem certeza que deseja resetar a lista de jogadores e times
            sorteados?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResetModal} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleConfirmReset} color="error" autoFocus>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TeamDraw;
