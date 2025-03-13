import { Alert, Container, Placeholder, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useAsyncEffect from "use-async-effect";
import { AppState } from "../states/store";
import calendarService from "../services/calendar.service";
import { testHelper } from "../helpers/test.helper";
import { useLocation } from "react-router-dom";
import { gettingCalendarAction, gotYearCalendarAction } from "../states/calendar.state";
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
        let service: calendarService = new calendarService(testHelper.getTestContainer(search));
        dispatch(gettingCalendarAction());
        //const start = performance.now();
        let response = await service.getYear();
        //const end = performance.now();
        //console.log(`Execution time: ${end - start} ms`);
        dispatch(gotYearCalendarAction(response));
    };

    return (
        <Container fluid className="scroll-content">
            <div className="row secondary-transparent-bg">
                {state.calendars &&
                    state.calendars.length > 0 &&
                    state.calendars.map((calendar) => (
                        <div
                            key={`${calendar.Year}-${calendar.Month}`}
                            className="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-3 col-xxl-2 p-2">
                            <CalendarView calendar={calendar} loading={state.loading} load={load}></CalendarView>
                        </div>
                    ))}
            </div>
            {state.error && <Alert variant="danger">{state.error}</Alert>}
        </Container>
    );
};
export default Calendar;
