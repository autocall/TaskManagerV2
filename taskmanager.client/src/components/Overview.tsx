import { Alert, Card, Col, Container, ListGroup, Row, Spinner } from "react-bootstrap";
import Calendar from "./Calendar.Current";
import "bootstrap/dist/css/bootstrap.css";
import Divider from "./shared/divider";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import useAsyncEffect from "use-async-effect";
import { testHelper } from "../helpers/test.helper";
import { gettingCategoriesAction, gotCategoriesAction } from "../states/overview.state";
import overviewService from "../services/overview.service";
import authService from "../services/auth.service";
import { useState } from "react";
import IJwt from "../types/jwt.type";
import OverviewTask from "./Overview.Task";

const Overview: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.overviewState);
    const [currentUser, setCurrentUser] = useState<IJwt | null>(null);

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        let user = new authService(null).getCurrentUser();
        setCurrentUser(user);

        let service: overviewService = new overviewService(testHelper.getTestContainer(search));
        dispatch(gettingCategoriesAction());
        let response = await service.get();
        dispatch(gotCategoriesAction(response));
    };

    return (
        <>
            <Col lg="auto" className="d-none d-lg-block" style={{ width: "280px" }}>
                <Calendar />
            </Col>
            {/* Col(scroll-content) - moves toolbar to scroll-container */}
            {/* Col(main-section) + div(scroll-content) - fixes toolbar */}
            <Col md={true} /*className="main-section"*/ className="scroll-content">
                <div className="main-section">
                    {/* toolbar */}
                    <Card>
                        <Card.Body>
                            <Link>Task</Link>
                        </Card.Body>
                    </Card>
                    {/* categories + tasks */}
                    <div /* className="scroll-content" */>
                        {state.error && <Alert variant="danger">{state.error}</Alert>}
                        {state.loading ? (
                            <Row style={{ textAlign: "center", marginTop: "1em" }}>
                                <Col colSpan={10}>
                                    <Spinner animation="border" />
                                </Col>
                            </Row>
                        ) : (
                            state.categories?.map((category) => (
                                <Row key={"category" + category.Id}>
                                    <Divider model={category} />
                                    <Row className="column-row">
                                        {Array.from({ length: 3 }, (_, column) => (
                                            <Col key={category.Id + column} md={true}>
                                                {category.Tasks?.filter((task) => task.Column == column + 1)?.map((task) => (
                                                    <OverviewTask key={"task" + task.Id} task={task} currentUser={currentUser} />
                                                ))}
                                            </Col>
                                        ))}
                                    </Row>
                                </Row>
                            ))
                        )}
                    </div>
                </div>
            </Col>
        </>
    );
};
export default Overview;
