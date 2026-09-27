import AppRoutes from "./routes/AppRoutes";
import { StudyProvider } from "./context/StudyContext";

function App() {
  return (
    <StudyProvider>
      <div className="min-h-screen bg-[#F6F7FA]">
        <AppRoutes />
      </div>
    </StudyProvider>
  );
}

export default App;