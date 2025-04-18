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
import { overviewReducer, OverviewState } from "./overview.state";
import { taskReducer, TaskState } from "./task.state";
import { commentReducer, CommentState } from "./comment.state";
import { reportReducer, ReportState } from "./report.state";
import { statisticReducer, StatisticState } from "./statistic.state";

export interface AppState {
    readonly loginState: LoginState;
    readonly signUpState: SignUpState;
    readonly projectsState: ProjectsState;
    readonly projectState: ProjectState;
    readonly categoriesState: CategoriesState;
    readonly categoryState: CategoryState;
    readonly overviewState: OverviewState;
    readonly statisticState: StatisticState;
    readonly taskState: TaskState;
    readonly commentState: CommentState;
    readonly calendarState: CalendarState;
    readonly eventState: EventState;
    readonly profileTimeZoneState: ProfileTimeZoneState;
    readonly reportState: ReportState;
}

const rootReducer = combineReducers<AppState>({
    loginState: loginReducer,
    signUpState: signUpReducer,
    projectsState: projectsReducer,
    projectState: projectReducer,
    calendarState: calendarReducer,
    categoriesState: categoriesReducer,
    categoryState: categoryReducer,
    overviewState: overviewReducer,
    statisticState: statisticReducer,
    taskState: taskReducer,
    commentState: commentReducer,
    eventState: eventReducer,
    profileTimeZoneState: profileTimeZoneReducer,
    reportState: reportReducer
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
        }),
});
