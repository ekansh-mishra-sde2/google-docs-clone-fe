import RichTextEditor from "./components/RichTextEditor";
import "./styles/styles.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          exact
          element={<Navigate to={`/documents/${uuidV4()}`} replace />}
        />
        <Route path="/documents/:id" element={<RichTextEditor />}></Route>
      </Routes>
    </Router>
  );

  // <RichTextEditor />;
}

export default App;
