import { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import useAsyncEffect from "use-async-effect";
import { Link } from "react-router-dom";
import { ProfileTimeZoneModel } from "../services/models/timezone.model";
import ProfileTimeZoneModal from "./Profile.TimeZone.Modal";
import IdentityModel from "../services/models/identity.model";

const Profile: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<IdentityModel | undefined>(undefined);
    const [profileTimeZoneModalData, setProfileTimeZoneModalData] = useState<ProfileTimeZoneModel | null>(null);

    useAsyncEffect(async () => {
        setCurrentUser(window.identity);
    }, []);

    const handleChangeTimeZone = () => {
        setProfileTimeZoneModalData(new ProfileTimeZoneModel({ TimeZoneId: currentUser!.TimeZone.Id ?? null }));
    };

    const handleCloseTimeZone = async (reload: boolean) => {
        setProfileTimeZoneModalData(null);
        if (reload) {
            window.location.reload();
        }
    };
    return (
        <Container className="scroll-content">
            <ProfileTimeZoneModal modalData={profileTimeZoneModalData} onClose={handleCloseTimeZone} />
            <Row className="justify-content-center">
                <Col className="text-center" style={{ maxWidth: "38rem" }}>
                    <Card>
                        <Card.Header>Profile</Card.Header>
                        <Card.Body>
                            {currentUser ? (
                                <Container>
                                    <Row css={{ minHeight: "2rem" }}>
                                        <Col css={{ textAlign: "right", color: "gray" }} xs="4">
                                            UserName
                                        </Col>
                                        <Col css={{ textAlign: "left" }}>{currentUser.UserName}</Col>
                                    </Row>
                                    <Row css={{ minHeight: "2rem" }}>
                                        <Col css={{ textAlign: "right", color: "gray" }} xs="4">
                                            Email
                                        </Col>
                                        <Col css={{ textAlign: "left" }}>{currentUser.Email}</Col>
                                    </Row>
                                    <Row css={{ minHeight: "2rem" }}>
                                        <Col css={{ textAlign: "right", color: "gray" }} xs="4">
                                            Roles
                                        </Col>
                                        <Col css={{ textAlign: "left" }}>{currentUser.Roles}</Col>
                                    </Row>
                                    <Row css={{ minHeight: "2rem" }}>
                                        <Col css={{ textAlign: "right", color: "gray" }} xs="4">
                                            TimeZone
                                        </Col>
                                        <Col css={{ textAlign: "left" }}>
                                            {currentUser.TimeZone.DisplayName}&nbsp;
                                            <Link to="#" onClick={() => handleChangeTimeZone()}>
                                                Change
                                            </Link>
                                        </Col>
                                    </Row>
                                    <Row css={{ minHeight: "2rem" }}>
                                        <Col css={{ textAlign: "right", color: "gray" }} xs="4">
                                            Password
                                        </Col>
                                        <Col css={{ textAlign: "left" }}>
                                            <Link to="#">Change</Link>
                                        </Col>
                                    </Row>
                                </Container>
                            ) : (
                                <>undefined</>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
