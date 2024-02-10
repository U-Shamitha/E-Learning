import "./App.css";

import { HashRouter, Routes, Route } from "react-router-dom";

import Home from "./Components/Home.js"

function App() {
  return (
    <div className="App">
      <HashRouter>
        <Home />
        <Routes>{/* <Route path="/" element={<Home/>}/> */}</Routes>
      </HashRouter>
    </div>
  );
}

export default App;
