import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
function ClientLayOut() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default ClientLayOut;
