import * as React from "react";
import * as ReactDOM from "react-dom";

function render() {
  const handleClick = () => {
    window.electronAPI.moveMouse();
    console.log("button clicked. window. electronAPI", window.electronAPI);
  };
  ReactDOM.render(
    <>
      <h2>Camera Mouse UI</h2>
      <button onClick={handleClick}>Move mouse</button>
    </>,
    document.body
  );
}

render();
