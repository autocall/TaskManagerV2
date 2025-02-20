import { Col, Container, Row } from "react-bootstrap";
import Calendar from "./Calendar";
import "bootstrap/dist/css/bootstrap.css";

const Overview: React.FC = () => {
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Calendar />
                </Col>
                <Col>
                </Col>
                <Col></Col>
                <Col>4 of 4</Col>
            </Row>
        </Container>
    );
};
export default Overview;
