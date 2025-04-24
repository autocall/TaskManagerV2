import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Routes, Route, Link, NavigateFunction, useNavigate, NavLink, Navigate } from "react-router-dom";
import "./App.css";
import React, { Suspense, lazy, useState, useEffect } from "react";
import authService from "./services/auth.service";
import IJwt from "./types/jwt.type";
import { NavDropdown, Spinner } from "react-bootstrap";
import { ThemeEnum } from "./enums/theme.enum";
import useAsyncEffect from "use-async-effect";
import Overview from "./components/Overview";
import Calendar from "./components/Calendar";
import Report from "./components/Report";
import AuthRoute from "./components/shared/auth-route";
const Profile = lazy(() => import("./components/Profile"));
const LogIn = lazy(() => import("./components/LogIn"));
const SignUp = lazy(() => import("./components/SignUp"));
const Projects = lazy(() => import("./components/Projects"));
const Categories = lazy(() => import("./components/Categories"));

const App: React.FC = () => {
    const service = new authService(null);
    const navigate: NavigateFunction = useNavigate();

    const [currentUser, setCurrentUser] = useState<IJwt | undefined | null>(undefined);
    const [identity, setIdentity] = useState<any>(undefined);
    const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || ThemeEnum.Light);

    useAsyncEffect(async () => {
        let jwt = service.getCurrentUser();
        if (jwt) {
            setCurrentUser(jwt);
            let response = await service.identity();
            if (response.success) {
                window.identity = response.data;
                setIdentity(response.data);
                // successed
            } else {
                if (response.status === 401) {
                    service.logout();
                    setCurrentUser(null);
                    navigate("/login");
                }
            }
        } else {
            setCurrentUser(null);
        }
    }, []);

    useEffect(() => {
        document.body.setAttribute("data-bs-theme", theme);
    }, [theme]);

    const logOut = () => {
        service.logout();
        setCurrentUser(undefined);
    };

    const handleSelectTheme = (eventKey: string | null) => {
        if (eventKey) {
            document.body.setAttribute("data-bs-theme", eventKey);
            localStorage.setItem("theme", eventKey);
            setTheme(eventKey);
        }
    };

    const themeDropdown = (
        <NavDropdown
            title={theme === ThemeEnum.Dark ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-sun-fill"></i>}
            id="basic-nav-dropdown"
            onSelect={handleSelectTheme}>
            <NavDropdown.Item eventKey={ThemeEnum.Light}>
                <i className="bi bi-sun-fill"></i> Light
            </NavDropdown.Item>
            <NavDropdown.Item eventKey={ThemeEnum.Dark}>
                <i className="bi bi-moon-stars-fill"></i> Dark
            </NavDropdown.Item>
        </NavDropdown>
    );

    return (
        <div className="wrapper">
            <Navbar className="bg-dark d-flex" variant="dark" expand="md">
                {!currentUser ? (
                    <Container>
                        <Navbar.Toggle aria-controls="main-navbar" />
                        <Nav className="flex-grow-1"></Nav>
                        <Navbar.Collapse id="main-navbar">
                            <Nav className="me-auto"></Nav>
                            <Nav>
                                {themeDropdown}
                                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/login">
                                    Login
                                </NavLink>
                                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/signup">
                                    Sign Up
                                </NavLink>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                ) : (
                    <Container>
                        <Navbar.Toggle aria-controls="main-navbar" />
                        <Navbar.Collapse id="main-navbar">
                            <Nav className="me-auto">
                                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/">
                                    Overview
                                </NavLink>
                                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/calendar">
                                    Calendar
                                </NavLink>
                                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/projects">
                                    Projects
                                </NavLink>
                                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/categories">
                                    Categories
                                </NavLink>
                                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/report">
                                    Report
                                </NavLink>
                            </Nav>
                            <Nav>
                                {themeDropdown}
                                <NavLink className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} to="/profile">
                                    <span className="d-none d-sm-block">
                                        {currentUser.Email} ({currentUser.Roles})
                                    </span>
                                    <span className="d-block d-sm-none">Profile</span>
                                </NavLink>
                                <Link id="logout" className="nav-link" to="/login" onClick={logOut}>
                                    Logout
                                </Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                )}
            </Navbar>
            <Container className="mt-3 content" fluid>
                <Routes>
                    <Route
                        path="/login"
                        element={
                            <AuthRoute allowAuthenticated={false} currentUser={currentUser}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <LogIn />
                                </Suspense>
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <AuthRoute allowAuthenticated={false} currentUser={currentUser}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <SignUp />
                                </Suspense>
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <AuthRoute allowAuthenticated={true} currentUser={currentUser}>
                                <Overview />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/calendar"
                        element={
                            <AuthRoute allowAuthenticated={true} currentUser={currentUser}>
                                <Calendar />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/projects"
                        element={
                            <AuthRoute allowAuthenticated={true} currentUser={currentUser}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Projects />
                                </Suspense>
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/categories"
                        element={
                            <AuthRoute allowAuthenticated={true} currentUser={currentUser}>
                                <Suspense fallback={<div>Loading...</div>}>
                                    <Categories />
                                </Suspense>
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/report"
                        element={
                            <AuthRoute allowAuthenticated={true} currentUser={currentUser}>
                                <Report />
                            </AuthRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <AuthRoute allowAuthenticated={true} currentUser={currentUser}>
                                <Suspense fallback={<div>Loading...</div>}>{identity ? <Profile /> : <div>Loading...</div>}</Suspense>
                            </AuthRoute>
                        }
                    />
                </Routes>
            </Container>
        </div>
    );
};

export default App;
