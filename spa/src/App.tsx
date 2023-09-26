import React from 'react';
import './App.css';
import {ConfigProvider, theme, App as AntApp} from "antd";
import UploadAudio from "./components/UploadAudio";

function App() {
  return (
    <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm
        }}
    >
      <AntApp>
        <div className="App">
            <UploadAudio/>
        </div>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;
