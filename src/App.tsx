import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import TeamDraw from "./pages/TeamDraw";
import GameScore from "./pages/GameScore";

import {
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Avatar,
} from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import SportsIcon from "@mui/icons-material/SportsSoccer";
import "./App.css";

const marquinhosAvatar = "https://i.imgur.com/9Vrifl4.png";
const luquinhasAvatar = "https://i.imgur.com/UwIDrOG.png";

type Player = {
  id: number;
  name: string;
  gender: "M" | "F";
};

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [value, setValue] = React.useState(location.pathname);

  React.useEffect(() => {
    setValue(location.pathname);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      {/* Top AppBar */}
      <AppBar
        position="sticky"
        elevation={0}
        className="bg-gradient-to-r from-blue-500/80 to-indigo-600/80 backdrop-blur-lg shadow-md border-b border-white/20"
      >
        <Toolbar className="flex justify-between items-center py-3 px-4 sm:px-6">
          {" "}
          <Avatar
            alt="Marquinhos Avatar"
            src={marquinhosAvatar}
            sx={{
              width: 40,
              height: 40,
              border: "2px solid white",
              flexShrink: 0,
            }}
          />
          <Typography
            variant="h6"
            className="font-bold text-white tracking-wide drop-shadow-sm flex-grow text-center"
          >
            Marquinhos & Luquinhas ©
          </Typography>
          <Avatar
            alt="Luquinhas Avatar"
            src={luquinhasAvatar}
            sx={{
              width: 40,
              height: 40,
              border: "2px solid white",
              flexShrink: 0,
            }}
          />
        </Toolbar>
      </AppBar>

      <main className="flex-1 overflow-y-auto p-4">{children}</main>
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          borderRadius: "20px 20px 0 0",
        }}
        className="bg-white/80 backdrop-blur-md shadow-lg"
        elevation={6}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          className="bg-transparent"
        >
          <BottomNavigationAction
            label="Times"
            value="/team-draw"
            icon={<ShuffleIcon />}
            component={Link}
            to="/team-draw"
            sx={{
              color: value === "/team-draw" ? "#2563eb" : "#6b7280",
              "& .MuiSvgIcon-root": {
                fontSize: "1.8rem",
              },
              "&.Mui-selected": {
                color: "#2563eb",
              },
            }}
          />
          <BottomNavigationAction
            label="Placar"
            value="/game-score"
            icon={<SportsIcon />}
            component={Link}
            to="/game-score"
            sx={{
              color: value === "/game-score" ? "#2563eb" : "#6b7280",
              "& .MuiSvgIcon-root": {
                fontSize: "1.8rem",
              },
              "&.Mui-selected": {
                color: "#2563eb",
              },
            }}
          />
        </BottomNavigation>
      </Paper>
    </div>
  );
}

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const savedPlayers = localStorage.getItem("players");
      return savedPlayers ? JSON.parse(savedPlayers) : [];
    } catch (error) {
      console.error("Failed to parse players from localStorage", error);
      return [];
    }
  });

  const [teams, setTeams] = useState<Player[][]>(() => {
    try {
      const savedTeams = localStorage.getItem("teams");
      return savedTeams ? JSON.parse(savedTeams) : [];
    } catch (error) {
      console.error("Failed to parse teams from localStorage", error);
      return [];
    }
  });

  const [scores, setScores] = useState({ scoreA: 0, scoreB: 0 });

  useEffect(() => {
    try {
      localStorage.setItem("players", JSON.stringify(players));
    } catch (error) {
      console.error("Failed to save players to localStorage", error);
    }
  }, [players]);

  useEffect(() => {
    try {
      localStorage.setItem("teams", JSON.stringify(teams));
    } catch (error) {
      console.error("Failed to save teams to localStorage", error);
    }
  }, [teams]);

  useEffect(() => {
    try {
      localStorage.setItem("scores", JSON.stringify(scores));
    } catch (error) {
      console.error("Failed to save scores to localStorage", error);
    }
  }, [scores]);

  useEffect(() => {
    try {
      const savedScores = localStorage.getItem("scores");
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
    } catch (error) {
      console.error("Failed to load scores from localStorage", error);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <TeamDraw
                players={players}
                setPlayers={setPlayers}
                teams={teams}
                setTeams={setTeams}
              />
            </Layout>
          }
        />
        <Route
          path="/team-draw"
          element={
            <Layout>
              <TeamDraw
                players={players}
                setPlayers={setPlayers}
                teams={teams}
                setTeams={setTeams}
              />
            </Layout>
          }
        />
        <Route
          path="/game-score"
          element={
            <Layout>
              <GameScore scores={scores} setScores={setScores} />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
