import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { TRACKING_STATUS } from "../config/config";
import { AppConfigContext } from "../store/AppConfigContext";
import Settings from "./Settings";

export interface Props {}
const TAG = "Home.tsx ";

const Home: React.FC<Props> = (props) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);

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
      </Box>

      <Stack alignItems={"center"}>
        <Settings />
      </Stack>
    </Stack>
  );
};

export default Home;
