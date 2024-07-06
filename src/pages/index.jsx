import React, { useState } from "react";
import { Demo } from "../Demo";

export const Home = () => {
  const [showDemo, setShowDemo] = useState(true);
  return (
    <>
      <button onClick={() => setShowDemo(!showDemo)}>Toggle Demo</button>
      {showDemo && <Demo />}
    </>
  );
};
