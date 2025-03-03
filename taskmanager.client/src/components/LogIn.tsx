import React, { useState } from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import authService from "../services/auth.service";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormGroup from "./shared/form-group";
import { submittingLoginAction, submittedLoginAction, LoginState } from "../states/login.state";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import test from "node:test";
import { testHelper } from "../helpers/test.helper";
import { Col, Container, Row } from "react-bootstrap";

const LogIn: React.FC = () => {
    const { search } = useLocation();
    const navigate: NavigateFunction = useNavigate();
    const dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.loginState);

    const validationSchema = Yup.object().shape({
        Email: Yup.string().email("This is not a valid email.").required("This field is required!"),
        Password: Yup.string().required("This field is required!"),
    });

    const handleSubmit = async (model: LoginState) => {
        let service = new authService(testHelper.getTestContainer(search));
        dispatch(submittingLoginAction());
        const response = await service.login(model.Email, model.Password);
        dispatch(submittedLoginAction(response));
        if (response.success) {
            navigate("/");
            window.location.reload();
        }
    };

    return (
        <Container>
            <Row className="justify-content-center">
                <Col className="text-center" style={{ maxWidth: "24rem" }}>
                    <Card>
                        <Card.Header>Login</Card.Header>
                        <Card.Body style={{ textAlign: "left" }}>
                            <Formik initialValues={state} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                {({ handleSubmit, handleChange, values, touched, errors }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup error={touched.Email && (errors.Email ?? state.errors.Email)}>
                                            <Field name="Email" type="email" placeholder="Email" className="form-control" />
                                        </FormGroup>

                                        <FormGroup error={touched.Password && (errors.Password ?? state.errors.Password)}>
                                            <Field name="Password" type="password" placeholder="Password" className="form-control" />
                                        </FormGroup>

                                        <FormGroup error={state.error} className="d-grid">
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
                </Col>
            </Row>
        </Container>
    );
};

export default LogIn;
