import { Stack, Typography, Slider } from "@mui/material";

export interface Props {}

import { AppConfigContext } from "../store/AppConfigContext";
import React, { useContext } from "react";
import StyledSlider from "./StyledSlider";

function ScreenExclusionSlider(props: {
  direction: string;
  onUpdate: (direction: string, percentage: number) => void;
}) {
  return (
    <Stack style={{ alignItems: "center", width: 80 }}>
      <Typography>{props.direction}</Typography>
      <StyledSlider
        aria-label={props.direction + "exclusion slider y"}
        onChangeCommitted={(_: Event, newValue: number | number[]) => {
          if (typeof newValue == "number") {
            props.onUpdate(props.direction, newValue * 0.01);
          }
        }}
        step={1}
        min={0}
        max={45}
        valueLabelDisplay="auto"
        size="small"
      />
    </Stack>
  );
}

const ScreenExclusionForm: React.FC<Props> = (props) => {
  const { appConfig, setAppConfig } = useContext(AppConfigContext);

  const updateScreenExclusionBoundaries = (
    direction: string,
    percentage: number
  ) => {
    const newBep = {
      ...appConfig.boundaryExclusionPercentage,
      [direction]: percentage,
    };
    console.log("newBep", newBep);

    const newAppConfig = { ...appConfig, boundaryExclusionPercentage: newBep };
    window.electronAPI.updateConfiguration(newAppConfig);
    setAppConfig(newAppConfig);
  };

  return (
    <Stack style={{ flex: 1, alignItems: "center" }}>
      <Typography gutterBottom>Screen exclusion</Typography>
      <ScreenExclusionSlider
        direction="top"
        onUpdate={updateScreenExclusionBoundaries}
      />
      <Stack style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ScreenExclusionSlider
          direction="left"
          onUpdate={updateScreenExclusionBoundaries}
        />
        <Stack style={{ width: 150 }} />
        <ScreenExclusionSlider
          direction="right"
          onUpdate={updateScreenExclusionBoundaries}
        />
      </Stack>
      <ScreenExclusionSlider
        direction="bottom"
        onUpdate={updateScreenExclusionBoundaries}
      />
    </Stack>
  );
};

export default ScreenExclusionForm;
