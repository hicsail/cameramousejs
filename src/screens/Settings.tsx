import {
  Button,
  FormControlLabel,
  FormGroup,
  Slider,
  Switch,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { AppConfigContext } from "../store/AppConfigContext";

export interface Props {}
const TAG = "Settings.tsx ";

const Settings: React.FC<Props> = (props) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);

  const [mouseSpeed, setMouseSpeed] = useState<number>(0);

  useEffect(() => {
    setMouseSpeed(appConfig.mouseSpeed);
  }, []);

  const handleMouseSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setMouseSpeed(newValue);
      window.electronAPI.setMouseSpeed(newValue);
    }
  };

  const saveSettings = () => {
    const newAppConfig = { ...appConfig };
    newAppConfig.mouseSpeed = mouseSpeed;
    setAppConfig(newAppConfig);
    //TODO save to local storage
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Mouse speed
      </Typography>
      <Slider
        value={mouseSpeed}
        onChangeCommitted={handleMouseSliderChange}
        aria-label="mouse speed slider"
        min={1} //ensures mouse speed never gets to zero
      />
      <Typography variant="h6" gutterBottom>
        Tracker
      </Typography>

      <FormGroup>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Internal Tracker"
        />
        <FormControlLabel
          control={<Switch checked={appConfig.availableTrackers.thirdParty} />}
          label="3rd-Party Tracker"
        />
      </FormGroup>

      <Button variant="contained" onClick={saveSettings}>
        Save
      </Button>
    </>
  );
};

export default Settings;
