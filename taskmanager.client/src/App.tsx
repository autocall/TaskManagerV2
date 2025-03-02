import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Routes, Route, Link, NavigateFunction, useNavigate, NavLink } from "react-router-dom";
import "./App.css";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Projects from "./components/Projects";
import React, { useState, useEffect } from "react";
import authService from "./services/auth.service";
import IJwt from "./types/jwt.type";
import { NavDropdown, Spinner } from "react-bootstrap";
import { ThemeEnum } from "./enums/theme.enum";
import useAsyncEffect from "use-async-effect";
import Overview from "./components/Overview";
import Calendar from "./components/Calendar";

const App: React.FC = () => {
    const service = new authService(null);
    const navigate: NavigateFunction = useNavigate();

    const [currentUser, setCurrentUser] = useState<IJwt | undefined>(undefined);
    const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || ThemeEnum.Light);

    useAsyncEffect(async () => {
        let jwt = service.getCurrentUser();
        if (jwt) {
            setCurrentUser(jwt);
            let response = await service.identity();
            if (response.success) {
                // successed
            } else {
                if (response.status === 401) {
                    service.logout();
                    setCurrentUser(undefined);
                    navigate("/login");
                }
            }
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
        <div>
            <Navbar className="bg-dark d-flex" variant="dark">
                {!currentUser ? (
                    <Container>
                        <Nav className="flex-grow-1"></Nav>
                        <Nav>
                            {themeDropdown}
                            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/login">
                                Login
                            </NavLink>
                            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/signup">
                                Sign Up
                            </NavLink>
                        </Nav>
                    </Container>
                ) : (
                    <Container>
                        <Nav className="flex-grow-1">
                            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/">
                                Overview
                            </NavLink>
                            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/projects">
                                Projects
                            </NavLink>
                            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/calendar">
                                Calendar
                            </NavLink>
                        </Nav>
                        <Nav>
                            {themeDropdown}
                            <NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/profile">
                                <span className="d-none d-sm-block">{currentUser.Email} ({currentUser.Roles})</span>
                                <span className="d-block d-sm-none">Profile</span>
                            </NavLink>
                            <Link id="logout" className="nav-link" to="/login" onClick={logOut}>
                                Logout
                            </Link>
                        </Nav>
                    </Container>
                )}
            </Navbar>
            <Container className="mt-3" fluid>
                <Routes>
                    <Route path="/" element={<Overview />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/calendar" element={<Calendar />} />
                </Routes>
            </Container>
        </div>
    );
};

export default App;
