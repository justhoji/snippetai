import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

const AuthContainer: React.FC = () => {
  const [authView, setAuthView] = useState<"login" | "register">("login");

  return authView === "login" ? (
    <Login onSwitchToRegister={() => setAuthView("register")} />
  ) : (
    <Register onSwitchToLogin={() => setAuthView("login")} />
  );
};

export default AuthContainer;
