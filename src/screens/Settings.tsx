import { Slider, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  SCALE_FACTOR_LOWERBOUND,
  SCALE_FACTOR_UPPERBOUND,
} from "../config/mouseConfigs";
import { AppConfigContext } from "../store/AppConfigContext";

export interface Props {}
const TAG = "Settings.tsx ";

const Settings: React.FC<Props> = (props) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);
  const [mouseSpeed, setMouseSpeed] = useState<number>(0);
  const [scaleFactor, setScaleFactor] = useState<number>(0);
  useEffect(() => {
    setMouseSpeed(appConfig.mouseSpeed);
    setScaleFactor(appConfig.mouseMovementScaleFactor);
  }, []);

  const handleMouseSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setMouseSpeed(newValue);

      const newAppConfig = { ...appConfig, mouseSpeed: newValue };
      window.electronAPI.updateConfiguration(newAppConfig);
    }
  };

  const handleScaleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setScaleFactor(newValue);

      const newAppConfig = { ...appConfig, mouseMovementScaleFactor: newValue };
      window.electronAPI.updateConfiguration(newAppConfig);
    }
  };

  return (
    <Stack width={"100%"} spacing={5}>
      <Stack>
        <Typography variant="h6" gutterBottom>
          Mouse speed
        </Typography>
        <Slider
          value={mouseSpeed}
          onChangeCommitted={handleMouseSliderChange}
          aria-label="mouse speed slider"
          min={1} //ensures mouse speed never gets to zero
        />
      </Stack>
      <Stack>
        <Typography variant="h6" gutterBottom>
          Scale factor
        </Typography>
        <Slider
          aria-label="mouse movement scale slider"
          value={scaleFactor}
          onChangeCommitted={handleScaleSliderChange}
          getAriaValueText={(value) => value.toString()}
          step={1}
          marks
          min={SCALE_FACTOR_LOWERBOUND}
          max={SCALE_FACTOR_UPPERBOUND}
          valueLabelDisplay="auto"
        />
      </Stack>
    </Stack>
  );
};

export default Settings;
