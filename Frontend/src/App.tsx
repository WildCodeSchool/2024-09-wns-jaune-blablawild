import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import SearchTrip from "./pages/SearchTrip";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import TripForm from "./pages/TripForm";
import UserJourneys from "./pages/UserJourneys";

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
        <Route path="tripform" element={<TripForm />} />
        <Route path="userjourneys" element={<UserJourneys />} />
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
