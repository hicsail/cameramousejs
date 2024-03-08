//@ts-nocheck
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Stack,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import StyledSlider from "../components/StyledSlider";
import ScreenExclusionForm from "../components/ScreenExclusionForm";
import {
  PITCH_LOWERBOUND,
  PITCH_UPPERBOUND,
  SCALE_FACTOR_X_LOWERBOUND,
  SCALE_FACTOR_X_UPPERBOUND,
  SCALE_FACTOR_Y_LOWERBOUND,
  SCALE_FACTOR_Y_UPPERBOUND,
  YAW_LOWERBOUND,
  YAW_UPPERBOUND,
} from "../config/mouseConfigs";
import { AppConfigContext } from "../store/AppConfigContext";

export interface Props { }
const TAG = "Settings.tsx ";
//TODO create custom hook to update config
const Settings: React.FC<Props> = (props) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);
  const [scaleFactor, setScaleFactor] = useState<number>(0);
  const [scaleFactorY, setScaleFactorY] = useState<number>(0);
  const [yawThreshold, setYawThreshold] = useState<number>(0);
  const [pitchThreshold, setPitchThreshold] = useState<number>(0);
  const [joystickStepSize, setJoystickStepSize] = useState<number>(5);
  const [trackingMode, setTrackingMode] = useState(appConfig.trackingMode);
  const [leftClickGesture, setLeftClickGesture] = useState(appConfig.leftClickGesture);
  const [rightClickGesture, setRightClickGesture] = useState(appConfig.rightClickGesture);
  const [doubleClickGesture, setDoubleClickGesture] = useState(appConfig.doubleClickGesture);
  const [mouthThreshold, setMouthThreshold] = useState(appConfig.mouthGestureThreshold);
  const [eyebrowThreshold, setEyebrowThreshold] = useState(appConfig.eyebrowGestureThreshold);
  const [dwellTime, setDwellTime] = useState(appConfig.dwellTime);

  console.log(TAG, "appConfig", appConfig);
  
  useEffect(() => {
    setScaleFactor(appConfig.mouseMovementScaleFactor);
    setScaleFactorY(appConfig.mouseMovementScaleFactorY);
    setJoystickStepSize(appConfig.joystickStepSize);
    setYawThreshold(appConfig.joystickYawThreshold);
    setPitchThreshold(appConfig.joystickPitchThreshold);
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

  const handleYawSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setYawThreshold(newValue);

      const newAppConfig = { ...appConfig, joystickYawThreshold: newValue };
      window.electronAPI.updateConfiguration(newAppConfig);
      setAppConfig(newAppConfig);
    }
  };

  const handlePitchSliderChange = (_: Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setPitchThreshold(newValue);

      const newAppConfig = { ...appConfig, joystickPitchThreshold: newValue };
      window.electronAPI.updateConfiguration(newAppConfig);
      setAppConfig(newAppConfig);
    }
  };

  const handleLeftClickChange = async (event: SelectChangeEvent) => {


    // check if the other clicks are not set to this value
    if (event.target.value !== "none" && (event.target.value == rightClickGesture || event.target.value == doubleClickGesture)) {
        // create alert to user
        return;
    }
    setLeftClickGesture(event.target.value as string);



    const newAppConfig = { ...appConfig, leftClickGesture: event.target.value};
    await window.electronAPI.updateConfiguration(newAppConfig);
    await setAppConfig(newAppConfig);


  };

  const handleRightClickChange = (event: SelectChangeEvent) => {
    // check if the other clicks are not set to this value
    if (event.target.value !== "none" &&  (event.target.value == leftClickGesture || event.target.value == doubleClickGesture)) {
        // create alert to user
        return;
    }
    setRightClickGesture(event.target.value as string);

    const newAppConfig = { ...appConfig, rightClickGesture: event.target.value};
    window.electronAPI.updateConfiguration(newAppConfig);
    setAppConfig(newAppConfig);
  };

  const handleDoubleClickChange = (event: SelectChangeEvent) => {
    // check if the other clicks are not set to this value
    if (event.target.value !== "none" && (event.target.value == leftClickGesture || event.target.value == rightClickGesture)) {
        // create alert to user
        return;
    }
    setDoubleClickGesture(event.target.value as string);

    const newAppConfig = { ...appConfig, doubleClickGesture: event.target.value};
    window.electronAPI.updateConfiguration(newAppConfig);
    setAppConfig(newAppConfig);
  };

  const handleMouthThresholdChange = async (_:Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setMouthThreshold(newValue);

      const newAppConfig = { ...appConfig, mouthGestureThreshold: newValue};
      window.electronAPI.updateConfiguration(newAppConfig);
      await setAppConfig(newAppConfig);
    }
  };

  const handleEyebrowThresholdChange = async (_:Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setEyebrowThreshold(newValue);

      const newAppConfig = { ...appConfig, eyebrowGestureThreshold: newValue};
      window.electronAPI.updateConfiguration(newAppConfig);
      await setAppConfig(newAppConfig);
    }
  };

  const handleDwellTimeChange = async (_:Event, newValue: number | number[]) => {
    if (typeof newValue == "number") {
      setDwellTime(newValue);
      console.log("dwellTime", newValue);
      const newAppConfig = { ...appConfig, dwellTime: newValue};
      window.electronAPI.updateConfiguration(newAppConfig);
      await setAppConfig(newAppConfig);
    }
  }

  return (
    <Stack minWidth={350} width={"100%"}>
      {!appConfig.monoTrackingMode && (
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
      )}

      <Stack justifyContent={"center"} alignItems={"center"}>


        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>

        <Stack style={{marginTop: "2rem"}}>

          <Typography className="textCenter" gutterBottom style={{marginBottom: "2rem"}}>
              Gestures
          </Typography>

        <Stack direction='row' justifyContent={"space-between"} spacing={10}>
        
          <Box>
             
            <Alert id="left-click-gesture-error" sx={{ display: 'none' }} severity="error">This is an error alert — check it out!</Alert>

            <FormControl>
            <InputLabel id="demo-simple-select-label">Left Click</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={leftClickGesture}
                label="leftClickGesture"
                onChange={handleLeftClickChange}
              >
                  <MenuItem value={"none"}>Not Set</MenuItem>
                  <MenuItem value={"dwell"}>Dwell Time</MenuItem>
                  <MenuItem value={"mouth"}>Opening Mouth</MenuItem>
                  <MenuItem value={"eyebrow-raise"}>Raising Eyebrows</MenuItem>
                </Select>
            </FormControl>

          </Box>

          <Box>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Right Click</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={rightClickGesture}
                label="rightlickGesture"
                onChange={handleRightClickChange}
              >
                  <MenuItem value={"none"}>Not Set</MenuItem>
                  <MenuItem value={"dwell"}>Dwell Time</MenuItem>
                  <MenuItem value={"mouth"}>Opening Mouth</MenuItem>
                  <MenuItem value={"eyebrow-raise"}>Raising Eyebrows</MenuItem>
                </Select>
            </FormControl>
          </Box>

          <Box>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Double Click</InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={doubleClickGesture}
                label="doubleClickGesture"
                onChange={handleDoubleClickChange}
              >
                  <MenuItem value={"none"}>Not Set</MenuItem>
                  <MenuItem value={"dwell"}>Dwell Time</MenuItem>
                  <MenuItem value={"mouth"}>Opening Mouth</MenuItem>
                  <MenuItem value={"eyebrow-raise"}>Raising Eyebrows</MenuItem>
                </Select>
            </FormControl>
            </Box>

          
        </Stack>
        <Stack>
            <Typography className="textCenter" gutterBottom style={{marginTop: "2rem", marginBottom: "2rem"}}>
              Thresholds
            </Typography>

            <Stack direction='row' justifyContent={"space-between"} spacing={10} >

              <Stack>
                <Typography gutterBottom>Dwell Time</Typography>
                <StyledSlider
                  aria-label="eyebrow threshold slider"
                  value={dwellTime}
                  onChangeCommitted={handleDwellTimeChange}
                  getAriaValueText={(value: string) => value.toString()}
                  marks
                  step={0.1}
                  min={0.3}
                  max={1.7}
                  valueLabelDisplay="auto"
                />
              </Stack>
              <Stack>
                <Typography gutterBottom>Mouth threshold</Typography>
                <StyledSlider
                  aria-label="mouth threshold slider"
                  value={mouthThreshold}
                  onChangeCommitted={handleMouthThresholdChange}
                  getAriaValueText={(value: string) => value.toString()}
                  marks
                  step={0.1}
                  min={0.1}
                  max={0.9}
                  valueLabelDisplay="auto"
                  style={{flexGrow: 2}}
                />
              </Stack>
              <Stack>
                <Typography gutterBottom>Eyebrow threshold</Typography>
                <StyledSlider
                  aria-label="eyebrow threshold slider"
                  value={eyebrowThreshold}
                  onChangeCommitted={handleEyebrowThresholdChange}
                  getAriaValueText={(value: string) => value.toString()}
                  marks
                  step={0.1}
                  min={0.1}
                  max={0.9}
                  valueLabelDisplay="auto"
                />
              </Stack>
            </Stack>
            
          </Stack>
      </Stack>

        {trackingMode == "position" ? (
          <>
            <Stack flexDirection={"row"} justifyContent={"space-between"} alignItems={"center"} spacing={10} style={{marginTop: "5rem"}}>
              <Stack spacing={5} >


                <Stack>
                  <Typography gutterBottom>Horizontal sensitivity</Typography>
                  <StyledSlider
                    aria-label="mouse movement scale slider"
                    value={scaleFactor}
                    onChangeCommitted={handleScaleSliderChange}
                    getAriaValueText={(value: string) => value.toString()}
                    step={1}
                    marks
                    min={SCALE_FACTOR_X_LOWERBOUND}
                    max={SCALE_FACTOR_X_UPPERBOUND}
                    valueLabelDisplay="auto"
                  />
                </Stack>
                <Stack>
                  <Typography gutterBottom>Vertical sensitivity</Typography>
                  <StyledSlider
                    aria-label="mouse movement scale slider y"
                    value={scaleFactorY}
                    onChangeCommitted={handleScaleYSliderChange}
                    getAriaValueText={(value: string) => value.toString()}
                    step={1}
                    marks
                    min={SCALE_FACTOR_Y_LOWERBOUND}
                    max={SCALE_FACTOR_Y_UPPERBOUND}
                    valueLabelDisplay="auto"
                  />
                </Stack>

              </Stack>

              <Stack style={{ marginLeft: "5rem", marginTop: 0 }}>
                <ScreenExclusionForm />
              </Stack>

            </Stack>
          </>
        ) : (
          <>
            <Stack>
              <Typography gutterBottom>Step size</Typography>
              <StyledSlider
                value={joystickStepSize}
                onChangeCommitted={handleJoystickStepChange}
                getAriaValueText={(value: string) => value.toString()}
                step={1}
                min={5}
                max={50}
                valueLabelDisplay="auto"
              />
            </Stack>
            <Stack>
              <Typography gutterBottom>Horizontal sensitivity</Typography>
              <StyledSlider
                value={yawThreshold}
                onChangeCommitted={handleYawSliderChange}
                getAriaValueText={(value: string) => value.toString()}
                step={1}
                marks
                min={YAW_LOWERBOUND}
                max={YAW_UPPERBOUND}
                valueLabelDisplay="auto"
              />
            </Stack>
            <Stack>
              <Typography gutterBottom>Vertical sensitivity</Typography>
              <StyledSlider
                value={pitchThreshold}
                onChangeCommitted={handlePitchSliderChange}
                getAriaValueText={(value: string) => value.toString()}
                step={1}
                marks
                min={PITCH_LOWERBOUND}
                max={PITCH_UPPERBOUND}
                valueLabelDisplay="auto"
              />
            </Stack>
          </>
        )

        }
      </Stack>
      
    </Stack >
  );
};

export default Settings;
