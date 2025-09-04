import React from "react";
import Navbar from "./Navbar";
import LogoWindow from "./LogoForLogin";
import LoginForm from "./LoginForm";

function Login() {
  return (
    <div className="min-h-screen flex flex-col ">
    <div className="justify-items-start">
      <Navbar />
    </div>
      <div className="flex flex-1 overflow-auto">
        <LogoWindow />
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;
