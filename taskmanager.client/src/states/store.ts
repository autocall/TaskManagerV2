import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { loginReducer, LoginState } from "./login.state";
import { signUpReducer, SignUpState } from "./signup.state";
import { projectReducer, ProjectState } from "./project.state";
import { projectsReducer, ProjectsState } from "./projects.state";

export interface AppState {
    readonly loginState: LoginState;
    readonly signUpState: SignUpState;
    readonly projectsState: ProjectsState;
    readonly projectState: ProjectState;
}

const rootReducer = combineReducers<AppState>({
    loginState: loginReducer,
    signUpState: signUpReducer,
    projectsState: projectsReducer,
    projectState: projectReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});
