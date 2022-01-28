import React from "react";
import axios from "axios";

function App() {
  const googleAuthHandler = () => {
    window.open("http://localhost:8080/api/auth/google", "_self");
  };

  return (
    <div>
      <button onClick={googleAuthHandler}>Google</button>
    </div>
  );
}

export default App;
