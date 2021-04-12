import React from "react";
//Packages-----------------
import { Redirect, Route } from "react-router-dom";
//Function importing-----------------
import { isAuthenticated } from "./index";

const AdminRoutes = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        return isAuthenticated() && isAuthenticated().user.role === 1 ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: props.location },
            }}
          />
        );
      }}
    />
  );
};

export default AdminRoutes;
