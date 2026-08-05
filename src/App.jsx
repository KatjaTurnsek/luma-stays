import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Loader from "./components/Loader";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

const HomePage = lazy(() => import("./pages/HomePage"));
const VenuesPage = lazy(() => import("./pages/VenuesPage"));
const VenueDetailsPage = lazy(() => import("./pages/VenueDetailsPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const CreateVenuePage = lazy(() => import("./pages/CreateVenuePage"));
const EditVenuePage = lazy(() => import("./pages/EditVenuePage"));
const HelpPage = lazy(() => import("./pages/HelpPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Suspense
        fallback={
          <div className="container ui-section">
            <Loader text="Loading page..." />
          </div>
        }
      >
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/venues" element={<VenuesPage />} />
            <Route path="/venues/:id" element={<VenueDetailsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/venues/create"
              element={
                <ProtectedRoute requireVenueManager>
                  <CreateVenuePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/venues/:id/edit"
              element={
                <ProtectedRoute requireVenueManager>
                  <EditVenuePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
