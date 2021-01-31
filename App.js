import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Routes } from "./src/routes";
import { AuthProvider } from "./src/providers/AuthProvider";

export default App = () => {
  return (
    <AuthProvider>
      <PaperProvider>
        <Routes />
      </PaperProvider>
    </AuthProvider>
  );
}