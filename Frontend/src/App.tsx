import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SearchTrip from "./pages/SearchTrip";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="search-result" element={<SearchTrip />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
