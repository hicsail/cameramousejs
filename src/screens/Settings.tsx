import { Slider, Stack, Switch, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  MOUSE_SPEED_LOWERBOUND,
  MOUSE_SPEED_UPPERBOUND,
  SCALE_FACTOR_LOWERBOUND,
  SCALE_FACTOR_UPPERBOUND,
  SCALE_FACTOR_Y_LOWERBOUND,
  SCALE_FACTOR_Y_UPPERBOUND,
} from "../config/mouseConfigs";
import { AppConfigContext } from "../store/AppConfigContext";

export interface Props {}
const TAG = "Settings.tsx ";

/**
 * normalize mouseSpeed to fall in range MOUSE_SPEED_LOWERBOUND - MOUSE_SPEED_UPPERBOUND
 * @param mouseSpeed ranges from 1-100
 */
function normalizeMouseSpeed(mouseSpeed: number) {
  const newSpeed =
    MOUSE_SPEED_LOWERBOUND +
    ((MOUSE_SPEED_UPPERBOUND - MOUSE_SPEED_LOWERBOUND) * mouseSpeed) / 100;
  console.log("New mouse speed after normalizing", newSpeed);
  return newSpeed;
}

//TODO create custom hook to update config
// update  AppConfigContext
// send update to main
const Settings: React.FC<Props> = (props) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);
  const [mouseSpeed, setMouseSpeed] = useState<number>(0);
  const [scaleFactor, setScaleFactor] = useState<number>(0);
  const [scaleFactorY, setScaleFactorY] = useState<number>(0);
  const [clickEnabled, setClickEnabled] = useState(true);

  useEffect(() => {
    setMouseSpeed(appConfig.mouseSpeed);
    setScaleFactor(appConfig.mouseMovementScaleFactor);
    setScaleFactorY(appConfig.mouseMovementScaleFactorY);
  }, []);

  const handleMouseSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setMouseSpeed(newValue);

      const newAppConfig = {
        ...appConfig,
        mouseSpeed: normalizeMouseSpeed(newValue),
      };
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

  const handleToggleClickEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    value: boolean
  ) => {
    setClickEnabled(value);
    const newAppConfig = {
      ...appConfig,
      mouseCommands: { ...appConfig.mouseCommands, leftClick: value },
    };
    window.electronAPI.updateConfiguration(newAppConfig);
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
          {clickEnabled ? "Disable" : "Enable"} left click
        </Typography>
        <Switch
          checked={clickEnabled}
          onChange={handleToggleClickEnabled}
          inputProps={{ "aria-label": "controlled" }}
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
      <Stack>
        <Typography variant="h6" gutterBottom>
          Scale factor Y
        </Typography>
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
