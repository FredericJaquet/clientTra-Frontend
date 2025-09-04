import React from "react";
import logo from "../assets/img/logo1_transparent.png";

function LogoWindow() {
  return (
    <div className="min-h-screen w-1/2 flex items-center justify-center">
      <img src={logo} alt="Logo" className="max-w-full h-auto" />
    </div>
  );
}

export default LogoWindow;
