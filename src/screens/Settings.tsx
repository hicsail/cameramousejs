import { Slider, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  SCALE_FACTOR_LOWERBOUND,
  SCALE_FACTOR_UPPERBOUND,
  SCALE_FACTOR_Y_LOWERBOUND,
  SCALE_FACTOR_Y_UPPERBOUND,
} from "../config/mouseConfigs";
import { AppConfigContext } from "../store/AppConfigContext";

export interface Props {}
const TAG = "Settings.tsx ";

//TODO create custom hook to update config
// update  AppConfigContext
// send update to main
const Settings: React.FC<Props> = (props) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);
  const [scaleFactor, setScaleFactor] = useState<number>(0);
  const [scaleFactorY, setScaleFactorY] = useState<number>(0);

  useEffect(() => {
    setScaleFactor(appConfig.mouseMovementScaleFactor);
    setScaleFactorY(appConfig.mouseMovementScaleFactorY);
  }, []);

  const handleScaleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setScaleFactor(newValue);

      const newAppConfig = { ...appConfig, mouseMovementScaleFactor: newValue };
      window.electronAPI.updateConfiguration(newAppConfig);
    }
  };

  const handleScaleYSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setScaleFactorY(newValue);

      const newAppConfig = {
        ...appConfig,
        mouseMovementScaleFactorY: newValue,
      };
      window.electronAPI.updateConfiguration(newAppConfig);
    }
  };

  return (
    <Stack width={"100%"} spacing={5}>
      <Typography variant="h6" gutterBottom>
        Settings
      </Typography>
      <Stack>
        <Typography gutterBottom>Scale factor X</Typography>
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
      <Stack>
        <Typography gutterBottom>Scale factor Y</Typography>
        <Slider
          aria-label="mouse movement scale slider y"
          value={scaleFactorY}
          onChangeCommitted={handleScaleYSliderChange}
          getAriaValueText={(value) => value.toString()}
          step={1}
          marks
          min={SCALE_FACTOR_Y_LOWERBOUND}
          max={SCALE_FACTOR_Y_UPPERBOUND}
          valueLabelDisplay="auto"
        />
      </Stack>
    </Stack>
  );
};

export default Settings;
