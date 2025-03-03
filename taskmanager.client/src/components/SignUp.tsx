import React, { useState } from "react";
import { NavigateFunction, useLocation, useNavigate } from "react-router-dom";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import authService from "../services/auth.service";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormGroup from "./shared/form-group";
import { useDispatch, useSelector } from "react-redux";
import { SignUpState, submittedSignUpAction, submittingSignUpAction } from "../states/signup.state";
import { AppState } from "../states/store";
import { testHelper } from "../helpers/test.helper";
import { Col, Container, Row } from "react-bootstrap";

const SingUp: React.FC = () => {
    const { search } = useLocation();
    const navigate: NavigateFunction = useNavigate();
    const dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.signUpState);

    const validationSchema = Yup.object().shape({
        UserName: Yup.string()
            .test(
                "len",
                "The username must be between 3 and 20 characters.",
                (val: any) => val && val.toString().length >= 3 && val.toString().length <= 20,
            )
            .required("This field is required!"),
        Email: Yup.string().email("This is not a valid email.").required("This field is required!"),
        Password: Yup.string()
            .test(
                "len",
                "The password must be between 6 and 40 characters.",
                (val: any) => val && val.toString().length >= 6 && val.toString().length <= 40,
            )
            .required("This field is required!"),
        ConfirmPassword: Yup.string()
            .oneOf([Yup.ref("Password")], "Passwords must match")
            .required("This field is required!"),
    });

    const handleSubmit = async (model: SignUpState) => {
        let service = new authService(testHelper.getTestContainer(search));
        dispatch(submittingSignUpAction());
        let response = await service.register(model.UserName, model.Email, model.Password);
        dispatch(submittedSignUpAction(response));
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
                        <Card.Header>Register</Card.Header>
                        <Card.Body style={{ textAlign: "left" }}>
                            <Formik initialValues={state} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                {({ handleSubmit, handleChange, values, touched, errors }) => (
                                    <Form onSubmit={handleSubmit}>
                                        <FormGroup error={touched.UserName && (errors.UserName ?? state.errors.UserName)}>
                                            <Field name="UserName" type="username" placeholder="UserName" className="form-control" />
                                        </FormGroup>

                                        <FormGroup error={touched.Email && (errors.Email ?? state.errors.Email)}>
                                            <Field name="Email" type="email" placeholder="Email" className="form-control" />
                                        </FormGroup>

                                        <FormGroup error={touched.Password && (errors.Password ?? state.errors.Password)}>
                                            <Field name="Password" type="password" placeholder="Password" className="form-control" />
                                        </FormGroup>

                                        <FormGroup
                                            error={touched.ConfirmPassword && (errors.ConfirmPassword ?? state.errors.ConfirmPassword)}>
                                            <Field
                                                name="ConfirmPassword"
                                                type="password"
                                                placeholder="Confirm Password"
                                                className="form-control"
                                            />
                                        </FormGroup>
                                        <FormGroup error={state.error} className="d-grid">
                                            <Button type="submit" variant="primary" disabled={state.submitting}>
                                                {state.submitting && <span className="spinner-border spinner-border-sm"></span>}
                                                {!state.submitting && <span>Register</span>}
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

export default SingUp;
