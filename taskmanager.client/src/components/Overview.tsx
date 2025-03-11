import { Alert, Badge, Card, Col, Collapse, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import Calendar from "./Calendar.Current";
import "bootstrap/dist/css/bootstrap.css";
import Divider from "./shared/divider";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import useAsyncEffect from "use-async-effect";
import categoryService from "../services/category.service";
import { testHelper } from "../helpers/test.helper";
import { gettingCategoriesAction, gotCategoriesAction } from "../states/overview.state";
import taskService from "../services/task.service";
import stringExtension from "../extensions/string.extension";

const Overview: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.overviewState);

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        let service: taskService = new taskService(testHelper.getTestContainer(search));
        dispatch(gettingCategoriesAction());
        let response = await service.getAll();
        dispatch(gotCategoriesAction(response));
    };

    return (
        <Container fluid>
            <Row>
                <Col lg="auto" className="d-none d-lg-block" style={{ width: "300px" }}>
                    <Calendar />
                </Col>
                <Col md={true}>
                    {state.error && <Alert variant="danger">{state.error}</Alert>}
                    {state.loading ? (
                        <Row style={{ textAlign: "center" }}>
                            <Col colSpan={10}>
                                <Spinner animation="border" />
                            </Col>
                        </Row>
                    ) : (
                        state.categories?.map((category) => (
                            <Row key={category.Id}>
                                <Divider model={category} />
                                <Row>
                                    {Array.from({ length: 3 }, (_, column) => (
                                        <Col key={`${category.Id}-${column}`} md={true}>
                                            {category.Tasks.filter((task) => task.Column == column + 1)?.map((task) => (
                                                <Row key={task.Id}>
                                                    <Col>
                                                        <Card className="mb-2">
                                                            <Card.Body>
                                                                <Card.Title>{task.Title}</Card.Title>
                                                                <Card.Text>{task.Description}</Card.Text>
                                                            </Card.Body>
                                                            {task.Comments?.length > 0 && (
                                                            <ListGroup className="list-group-flush mx-3">
                                                                {task.Comments.map((comment) => (
                                                                    <ListGroup.Item key={comment.Id} className="px-0">
                                                                        {stringExtension.dateTimeToString(comment.DateTime)}:
                                                                        {comment.Text}
                                                                    </ListGroup.Item>
                                                                ))}
                                                            </ListGroup>
                                                            )}
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </Col>
                                    ))}
                                </Row>
                            </Row>
                        ))
                    )}
                </Col>
            </Row>
        </Container>
    );
};
export default Overview;
