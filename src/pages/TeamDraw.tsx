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

// Define os tipos necessários
type Player = {
  id: number;
  name: string;
  gender: "M" | "F";
};

// Define os tipos das props que o componente vai receber
interface TeamDrawProps {
  players: Player[];
  setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  teams: Player[][];
  setTeams: React.Dispatch<React.SetStateAction<Player[][]>>;
}

// Cores fixas para os times e emojis correspondentes
const teamColors = [
  { header: "bg-red-500", text: "text-red-500", emoji: "🔴" },
  { header: "bg-blue-500", text: "text-blue-500", emoji: "🔵" },
  { header: "bg-yellow-500", text: "text-yellow-500", emoji: "🟡" },
  { header: "bg-green-500", text: "text-green-500", emoji: "🟢" },
  { header: "bg-pink-500", text: "text-pink-500", emoji: "🌸" },
];

// O componente agora recebe as props
function TeamDraw({ players, setPlayers, teams, setTeams }: TeamDrawProps) {
  // Mantemos apenas os estados que são locais ao componente
  const [previousTeams, setPreviousTeams] = useState<Player[][]>([]);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"M" | "F">("M");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const playersPerTeam = 4;

  const addPlayer = () => {
    if (name.trim() === "") return;
    const newPlayer: Player = {
      id: Date.now(),
      name: name.toUpperCase(),
      gender,
    }; // <--- AQUI: nome agora é sempre maiúsculo
    setPlayers([...players, newPlayer]);
    setName("");
  };

  const removePlayer = (id: number) => {
    setPlayers(players.filter((player) => player.id !== id));
  };

  // Funções para lidar com o modal de confirmação
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Função para resetar a lista após confirmação
  const handleConfirmReset = () => {
    setPlayers([]);
    setTeams([]);
    setPreviousTeams([]);
    handleCloseModal();
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
  };

  const handleCopyTeams = () => {
    let teamsText = "🚨 *TIMES SORTEADOS!* 🚨\n\n";

    teams.forEach((team, index) => {
      const teamEmoji = teamColors[index] ? teamColors[index].emoji : "";
      teamsText += `${teamEmoji} *Time ${index + 1}:*\n`;

      team.forEach((player) => {
        const genderEmoji = player.gender === "M" ? "♂️" : "♀️";
        teamsText += `- ${player.name} ${genderEmoji}\n`;
      });

      teamsText += "\n";
    });

    teamsText += "\n\nBy Marquinhos & Luquinhas App ©";

    navigator.clipboard.writeText(teamsText).then(() => {
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

      {/* Seção de Adicionar Jogador */}
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

          {/* Contadores */}
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

      {/* Botões de Ação */}
      <div className="text-center mb-6 flex flex-col items-center">
        <Button
          variant="contained"
          size="large"
          startIcon={<Shuffle />}
          onClick={shuffleTeams}
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
            Copiar Lista
          </Button>
        )}

        {totalPlayers > 0 && (
          <Button
            variant="text"
            startIcon={<RotateLeft />}
            onClick={handleOpenModal}
            color="error"
            sx={{ width: "fit-content", marginTop: "1rem" }}
          >
            Resetar Lista
          </Button>
        )}
      </div>

      {/* Seção dos Times Sorteados */}
      {teams.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Times Sorteados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teams.map((team, i) => {
              const teamColor =
                i < teamColors.length
                  ? teamColors[i]
                  : { header: `bg-[${getRandomColor()}]`, text: "" };
              return (
                <Card
                  key={i}
                  className={`shadow-md overflow-hidden ${teamColor.text} ${
                    i === teams.length - 1 ? "mb-24" : ""
                  }`}
                >
                  {/* Cabeçalho Colorido */}
                  <div
                    className={`flex justify-center items-center py-2 text-white font-bold ${teamColor.header}`}
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
                          {/* AQUI: Garantindo que o nome do jogador seja maiúsculo na exibição */}
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

      {/* Snackbar para mostrar o aviso de cópia */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Times copiados! Agora é só colar no WhatsApp.
        </Alert>
      </Snackbar>

      {/* Modal de confirmação */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmação de Reset"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja resetar a lista de jogadores e times
            sorteados?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
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
