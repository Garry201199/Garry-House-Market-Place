import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthStatus from "../Hooks/useAuthStatus";
import { XlviLoader } from "react-awesome-loaders";

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return (
      <div
        style={{
          display: "flex",
          height: "90vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <XlviLoader
          boxColors={["#20b6df", "#f9ed06", "#94d827"]}
          desktopSize={"128px"}
          mobileSize={"100px"}
        />
      </div>
    );
  }

  return loggedIn ? <Outlet></Outlet> : <Navigate to="/log-in"></Navigate>;
};

export default PrivateRoute;
