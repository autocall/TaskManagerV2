import { Col, Collapse, Container, Row } from "react-bootstrap";
import Calendar from "./Calendar";
import "bootstrap/dist/css/bootstrap.css";

const Overview: React.FC = () => {
    return (
        <Container fluid>
            <Row>
                <Col lg="auto" className="d-none d-lg-block" style={{ width: "300px" }}>
                    <Calendar />
                </Col>
                <Col md={true}>2 of 4</Col>
                <Col md={true}>3 of 4</Col>
                <Col md={true}>4 of 4</Col>
            </Row>
        </Container>
    );
};
export default Overview;
