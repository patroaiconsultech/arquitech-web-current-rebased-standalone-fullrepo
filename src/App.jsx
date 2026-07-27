import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ArquitechLanding from "./routes/ArquitechLanding.jsx";
import AuthPage from "./routes/AuthPage.jsx";
import AppConsole from "./routes/AppConsole.jsx";
import BetaAccessGate from "./routes/BetaAccessGate.jsx";
import Terms from "./routes/legal/Terms.jsx";
import Privacy from "./routes/legal/Privacy.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ArquitechLanding />} />
        <Route path="/arquitech" element={<ArquitechLanding />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/app" element={<AppConsole />} />
        <Route path="/beta" element={<BetaAccessGate />} />
        <Route path="/legal/terms" element={<Terms />} />
        <Route path="/legal/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/arquitech" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
