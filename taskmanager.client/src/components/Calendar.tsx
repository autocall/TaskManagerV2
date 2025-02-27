import { Alert, Button, Card, Container, ListGroup, Overlay, OverlayTrigger, Placeholder, Popover, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import useAsyncEffect from "use-async-effect";
import { AppState } from "../states/store";
import calendarService from "../services/calendar.service";
import { testHelper } from "../helpers/test.helper";
import { Link, useLocation } from "react-router-dom";
import { gettingCurrentCalendarAction, gotCurrentCalendarAction } from "../states/calendar.state";
import "./Calendar.scss";
import "../../settings";
import { useRef, useState } from "react";
import EventModel, { EventData } from "../services/models/event.model";
import EventModal from "./Event.Modal";
import { EventTypeEnum } from "../enums/event.type.enum";
import { CalendarDayModel, CalendarEventModel } from "../services/models/calendar.day.models";
import eventService from "../services/event.service";
import { useConfirm } from "./shared/confirm";

const Calendar: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.calendarState);
    const [eventModalData, setEventModalData] = useState<EventModel | null>(null);
    const [showManageDay, setShowManageDay] = useState<CalendarDayModel | null>(null);
    const [targetManageDay, setTargetDay] = useState(null);
    const { confirm, ConfirmDialog } = useConfirm();

    useAsyncEffect(async () => {
        await load();
    }, [dispatch]);

    const load = async () => {
        setShowManageDay(null);
        let service: calendarService = new calendarService(testHelper.getTestContainer(search));
        dispatch(gettingCurrentCalendarAction());
        //const start = performance.now();
        let response = await service.getCurrent();
        //const end = performance.now();
        //console.log(`Execution time: ${end - start} ms`);
        dispatch(gotCurrentCalendarAction(response));
    };

    const handleManageDay = (event: any, day: CalendarDayModel) => {
        if (showManageDay == day) {
            // setTargetDay(null); jumps to center
            setShowManageDay(null);
        } else {
            setTargetDay(event.target);
            setShowManageDay(day);
        }
        //handleAddEvent(day.Date);
    };

    const handleAddEvent = (date: Date) => {
        setShowManageDay(null);
        setEventModalData(new EventModel(EventData.defaultWithDate(date)));
    };

    const handleEditEvent = (model: CalendarEventModel) => {
        setShowManageDay(null);
        setEventModalData(new EventModel(model));
    };

    const handleCompleteEvent = async (model: CalendarEventModel) => {
        setShowManageDay(null);
        if (await confirm("Complete Event", `Are you sure you want to complete the event '${model.Name}'?`)) {
            let service: eventService = new eventService(testHelper.getTestContainer(search));
            dispatch(gettingCurrentCalendarAction());
            await service.completeEvent(model.Id);
            await load();
        }
    };

    const handleClose = async (reload: boolean) => {
        setEventModalData(null);
        if (reload) {
            await load();
        }
    };

    return (
        <Container fluid>
            {ConfirmDialog}
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
                                <OverlayTrigger
                                    key={day.Date.toISOString()}
                                    overlay={
                                        day.Events.length && showManageDay == null ? (
                                            <Tooltip id={`tooltip-${day.Date.toISOString()}`}>
                                                {day.Events.map((e) => (
                                                    <div key={e.Id}>
                                                        <b>{e.Name}</b>
                                                        <div>{e.Description}</div>
                                                    </div>
                                                ))}
                                            </Tooltip>
                                        ) : (
                                            <></>
                                        )
                                    }>
                                    <button
                                        key={day.Date.toISOString()}
                                        className={
                                            "btn cal-btn" +
                                            (state.calendar?.Month != day.Month ? " secondary" : "") +
                                            (day.IsCurrentDay ? " today" : "") +
                                            (day.Events.find((e) => e.Type == EventTypeEnum.Task)
                                                ? " btn-danger"
                                                : day.Events.find((e) => e.Type == EventTypeEnum.Birthday)
                                                  ? " btn-success"
                                                  : day.Events.find((e) => e.Type == EventTypeEnum.Holiday)
                                                    ? " btn-success"
                                                    : day.Events.find((e) => e.Type == EventTypeEnum.Default)
                                                      ? " btn-primary"
                                                      : "")
                                        }
                                        onClick={(e) => handleManageDay(e, day)}>
                                        {day.Events.find((e) => e.Type == EventTypeEnum.Birthday) ? (
                                            <i className="bi bi-gift"></i>
                                        ) : day.Events.find((e) => e.Type == EventTypeEnum.Holiday) ? (
                                            <i className="bi bi-balloon"></i>
                                        ) : (
                                            day.Day
                                        )}
                                    </button>
                                </OverlayTrigger>
                            ))}
                            {/* Manage Day */}
                            <Overlay target={targetManageDay} show={showManageDay != null} placement="bottom">
                                <Popover id="popover-basic">
                                    <Popover.Header>
                                        <div>{showManageDay?.Date.toLocaleDateString()}</div>
                                    </Popover.Header>
                                    <Popover.Body className="p-0">
                                        <ListGroup variant="flush">
                                            <ListGroup.Item action onClick={() => showManageDay && handleAddEvent(showManageDay.Date)}>
                                                Add Event
                                            </ListGroup.Item>
                                            {showManageDay?.Events.map((e, i) => (
                                                <ListGroup.Item key={e.Id} action onClick={() => handleEditEvent(e)}>
                                                    <b>{e.Name}</b>
                                                    {e.Type == EventTypeEnum.Task ? (
                                                        <Link
                                                            to="#"
                                                            className="ms-2"
                                                            onClick={(event) => {
                                                                handleCompleteEvent(e);
                                                                event.stopPropagation();
                                                            }}>
                                                            Complete
                                                        </Link>
                                                    ) : null}
                                                    <div>{e.Description}</div>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Popover.Body>
                                </Popover>
                            </Overlay>
                        </div>
                    )}
                {state.error && <Alert variant="danger">{state.error}</Alert>}
                </Card.Body>
            </Card>
        </Container>
    );
};
export default Calendar;
