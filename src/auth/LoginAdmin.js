import React from "react";
import LoginCardAdmin from "./LoginCardAdmin";

const LoginAdmin = () => {
  const auth = sessionStorage.getItem("token");

  if(!auth) {
    return (
      <div>    
        <LoginCardAdmin/>
      </div>
    );
  } else {
    window.history.back()
  }
};

export default LoginAdmin;
