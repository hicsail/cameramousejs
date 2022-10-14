import * as React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { SCREEN_PATHS } from "./constants/screenPaths";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import { createRoot } from "react-dom/client";
import { AppConfigContext } from "./store/AppConfigContext";
import { configuration } from "./config/config";

const TAG = "App.tsx ";

const App = (): JSX.Element => {
  const [appConfig, setAppConfig] = React.useState(configuration);
  const providerValue = {
    appConfig,
    setAppConfig,
  };
  return (
    <AppConfigContext.Provider value={providerValue}>
      <HashRouter>
        <Routes>
          <Route path={SCREEN_PATHS.HOME} element={<Home />} />
          <Route path={SCREEN_PATHS.SETTINGS} element={<Settings />} />
        </Routes>
      </HashRouter>
    </AppConfigContext.Provider>
  );
};

// @ts-ignore
const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
