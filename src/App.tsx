import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSettingsStore } from './store/useSettingsStore';
import { useRoutineStore } from './store/useRoutineStore';

// Layout
import AppShell from './components/Layout/AppShell';

// Pages
import LandingPage from './pages/LandingPage';
// import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Dashboard from './components/dashboard/Dashboard';
import DailyPlanner from './components/planner/DailyPlanner';
import FocusTimer from './components/focus/FocusTimer';
import RoutineList from './components/routines/RoutineList';
import MoodJournal from './components/mood/MoodJournal';
import SettingsPage from './components/settings/SettingsPage';
import OnboardingFlow from './components/onboarding/OnboardingFlow';

function App() {
  const { settings } = useSettingsStore();

  // Initialize default routines on app load
  React.useEffect(() => {
    const { initializeRoutines } = useRoutineStore.getState();
    initializeRoutines();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect "/" based on onboarding status */}
        <Route
          path="/"
          element={
            settings.onboardingCompleted ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/landing" replace />
            )
          }
        />

        {/* Public pages */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />

        {/* Onboarding route */}
        <Route path="/onboarding" element={<AppShell />}>
          <Route index element={<OnboardingFlow />} />
        </Route>

        {/* Main app routes (protected layout) */}
        <Route path="/" element={<AppShell />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="planner" element={<DailyPlanner />} />
          <Route path="focus" element={<FocusTimer />} />
          <Route path="routines" element={<RoutineList />} />
          <Route path="mood" element={<MoodJournal />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
