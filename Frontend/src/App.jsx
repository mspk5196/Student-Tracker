import { useEffect } from "react";
import AppNavigator from "./Navigation/AppNavigator";
import useAuthStore from "./store/useAuthStore";

function App() {
  const restore = useAuthStore((s) => s.restore);

  useEffect(() => {
    restore(); // Restore auth state from localStorage on app mount
  }, [restore]);

  return <AppNavigator />;
}

export default App;
