import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import Settings from "./Settings";

export interface Props {}
const TAG = "Home.tsx ";

const Home: React.FC<Props> = (props) => {
  const goToSettings = () => {
    window.electronAPI.openSettings();
  };

  const [status, setStatus] = useState<"idle" | "tracking">("idle");
  return (
    <>
      <h2>Status</h2> <h2>{status}</h2>
      <h2>
        {status == "idle"
          ? "Press ESC to stop tracking"
          : "Press ENTER to begin tracking"}
      </h2>
      <Settings />
    </>
  );
};

export default Home;
