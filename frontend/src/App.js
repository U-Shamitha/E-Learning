import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../src/components/Home"

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Home />
        <Routes>{/* <Route path="/" element={<Home/>}/> */}</Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
