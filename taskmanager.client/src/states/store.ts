import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import { loginReducer, LoginState } from "./login.state";
import { signUpReducer, SignUpState } from "./signup.state";
import { projectReducer, ProjectState } from "./project.state";
import { categoryReducer, CategoryState } from "./category.state";
import { projectsReducer, ProjectsState } from "./projects.state";
import { categoriesReducer, CategoriesState } from "./categories.state";
import { calendarReducer, CalendarState } from "./calendar.state";
import { eventReducer, EventState } from "./event.state";
import { profileTimeZoneReducer, ProfileTimeZoneState } from "./profile.timezone.state";

export interface AppState {
    readonly loginState: LoginState;
    readonly signUpState: SignUpState;
    readonly projectsState: ProjectsState;
    readonly projectState: ProjectState;
    readonly categoriesState: CategoriesState;
    readonly categoryState: CategoryState;

    readonly calendarState: CalendarState;
    readonly eventState: EventState;
    readonly profileTimeZoneState: ProfileTimeZoneState;
}

const rootReducer = combineReducers<AppState>({
    loginState: loginReducer,
    signUpState: signUpReducer,
    projectsState: projectsReducer,
    projectState: projectReducer,
    categoriesState: categoriesReducer,
    categoryState: categoryReducer,
    calendarState: calendarReducer,
    eventState: eventReducer,
    profileTimeZoneState: profileTimeZoneReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});
