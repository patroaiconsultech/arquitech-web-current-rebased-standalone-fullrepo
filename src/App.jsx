import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ArquitechLanding from "./routes/ArquitechLanding.jsx";
import AuthPage from "./routes/AuthPage.jsx";
import AppConsole from "./routes/AppConsole.jsx";
import BetaAccessGate from "./routes/BetaAccessGate.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArquitechLanding />} />
        <Route path="/arquitech" element={<ArquitechLanding />} />

        <Route
          path="/auth"
          element={
            <BetaAccessGate>
              <AuthPage />
            </BetaAccessGate>
          }
        />

        <Route
          path="/app"
          element={
            <BetaAccessGate>
              <AppConsole />
            </BetaAccessGate>
          }
        />

        <Route
          path="/orkio/app"
          element={
            <BetaAccessGate>
              <AppConsole />
            </BetaAccessGate>
          }
        />

        <Route path="*" element={<Navigate to="/arquitech" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
