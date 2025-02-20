import { Button, Card, Col, Container, Dropdown, Row, Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import CalendarDayModel from "../services/models/calendar.day.model";
import { useState } from "react";
import useAsyncEffect from "use-async-effect";
import { AppState } from "../states/store";
import calendarService from "../services/Calendar.service";
import { testHelper } from "../helpers/test.helper";
import { useLocation } from "react-router-dom";
import { gettingCurrentCalendarAction, gotCurrentCalendarAction } from "../states/calendar.state";

const Calendar: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.calendarState);
    const [modalData, setModalData] = useState<CalendarDayModel | null>(null);

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        let service: calendarService = new calendarService(testHelper.getTestContainer(search));
        dispatch(gettingCurrentCalendarAction());
        let response = await service.getCurrent();
        dispatch(gotCurrentCalendarAction(response));
    };

    return (
        <Container fluid>
            {state.loading ? (
                <Spinner animation="border" />
            ) : (
                // process loaded
                <Card>
                    <Card.Body>
                        <Container fluid>
                            <Row>
                                <Col>
                                    <div className="cal-month">
                                        <strong className="cal-month-name">June</strong>
                                    </div>
                                    <div className="cal-weekdays text-body-secondary">
                                        <div className="cal-weekday">Mon</div>
                                        <div className="cal-weekday">Tue</div>
                                        <div className="cal-weekday">Wed</div>
                                        <div className="cal-weekday">Thu</div>
                                        <div className="cal-weekday">Fri</div>
                                        <div className="cal-weekday">Sat</div>
                                        <div className="cal-weekday">Sun</div>
                                    </div>
                                    <div className="cal-days">
                                        {state.days?.map((day) => (
                                            <button key={day.Date} className="btn cal-btn" type="button">
                                                {day.Day}
                                            </button>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};
export default Calendar;
