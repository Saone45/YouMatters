import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  return (
    <Fragment>
      {loading === false && (
        <Route
          {...rest}
          element={(props) => {
            if (isAuthenticated === false) {
              return <Navigate to="/login" replace />;
            }

            if (isAdmin === true && user.role !== "admin") {
              return <Navigate to="/login" replace />;
            }

            return <Component {...props} />;
          }}
        />
      )}
    </Fragment>
  );
};

export default ProtectedRoute;
