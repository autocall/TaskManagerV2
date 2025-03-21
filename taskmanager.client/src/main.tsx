import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./bootstrap-default.scss";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./states/store.ts";
import { ToastProvider } from "./components/shared/toast-manager.tsx";

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <BrowserRouter>
            <ToastProvider>
                <App />
            </ToastProvider>
        </BrowserRouter>
    </Provider>,
);
