import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { loginReducer, LoginState } from "./login.state";
import { signUpReducer, SignUpState } from "./signup.state";
import { projectsReducer, ProjectsState } from "./project.state";

export interface AppState {
    readonly loginState: LoginState;
    readonly signUpState: SignUpState;
    readonly projectsState: ProjectsState;
}

const rootReducer = combineReducers<AppState>({
    loginState: loginReducer,
    signUpState: signUpReducer,
    projectsState: projectsReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});
