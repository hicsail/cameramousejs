import * as React from "react";
import * as ReactDOM from "react-dom";
import { HashRouter, Route, Routes } from "react-router-dom";
import { SCREEN_PATHS } from "./constants/screenPaths";
import Home from "./screens/Home";
import Settings from "./screens/Settings";
const TAG = "App.tsx ";
import { createRoot } from "react-dom/client";

// import React from "react";
// import ReactDOM from "react-dom";
// import "./common/styles/styles.css";
// import App from "./App";

// @ts-ignore
const root = createRoot(document.getElementById("root") as HTMLElement);
// const root = createRoot(document.body);

root.render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path={SCREEN_PATHS.HOME} element={<Home />} />
        <Route path={SCREEN_PATHS.SETTINGS} element={<Home />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// reportWebVitals();
// ReactDOM.render(
//   <HashRouter>
//     <Routes>
//       <Route path={SCREEN_PATHS.HOME} element={<Home />} />
//       <Route path={SCREEN_PATHS.SETTINGS} element={<Home />} />
//     </Routes>
//   </HashRouter>,
//   document.getElementById("root")
// );

// const App = (): JSX.Element => {
//   return (
//     <HashRouter>
//       <Routes>
//         <Route path={SCREEN_PATHS.HOME} element={<Home />} />
//         <Route path={SCREEN_PATHS.SETTINGS} element={<Settings />} />
//       </Routes>
//     </HashRouter>
//   );
// };

// export default App;

//TODO fix "ReactDOM.render deprecated" issue
// function render() {
//   ReactDOM.render(
//     <HashRouter>
//       <Routes>
//         <Route path={SCREEN_PATHS.HOME} element={<Home />} />
//         <Route path={SCREEN_PATHS.SETTINGS} element={<Settings />} />
//       </Routes>
//     </HashRouter>,
//     document.getElementById("root")
//   );
// }

// render();
