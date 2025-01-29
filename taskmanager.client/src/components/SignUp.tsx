import React, { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
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

const SingUp: React.FC = () => {
    const navigate: NavigateFunction = useNavigate();
    const dispatch = useDispatch();
    const state = useSelector((s: AppState) => s.signUpState);

    const validationSchema = Yup.object().shape({
        username: Yup.string()
            .test(
                "len",
                "The username must be between 3 and 20 characters.",
                (val: any) => val && val.toString().length >= 3 && val.toString().length <= 20,
            )
            .required("This field is required!"),
        email: Yup.string().email("This is not a valid email.").required("This field is required!"),
        password: Yup.string()
            .test(
                "len",
                "The password must be between 6 and 40 characters.",
                (val: any) => val && val.toString().length >= 6 && val.toString().length <= 40,
            )
            .required("This field is required!"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("This field is required!"),
    });

    const handleSubmit = async (model: SignUpState) => {
        const service = new authService();
        dispatch(submittingSignUpAction());
        const response = await service.register(model.username, model.email, model.password);
        dispatch(submittedSignUpAction(response));
        if (response.success) {
            navigate("/");
            window.location.reload();
        }
    };

    return (
        <div style={{ textAlign: "center" }}>
            <Card style={{ width: "24rem", display: "inline-block" }}>
                <Card.Header>Register</Card.Header>
                <Card.Body style={{ textAlign: "left" }}>
                    <Formik initialValues={state} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ handleSubmit, handleChange, values, touched, errors }) => (
                            <Form onSubmit={handleSubmit}>
                                <FormGroup error={touched.username && (errors.username ?? state.errors.username)}>
                                    <Field name="username" type="username" placeholder="UserName" className="form-control" />
                                </FormGroup>

                                <FormGroup error={touched.email && (errors.email ?? state.errors.email)}>
                                    <Field name="email" type="email" placeholder="Email" className="form-control" />
                                </FormGroup>

                                <FormGroup error={touched.password && (errors.password ?? state.errors.password)}>
                                    <Field name="password" type="password" placeholder="Password" className="form-control" />
                                </FormGroup>

                                <FormGroup error={touched.confirmPassword && (errors.confirmPassword ?? state.errors.confirmPassword)}>
                                    <Field name="confirmPassword" type="password" placeholder="Confirm Password" className="form-control" />
                                </FormGroup>
                                <FormGroup error={state.error}>
                                    <Button type="submit" className="btn btn-primary w-100" disabled={state.submitting}>
                                        {state.submitting && <span className="spinner-border spinner-border-sm"></span>}
                                        {!state.submitting && <span>Register</span>}
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

export default SingUp;
