import React, { useState } from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import authService from "../services/auth.service";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormGroup from "./shared/form-group";
import {  submittingLoginAction, submittedLoginAction, LoginState } from "../states/login.state";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";

const LogIn: React.FC = () => {
    const { search } = useLocation();
    const navigate: NavigateFunction = useNavigate();
    const dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.loginState);

    const validationSchema = Yup.object().shape({
        email: Yup.string().email("This is not a valid email.").required("This field is required!"),
        password: Yup.string().required("This field is required!"),
    });

    const handleSubmit = async (model: LoginState) => {
            let queryParams = new URLSearchParams(search);
            let error = queryParams.get("error");
            let service = new authService(error);
        dispatch(submittingLoginAction());
        const response = await service.login(model.email, model.password);
        dispatch(submittedLoginAction(response));
        if (response.success) {
            navigate("/");
            window.location.reload();
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <Card style={{ width: "24rem", display: "inline-block" }}>
                <Card.Header>Login</Card.Header>
                <Card.Body style={{ textAlign: "left" }}>
                    <Formik initialValues={state} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form onSubmit={handleSubmit}>
                                <FormGroup error={touched.email && (errors.email ?? state.errors.email)}>
                                    <Field name="email" type="email" placeholder="Email" className="form-control" />
                                </FormGroup>

                                <FormGroup error={touched.password && (errors.password ?? state.errors.password)}>
                                    <Field name="password" type="password" placeholder="Password" className="form-control" />
                                </FormGroup>

                                <FormGroup error={state.error}>
                                    <Button type="submit" variant="primary" disabled={state.submitting}>
                                        {state.submitting && <span className="spinner-border spinner-border-sm"></span>}
                                        {!state.submitting && <span>Login</span>}
                                    </Button>
                                </FormGroup>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>
        </div>
    );
};

export default LogIn;
