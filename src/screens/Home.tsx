import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import StyledSwitch from "../components/StyledSwitch";
import { TRACKING_STATUS } from "../config/config";
import { AppConfigContext } from "../store/AppConfigContext";
import Settings from "./Settings";

export interface Props { }
const TAG = "Home.tsx ";

const Home: React.FC<Props> = (props) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);

  const [numClicks, setNumClicks] = useState(false);
  const [clickDirection, setClickDirection] = useState(false);
  const [trackerLiveness, setTrackerLiveness] = useState(
    appConfig.trackerLiveness
  );

  const [homeToggle, setHomeToggle] = useState(true);
  const handleToggleClickDirection = (
    _: React.ChangeEvent<HTMLInputElement>,
    value: boolean
  ) => {
    setClickDirection(value);
    const newAppConfig = {
      ...appConfig,
      mouseCommands: { ...appConfig.mouseCommands, rightClick: value },
    };
    window.electronAPI.updateConfiguration(newAppConfig);
    setAppConfig(newAppConfig);
  };

  const handleToggleNumClicks = (
    _: React.ChangeEvent<HTMLInputElement>,
    value: boolean
  ) => {
    setNumClicks(value);
    const newAppConfig = {
      ...appConfig,
      mouseCommands: { ...appConfig.mouseCommands, doubleClick: value },
    };
    window.electronAPI.updateConfiguration(newAppConfig);
    setAppConfig(newAppConfig);
  };

  useEffect(() => {
    setClickDirection(appConfig.mouseCommands.rightClick);
    setNumClicks(appConfig.mouseCommands.doubleClick);
    setTrackerLiveness(appConfig.trackerLiveness);
  }, [appConfig]);

  const toggleHomeOrSettings = (home: boolean) => {
    if (home) {
      setHomeToggle(true);
    } else {
      setHomeToggle(false);
    }
  }


  return (
    <Stack
      flex={1}
      divider={<Divider flexItem />}
      spacing={5}>
      <nav className="tabs">
        <button className="button-10" onClick={() => toggleHomeOrSettings(true)}>
          Home
        </button>
        <button className="button-10" onClick={() => toggleHomeOrSettings(false)}>
          Settings
        </button>
      </nav>

      <Stack
        flex={1}
        spacing={5}
        alignItems={"center"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >

        {homeToggle ? (
          <Box flex={1}>
            {trackerLiveness ? (
              <>
                {appConfig.trackingStatus == TRACKING_STATUS.OFF ? (
                  <Typography variant="h6" className="textCenter">
                    Press ENTER to begin tracking
                  </Typography>
                ) : (
                  <Stack alignItems={"center"} spacing={2}>
                    <Chip label="Tracking" color="success" />
                    <Typography>Press ESC to stop tracking</Typography>
                    <Typography>Press CTRL+ALT+S to stop tracking from outside the app</Typography>
                  </Stack>
                )}
              </>
            ) : (
              <Stack alignItems={"center"} spacing={2} justifyContent={"center"}>
                <CircularProgress />
                <Typography variant="h6">Tracker is initializing...</Typography>
              </Stack>
            )}


            {/* <Stack style={{ flexDirection: "row", marginTop: 30 }} alignItems={"center"} justifyContent={"center"}>
              <Stack style={{ alignItems: "center" }}>
                <Typography gutterBottom>
                  {clickDirection ? "Disable" : "Enable"} right click
                </Typography>

                <StyledSwitch
                  checked={clickDirection}
                  onChange={handleToggleClickDirection}
                  inputProps={{ "aria-label": "right click swtich" }}
                />
              </Stack>
              <Stack style={{ width: 30 }}></Stack>
              <Stack style={{ alignItems: "center" }}>
                <Typography gutterBottom>
                  {numClicks ? "Disable" : "Enable"} double click
                </Typography>

                <StyledSwitch
                  checked={numClicks}
                  onChange={handleToggleNumClicks}
                  inputProps={{ "aria-label": "left click swtich" }}
                />
              </Stack>
            </Stack> */}
          </Box>) : (

          <Stack alignItems={"center"}>
            <Settings />
          </Stack>)}



      </Stack>

    </Stack>
  );
};

export default Home;
