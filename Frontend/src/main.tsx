import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";

const mainRoot = createRoot(document.getElementById("root")!);

mainRoot.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);