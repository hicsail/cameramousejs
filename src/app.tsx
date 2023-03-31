import * as React from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { SCREEN_PATHS } from "./constants/screenPaths";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
import { createRoot } from "react-dom/client";
import { AppConfigContext } from "./store/AppConfigContext";
import { useEffect } from "react";
import { APP_CONFIGURATION } from "./constants/storageKeys";
import { configuration } from "./config/config";

const TAG = "App.tsx ";

const App = (): JSX.Element => {
  // const configFromStorageObject = localStorage.getItem(APP_CONFIGURATION);
  // const configFromStorage = JSON.parse(configFromStorageObject);
  // console.log("configFromStorage", configFromStorage);

  //TODO initialize appConfig to configFromStorage if it's not null
  const [appConfig, setAppConfig] = React.useState(configuration);

  // listen to config changes from main
  useEffect(() => {
    window.electronAPI.handleConfigurationUpdate(
      (_event: any, appConfiguration: any) => {
        console.log(
          "handleConfigurationChange triggered in react. value",
          appConfiguration
        );
        setAppConfig(appConfiguration);
        localStorage.setItem(
          APP_CONFIGURATION,
          JSON.stringify(appConfiguration)
        );
      }
    );
  }, []);

  const providerValue = {
    appConfig,
    // setAppConfig should be called anytime config is changed in renderer
    setAppConfig: (config: any) => {
      setAppConfig(config);
      localStorage.setItem(APP_CONFIGURATION, JSON.stringify(config));
      //send latest config state to main
      window.electronAPI.updateConfiguration(config);
    },
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
