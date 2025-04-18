import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
