import * as React from "react";
import { styled } from "@mui/material/styles";
import Switch,  { SwitchProps } from "@mui/material/Switch";

export const BigSwitch = styled(Switch)<SwitchProps>(({ theme }) => ({
  width: 102,
  height: 51,
  padding: 10.5,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      transform: "translateX(45px)",
    },
  },
  "& .MuiSwitch-thumb": {
    width: 49,
    height: 49,
  },
  "& .MuiSwitch-track": {
    borderRadius: 49 / 2,
  },
}));

export default function StyledSwitch(props:any) {
  return <BigSwitch {...props}/>;
}
