import { Col, Collapse, Container, Row, Spinner } from "react-bootstrap";
import Calendar from "./Calendar.Current";
import "bootstrap/dist/css/bootstrap.css";
import Divider from "./shared/divider";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../states/store";
import CategoryModel from "../services/models/category.model";
import { useState } from "react";
import { useConfirm } from "./shared/confirm";
import useAsyncEffect from "use-async-effect";
import categoryService from "../services/category.service";
import { testHelper } from "../helpers/test.helper";
import { gettingCategoriesAction, gotCategoriesAction } from "../states/overview.state";

const Overview: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.overviewState);
    const [modalData, setModalData] = useState<CategoryModel | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        let service: categoryService = new categoryService(testHelper.getTestContainer(search));
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
                    {state.loading ? (
                        <Row style={{ textAlign: "center" }}>
                            <Col colSpan={10}>
                                <Spinner animation="border" />
                            </Col>
                        </Row>
                    ) : (
                        state.categories?.map((category) => (
                            <Row key={category.Id}>
                                <Divider model={category}/>
                                    <Row>
                                        <Col md={true}>2 of 4</Col>
                                        <Col md={true}>3 of 4</Col>
                                        <Col md={true}>4 of 4</Col>
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
