import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppNavigation from "./navigation";
import UserContextProvider from "./store/UserContext";

function App() {
  return (
    <>
      <UserContextProvider>
        <Router>
          <AppNavigation/>
        </Router>
      </UserContextProvider>
    </>
  );
}

export default App;
