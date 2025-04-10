import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import Page404 from "./pages/Other/Page404";
import SearchTrip from "./pages/SearchTrip";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TripForm from "./pages/TripForm";
import UserJourneys from "./pages/UserJourneys";
import UserProfilePage from "./pages/UserProfile/UserProfilePage";

const AppRoutes = () => {
  const location = useLocation();
  const routesWithFooter = ["/"];

  const showFooter = routesWithFooter.includes(location.pathname);

  return (
    <Layout showFooter={showFooter}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="signup" element={<SignUpPage />} />
        <Route path="signin" element={<SignInPage />} />
        <Route path="search-result" element={<SearchTrip />} />
        <Route path="user/:id" element={<UserProfilePage />} />
        <Route path="tripform" element={<TripForm />} />
        <Route path="userjourneys" element={<UserJourneys />} />
        <Route path="404" element={<Page404 />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
