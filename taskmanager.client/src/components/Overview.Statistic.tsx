import { Alert, Badge, Card, Container, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import useAsyncEffect from "use-async-effect";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../states/store";
import overviewService from "../services/overview.service";
import { testHelper } from "../helpers/test.helper";
import { gettingStatisticAction, gotStatisticAction } from "../states/statistic.state";
import { forwardRef, useImperativeHandle } from "react";

export type OverviewStatisticRef = {
    load: () => void;
  };

const OverviewStatistic = forwardRef<OverviewStatisticRef>((props, ref) => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.statisticState);

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    useImperativeHandle(ref, () => ({
        load
    }));

    const load = async () => {
        let service: overviewService = new overviewService(testHelper.getTestContainer(search));
        dispatch(gettingStatisticAction());
        let response = await service.getStatistic();
        dispatch(gotStatisticAction(response));
    };

    return (
        <Container fluid className="mt-2">
            {!state.error && (
                <Card key="statistic" className="column-card" style={{ position: "relative" }}>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Today Hours</span>
                            {state.statistic && (
                                <Badge pill bg="primary">
                                    {state.statistic?.TodayHours}h
                                </Badge>
                            )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <span>Week Hours</span>
                            {state.statistic && (
                                <Badge pill bg="primary">
                                    {state.statistic?.WeekHours}h
                                </Badge>
                            )}
                        </div>
                    </Card.Body>
                    {state.loading && (
                        <div className="loading-overlay">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}
                </Card>
            )}
            {state.error && <Alert variant="danger">{state.error}</Alert>}
        </Container>
    );
});
export default OverviewStatistic;
