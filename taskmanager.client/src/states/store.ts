import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { loginReducer, LoginState } from "./login.state";
import { signUpReducer, SignUpState } from "./signup.state";
import { projectReducer, ProjectState } from "./project.state";
import { projectsReducer, ProjectsState } from "./projects.state";
import { calendarReducer, CalendarState } from "./calendar.state";
import { eventReducer, EventState } from "./event.state";

export interface AppState {
    readonly loginState: LoginState;
    readonly signUpState: SignUpState;
    readonly projectsState: ProjectsState;
    readonly projectState: ProjectState;
    readonly calendarState: CalendarState;
    readonly eventState: EventState;
}

const rootReducer = combineReducers<AppState>({
    loginState: loginReducer,
    signUpState: signUpReducer,
    projectsState: projectsReducer,
    projectState: projectReducer,
    calendarState: calendarReducer,
    eventState: eventReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});
