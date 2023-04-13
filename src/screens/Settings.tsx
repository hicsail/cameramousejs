import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  SCALE_FACTOR_X_LOWERBOUND,
  SCALE_FACTOR_X_UPPERBOUND,
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
  const [joystickStepSize, setJoystickStepSize] = useState<number>(5);
  const [trackingMode, setTrackingMode] = useState(appConfig.trackingMode);

  useEffect(() => {
    setScaleFactor(appConfig.mouseMovementScaleFactor);
    setScaleFactorY(appConfig.mouseMovementScaleFactorY);
    setJoystickStepSize(appConfig.joystickStepSize);
    setTrackingMode(appConfig.trackingMode);
  }, []);

  const handleTrackModeChange = (event: SelectChangeEvent) => {
    setTrackingMode(event.target.value as string);

    const newAppConfig = { ...appConfig, trackingMode: event.target.value };
    window.electronAPI.updateConfiguration(newAppConfig);
    setAppConfig(newAppConfig);
  };

  const handleScaleSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setScaleFactor(newValue);

      const newAppConfig = { ...appConfig, mouseMovementScaleFactor: newValue };
      window.electronAPI.updateConfiguration(newAppConfig);
      setAppConfig(newAppConfig);
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
      setAppConfig(newAppConfig);
    }
  };

  const handleJoystickStepChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setJoystickStepSize(newValue);

      const newAppConfig = {
        ...appConfig,
        joystickStepSize: newValue,
      };
      window.electronAPI.updateConfiguration(newAppConfig);
      setAppConfig(newAppConfig);
    }
  };

  return (
    <Stack width={"100%"} spacing={5}>
      <Box sx={{ minWidth: 150 }}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Track Mode</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={trackingMode}
            label="Age"
            onChange={handleTrackModeChange}
          >
            <MenuItem value={"position"}>Position</MenuItem>
            <MenuItem value={"joystick"}>Joystick</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {trackingMode == "position" ? (
        <>
          <Typography variant="h6" gutterBottom>
            Settings
          </Typography>
          <Stack>
            <Typography gutterBottom>Horizontal sensitivity</Typography>
            <Slider
              aria-label="mouse movement scale slider"
              value={scaleFactor}
              onChangeCommitted={handleScaleSliderChange}
              getAriaValueText={(value) => value.toString()}
              step={1}
              marks
              min={SCALE_FACTOR_X_LOWERBOUND}
              max={SCALE_FACTOR_X_UPPERBOUND}
              valueLabelDisplay="auto"
            />
          </Stack>
          <Stack>
            <Typography gutterBottom>Vertical sensitivity</Typography>
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
        </>
      ) : (
        <Stack>
          <Stack>
            <Typography gutterBottom>Step size</Typography>
            <Slider
              value={joystickStepSize}
              onChangeCommitted={handleJoystickStepChange}
              getAriaValueText={(value) => value.toString()}
              step={1}
              min={5}
              max={50}
              valueLabelDisplay="auto"
            />
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default Settings;
