import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSettingsStore } from './store/useSettingsStore';
import { useRoutineStore } from './store/useRoutineStore';
import LandingPage from "./pages/LandingPage";

// Layouts
import AppShell from './components/Layout/AppShell';

// Pages
import Dashboard from './components/dashboard/Dashboard';
import DailyPlanner from './components/planner/DailyPlanner';
import FocusTimer from './components/focus/FocusTimer';
import RoutineList from './components/routines/RoutineList';
import MoodJournal from './components/mood/MoodJournal';
import SettingsPage from './components/settings/SettingsPage';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';

function App() {
  const { settings } = useSettingsStore();
  
  // Initialize default routines
  React.useEffect(() => {
    const { initializeRoutines } = useRoutineStore.getState();
    initializeRoutines();
  }, []);
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={settings.onboardingCompleted ? <AppShell /> : <Welcome />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<AppShell />}>
          <Route index element={<OnboardingFlow />} />
        </Route>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="planner" element={<DailyPlanner />} />
          <Route path="focus" element={<FocusTimer />} />
          <Route path="routines" element={<RoutineList />} />
          <Route path="mood" element={<MoodJournal />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;