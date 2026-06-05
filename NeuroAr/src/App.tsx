import { Routes, Route } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { PatientPage } from "./pages/PatientPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route
        path="/app"
        element={
          <AppShell>
            <Dashboard />
          </AppShell>
        }
      />
      <Route
        path="/app/paciente/:id"
        element={
          <AppShell>
            <PatientPage />
          </AppShell>
        }
      />
    </Routes>
  );
}
