import React, { useEffect, useState } from "react";
import { Card, ListGroup, Overlay, OverlayTrigger, Placeholder, Popover, Tooltip } from "react-bootstrap";
import EventModal from "./Event.Modal";
import { EventTypeEnum } from "../enums/event.type.enum";
import CalendarModel, { CalendarDayModel, CalendarEventModel } from "../services/models/calendar.day.models";
import { useConfirm } from "./shared/confirm";
import EventModel, { EventData } from "../services/models/event.model";
import eventService from "../services/event.service";
import { Link, useLocation } from "react-router-dom";
import { gettingCalendarAction } from "../states/calendar.state";
import { useDispatch } from "react-redux";
import { testHelper } from "../helpers/test.helper";
import { eventBus, EventNames } from "./../events";

interface CalendarViewProps {
    calendar: CalendarModel | null;
    loading: boolean;
    load: () => Promise<void>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ loading, calendar, load }) => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    const [eventModalData, setEventModalData] = useState<EventModel | null>(null);
    const [manageDay, setManageDay] = useState<CalendarDayModel | null>(null);
    const [targetManageDay, setTargetDay] = useState<HTMLElement | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    useEffect(() => {
        eventBus.addEventListener(EventNames.resetManageDay, handleResetManageDay);
        return () => eventBus.removeEventListener(EventNames.resetManageDay, handleResetManageDay);
    }, []);

    const handleResetManageDay = (event: Event) => setManageDay(null);

    const handleManageDay = (event: any, day: CalendarDayModel) => {
        eventBus.dispatchEvent(new Event(EventNames.resetManageDay));
        if (manageDay == day) {
            // setTargetDay(null); jumps to center
            setManageDay(null);
        } else {
            setTargetDay(event.target);
            setManageDay(day);
        }
    };

    const handleAddEvent = (date: Date) => {
        setManageDay(null);
        setEventModalData(new EventModel(EventData.defaultWithDate(date)));
    };

    const handleEditEvent = (model: CalendarEventModel) => {
        setManageDay(null);
        setEventModalData(new EventModel(model));
    };

    const handleCompleteEvent = async (model: CalendarEventModel) => {
        setManageDay(null);
        if (await confirm("Complete Event", `Are you sure you want to complete the event '${model.Name}'?`)) {
            let service: eventService = new eventService(testHelper.getTestContainer(search));
            dispatch(gettingCalendarAction());
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
        <Card>
            {ConfirmDialog}
            <EventModal modalData={eventModalData} onClose={handleClose} />
            <Card.Body>
                {/* Month */}
                <div className="cal-month">
                    <strong className="cal-month-name">
                        {loading ? (
                            <Placeholder animation="glow">
                                <Placeholder xs={6} />
                            </Placeholder>
                        ) : (
                            // `${calendar?.MonthName}(${calendar?.Month}) ${calendar?.Year}`
                            `${calendar?.MonthName} ${calendar?.Year}`
                        )}
                    </strong>
                </div>
                {/* Weekdays */}
                <div className="cal-weekdays text-body-secondary">
                    {calendar?.WeekNames.map((w, i) => (
                        <span key={i} className="cal-weekday">
                            {w}
                        </span>
                    ))}
                </div>
                {/* Days */}
                {loading ? (
                    <Placeholder animation="glow">
                        {Array.from({ length: window.settings.CurrentCalendarWeeks }, (_, w) => (
                            <Placeholder className="cal-placeholder" key={w} />
                        ))}
                    </Placeholder>
                ) : (
                    <div className="cal-days">
                        {calendar?.Days.map((day) => (
                            <OverlayTrigger
                                key={day.Date.toISOString()}
                                overlay={
                                    day.Events.length && manageDay == null ? (
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
                                        "btn cal-btn" + (day.Events.length >= 2 ? " position-relative" : "") +
                                        (calendar?.Month != day.Month ? " secondary" : "") +
                                        (day.IsCurrentDay ? " today" : "") +
                                        (day.Events.find((e) => e.Type == EventTypeEnum.Task)
                                            ? " btn-danger"
                                            : day.Events.find((e) => e.Type == EventTypeEnum.Default)
                                              ? " btn-primary"
                                              : day.Events.find((e) => e.Type == EventTypeEnum.Birthday)
                                                ? " btn-success"
                                                : day.Events.find((e) => e.Type == EventTypeEnum.Holiday)
                                                  ? " btn-success"
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
                                    {day.Events.length >= 2 ? (
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                                            {day.Events.length}
                                        </span>
                                    ) : null}
                                </button>
                            </OverlayTrigger>
                        ))}
                        {/* Manage Day */}
                        <Overlay target={targetManageDay} show={manageDay != null} placement="bottom">
                            <Popover id="popover-basic">
                                <Popover.Header>
                                    <div>{manageDay?.Date.toLocaleDateString()}</div>
                                </Popover.Header>
                                <Popover.Body className="p-0">
                                    <ListGroup variant="flush">
                                        <ListGroup.Item action onClick={() => manageDay && handleAddEvent(manageDay.Date)}>
                                            Add Event
                                        </ListGroup.Item>
                                        {manageDay?.Events.map((e, i) => (
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
            </Card.Body>
        </Card>
    );
};

export default CalendarView;
