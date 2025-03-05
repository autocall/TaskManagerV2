import { Col, Collapse, Container, Row } from "react-bootstrap";
import Calendar from "./Calendar.Current";
import "bootstrap/dist/css/bootstrap.css";
import Divider from "./shared/divider";

const Overview: React.FC = () => {
    return (
        <Container fluid>
            <Row>
                <Col lg="auto" className="d-none d-lg-block" style={{ width: "300px" }}>
                    <Calendar />
                </Col>
                <Col md={true}>
                    <Row>
                        <Divider>
                            <a className="mx-3 text-decoration-none">↓ Show Details ↓</a>
                        </Divider>
                        <Container>
                            <Row>
                                <Col md={true}>2 of 4</Col>
                                <Col md={true}>3 of 4</Col>
                                <Col md={true}>4 of 4</Col>
                            </Row>
                        </Container>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};
export default Overview;
