import { Box, Chip, Divider, Stack, Switch, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { TRACKING_STATUS } from "../config/config";
import { AppConfigContext } from "../store/AppConfigContext";
import Settings from "./Settings";

export interface Props {}
const TAG = "Home.tsx ";

const Home: React.FC<Props> = (props) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);

  const [numClicks, setNumClicks] = useState();
  const [clickDirection, setClickDirection] = useState(false);

  const handleToggleClickEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    value: boolean
  ) => {
    setClickDirection(value);
    const newAppConfig = {
      ...appConfig,
      mouseCommands: { ...appConfig.mouseCommands, rightClick: value },
    };
    window.electronAPI.updateConfiguration(newAppConfig);
  };

  useEffect(() => {
    setClickDirection(appConfig.mouseCommands.rightClick);
  }, [appConfig]);

  return (
    <Stack
      flex={1}
      divider={<Divider flexItem />}
      spacing={10}
      alignItems={"center"}
    >
      <Box flex={1}>
        {appConfig.trackingStatus == TRACKING_STATUS.OFF ? (
          <Typography>Press ENTER to begin tracking</Typography>
        ) : (
          <Stack alignItems={"center"} spacing={2}>
            <Chip label="Tracking" color="success" />
            <Typography>Press ESC to stop tracking</Typography>
          </Stack>
        )}
        <Stack>
          <Typography variant="h6" gutterBottom>
            {clickDirection ? "Disable" : "Enable"} right click
          </Typography>
          <Switch
            checked={clickDirection}
            onChange={handleToggleClickEnabled}
            inputProps={{ "aria-label": "controlled" }}
          />
        </Stack>
      </Box>

      <Stack alignItems={"center"}>
        <Settings />
      </Stack>
    </Stack>
  );
};

export default Home;
