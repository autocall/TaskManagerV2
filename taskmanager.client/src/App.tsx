import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { Routes, Route, Link, NavigateFunction, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import React, { useState, useEffect } from "react";
import authService from "./services/auth.service";
import IJwt from "./types/jwt.type";
import { NavDropdown, Spinner } from "react-bootstrap";
import { ThemeEnum } from "./enums/theme.enum";

const App: React.FC = () => {
    const service = new authService();
    const navigate: NavigateFunction = useNavigate();

    const [currentUser, setCurrentUser] = useState<IJwt | undefined>(undefined);
    const [theme, setTheme] = useState<string>(localStorage.getItem("theme") || ThemeEnum.Light);

    useEffect(() => {
        (async function () {
            const jwt = service.getCurrentUser();
            if (jwt) {
                setCurrentUser(jwt);
                const response = await service.identity();
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
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                            <Link className="nav-link" to="/login">
                                Login
                            </Link>
                            <Link className="nav-link" to="/signup">
                                Sign Up
                            </Link>
                        </Nav>
                    </Container>
                ) : (
                    <Container>
                        <Nav className="flex-grow-1">
                            <Link className="nav-link" to="/">
                                Home
                            </Link>
                        </Nav>
                        <Nav>
                            {themeDropdown}
                            <Link className="nav-link" to="/profile">
                                {currentUser.Email} ({currentUser.Roles})
                            </Link>
                            <Link className="nav-link" to="/login" onClick={logOut}>
                                Logout
                            </Link>
                        </Nav>
                    </Container>
                )}
            </Navbar>
            <div className="container mt-3">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<LogIn />} />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
