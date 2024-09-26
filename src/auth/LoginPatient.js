import React from "react";
import LoginCardPatient from "./LoginCardPatient";

const LoginPatient = () => {
  const auth = sessionStorage.getItem("token");
  if (!auth) {
    return (
      <div>
        <LoginCardPatient />
      </div>
    );
  } else {
    window.history.back()
  }
};

export default LoginPatient;
