import React, { useState } from "react";
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

interface CalendarViewProps {
    calendar: CalendarModel | null;
    loading: boolean;
    load: () => Promise<void>;
}

const CalendarView: React.FC<CalendarViewProps> = ({ loading, calendar, load }) => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    const [eventModalData, setEventModalData] = useState<EventModel | null>(null);
    const [showManageDay, setShowManageDay] = useState<CalendarDayModel | null>(null);
    const [targetManageDay, setTargetDay] = useState<HTMLElement | null>(null);
    const { confirm, ConfirmDialog } = useConfirm();

    const handleManageDay = (event: any, day: CalendarDayModel) => {
        if (showManageDay == day) {
            // setTargetDay(null); jumps to center
            setShowManageDay(null);
        } else {
            setTargetDay(event.target);
            setShowManageDay(day);
        }
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
            </Card.Body>
        </Card>
    );
};

export default CalendarView;
