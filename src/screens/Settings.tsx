import {
  FormControlLabel,
  FormGroup,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

export interface Props {}
const TAG = "Settings.tsx ";

const Settings: React.FC<Props> = (props) => {
  console.log(TAG, "hahaha");

  const handleClick = () => {
    window.electronAPI.moveMouse();
    console.log(TAG, "button clicked. window. electronAPI", window.electronAPI);
  };

  return (
    <>
      <Typography variant="h3" gutterBottom>
        Tracker
      </Typography>

      <Typography variant="h3" gutterBottom>
        Mouse
      </Typography>
      <Slider defaultValue={30} aria-label="mouse speed slider" />
      <FormGroup>
        <FormControlLabel control={<Switch defaultChecked />} label="Label" />
        <FormControlLabel disabled control={<Switch />} label="Disabled" />
      </FormGroup>

      <button onClick={handleClick}>Move mouse</button>
    </>
  );
};

export default Settings;
