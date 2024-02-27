import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { Landing, Quiz, ChooseRecipient, Test, Recommendation, Login } from "./pages";
import { Route, Routes } from "react-router-dom";
import { useAIStateValue } from "./context/AIStateProvider";

function App() {
  const [{ userInfo, recipient, password }, dispatch] = useAIStateValue();

  return (
    <div className="App w-screen h-screen">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute password={password} component={<ChooseRecipient />} />} />
        <Route
          path="/recommendation"
          element={<ProtectedRoute component={<Recommendation />} checkMessages checkValues={{ ...userInfo, recipient: recipient }} />}
        />
        <Route path="/selection" element={<ProtectedRoute component={<Landing />} checkValues={{ recipient: recipient }} />} />
        <Route path="/quiz" element={<ProtectedRoute component={<Quiz />} checkValues={{ ...userInfo, recipient: recipient }} />} />
        <Route path="*" element={<h1>COULDNT FIND THE PAGE</h1>} />
      </Routes>
    </div>
  );
}

export default App;
