import React from "react";
import LoginCardUser from "./LoginCardUser";

const LoginUser = () => {
  const auth = sessionStorage.getItem("token");
  if (!auth) {
    return (
      <div>
        <LoginCardUser />
      </div>
    );
  } else {
    window.history.back()
  }
};

export default LoginUser;
