import { Card, Container, Placeholder } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useAsyncEffect from "use-async-effect";
import { AppState } from "../states/store";
import calendarService from "../services/calendar.service";
import { testHelper } from "../helpers/test.helper";
import { useLocation } from "react-router-dom";
import { gettingCurrentCalendarAction, gotCurrentCalendarAction } from "../states/calendar.state";
import "./Calendar.scss";
import "../../settings";
import { useState } from "react";
import EventModel, { EventData } from "../services/models/event.model";
import EventModal from "./Event.Modal";

const Calendar: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.calendarState);
    const [eventModalData, setEventModalData] = useState<EventModel | null>(null);

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        let service: calendarService = new calendarService(testHelper.getTestContainer(search));
        dispatch(gettingCurrentCalendarAction());
        let response = await service.getCurrent();
        dispatch(gotCurrentCalendarAction(response));
    };

    const handleManageDay = (day: any) => async () => {
        handleAddEvent(day.Date);
    };

    const handleAddEvent = (date: Date) => {
        setEventModalData(new EventModel(EventData.defaultWithDate(date)));
    };

    const handleEditEvent = () => {};

    const handleClose = async (reload: boolean) => {
        setEventModalData(null);
        if (reload) {
            await load();
        }
    };

    return (
        <Container fluid>
            <EventModal modalData={eventModalData} onClose={handleClose} />
            <Card>
                <Card.Body>
                    {/* Month */}
                    <div className="cal-month">
                        <strong className="cal-month-name">
                            {state.loading ? (
                                <Placeholder animation="glow">
                                    <Placeholder xs={6} />
                                </Placeholder>
                            ) : (
                                state.calendar?.MonthName
                            )}
                        </strong>
                    </div>
                    {/* Weekdays */}
                    <div className="cal-weekdays text-body-secondary">
                        {state.calendar?.WeekNames.map((w, i) => (
                            <span key={i} className="cal-weekday">
                                {w}
                            </span>
                        ))}
                    </div>
                    {/* Days */}
                    {state.loading ? (
                        <Placeholder animation="glow">
                            {Array.from({ length: window.settings.CurrentCalendarWeeks }, (_, w) => (
                                <Placeholder className="cal-placeholder" key={w} />
                            ))}
                        </Placeholder>
                    ) : (
                        <div className="cal-days">
                            {state.calendar?.Days.map((day) => (
                                <button
                                    key={day.Date.toISOString()}
                                    className={
                                        "btn cal-btn" +
                                        (state.calendar?.Month != day.Month ? " secondary" : "") +
                                        (day.IsCurrentDay ? " today" : "") + 
                                        (day.Events.find(e => e.Birthday) ? " btn-success" : "") +
                                        (day.Events.find(e => e.Holiday) ? " btn-info" : "") +
                                        (day.Events.find(e => !e.Holiday && !e.Birthday) ? " btn-primary" : "")
                                    }
                                    onClick={handleManageDay(day)}>
                                    {day.Day}
                                </button>
                            ))}
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
};
export default Calendar;
