import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./helpers/i18n";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./state/store/index";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
