

import { BrowserRouter } from "react-router-dom";
import { useEffect } from "react";
import AppNavigator from "./Navigation/AppNavigator";
import useAuthStore from "./store/useAuthStore";

function App() {
  const restore = useAuthStore((s) => s.restore);

  useEffect(() => {
    restore();
  }, [restore]);

  return (
    <BrowserRouter>
      <AppNavigator />
    </BrowserRouter>
  );
}

export default App;
