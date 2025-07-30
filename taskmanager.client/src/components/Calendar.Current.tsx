import { Alert, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useAsyncEffect from "use-async-effect";
import { AppState } from "../states/store";
import calendarService from "../services/calendar.service";
import { testHelper } from "../helpers/test.helper";
import { useLocation } from "react-router-dom";
import { gettingCalendarAction, gotCurrentCalendarAction } from "../states/calendar.state";
import "./Calendar.scss";
import "../../settings";
import CalendarView from "./Calendar.View";

const Calendar: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.calendarState);

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        //setShowManageDay(null); delete code
        let service = new calendarService(testHelper.getTestContainer(search));
        dispatch(gettingCalendarAction());
        //const start = performance.now();
        let response = await service.getCurrent();
        //const end = performance.now();
        //console.log(`Execution time: ${end - start} ms`);
        dispatch(gotCurrentCalendarAction(response));
    };

    return (
        <Container fluid>
            {!state.error && <CalendarView calendar={state.calendar} loading={state.loading} load={load}></CalendarView>}
            {state.error && <Alert variant="danger">{state.error}</Alert>}
        </Container>
    );
};
export default Calendar;
