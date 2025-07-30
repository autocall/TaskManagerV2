import { useRef, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import useAsyncEffect from "use-async-effect";
import { useToast } from "./shared/toast-manager";
import stringExtension from "../extensions/string.extension";
import moment from "moment";
import authService from "../services/auth.service";
import IJwt from "../types/jwt.type";
import { gettingReportAction, gotReportAction } from "../states/report.state";
import reportService from "../services/report.service";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppState } from "../states/store";
import { testHelper } from "../helpers/test.helper";
import { getTaskKindColor, getTaskKindDescription, TaskKindEnum } from "../enums/task.kind.enum";

const Report: React.FC = () => {
    const { search } = useLocation();
    let dispatch = useDispatch();
    let state = useSelector((s: AppState) => s.reportState);
    const [currentUser, setCurrentUser] = useState<IJwt | null>(null);
    const [date, setDate] = useState<string>("");
    const [dateFrom, setDateFrom] = useState<string>("");
    const cardBodyRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useAsyncEffect(async () => {
        let user = new authService(null).getCurrentUser();
        setCurrentUser(user);
    }, [dispatch]);

    useAsyncEffect(async () => {
        // sets default date to today
        if (!date && currentUser) setDate(stringExtension.dateToISO(moment().tz(currentUser!.TimeZoneId)));
    }, [currentUser]);

    useAsyncEffect(async () => {
        // loads report when date changes
        if (date) await load();
    }, [date, dateFrom]);

    const load = async () => {
        let service = new reportService(testHelper.getTestContainer(search));
        dispatch(gettingReportAction());
        let response = dateFrom ? await service.getByRange(dateFrom, date) : await service.getByDate(date);
        dispatch(gotReportAction(response));
    };

    const copyCardBodyToClipboard = async () => {
        const html = cardBodyRef.current!.innerHTML;
        const text = cardBodyRef.current!.innerText;

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    "text/plain": new Blob([text], { type: "text/plain" }),
                    "text/html": new Blob([html], { type: "text/html" }),
                }),
            ]);
            toast({ message: "Report copied", type: "success" });
        } catch (err) {
            console.error("toast error:", err);
            toast({ message: "toast error", type: "danger" });
        }
    };

    return (
        <Container className="scroll-content">
            <Card className="mb-3">
                <Card.Body className="pt-2 pb-0">
                    <Row>
                        <Col xs="auto" className="mb-2">
                            <Form.Control
                                className={!dateFrom ? "text-muted" : ""}
                                type="Date"
                                value={dateFrom}
                                onChange={(e) => {
                                    setDateFrom(e.target.value);
                                }}
                            />
                        </Col>
                        <Col xs="auto" className="mb-2">
                            <Form.Control
                                className={!date ? "text-muted" : ""}
                                type="Date"
                                value={date}
                                onChange={(e) => {
                                    setDate(e.target.value);
                                }}
                            />
                        </Col>
                        <Col xs="auto" className="mb-2">
                            <Button variant="primary" className="me-3" onClick={() => date && load()}>
                                Refresh Report
                            </Button>
                            <Button variant="success" className="me-3" onClick={copyCardBodyToClipboard}>
                                Copy Report
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            {state.error != null ? (
                <Alert variant="danger">{state.error}</Alert>
            ) : state.loading ? (
                <Row style={{ textAlign: "center", marginTop: "1em" }}>
                    <Col colSpan={10}>
                        <Spinner animation="border" />
                    </Col>
                </Row>
            ) : (
                <div data-bs-theme="light" className="mb-2">
                    <Card>
                        <Card.Body ref={cardBodyRef}>
                            <b style={{ color: "DarkGray", fontSize: "1.2em" }}>
                                {dateFrom && moment(dateFrom).format("M/D/YYYY") + " - " + moment(date).format("M/D/YYYY")}
                                {!dateFrom && date && moment(date).format("dddd, MMMM D, YYYY")} - {state.report!.WorkHours}h
                            </b>
                            <div style={{ margin: "0 0 1em 0" }}>
                                {Object.entries(state.report!.KindHours).map(([k, h]) => (
                                    <>
                                        <span
                                            style={{
                                                background: getTaskKindColor(parseInt(k) as TaskKindEnum),
                                                color: "white",
                                                fontWeight: "bold",
                                                fontSize: "0.8em",
                                                padding: "0 0.4em",
                                                borderRadius: "0.375rem",
                                                display: "inline-block",
                                            }}>
                                            {getTaskKindDescription(parseInt(k) as TaskKindEnum)} {h}h
                                        </span>{" "}
                                    </>
                                ))}
                            </div>
                            <hr
                                style={{
                                    border: "none",
                                    borderTop: "1px solid lightgray",
                                    margin: "0.5em 0",
                                }}
                            />
                            {state.report!.Projects.map((p, i) => (
                                <div key={i}>
                                    <span style={{ fontSize: "1.4em" }}>{p.Name}</span>
                                    <b style={{ color: "DarkGray", fontSize: "1.2em" }}> {dateFrom && p.WorkHours + "h"}</b>
                                    <ul style={{ margin: 0 }}>
                                        {p.Tasks.map((t, j) => (
                                            <div key={j} style={{ whiteSpace: "pre-line" }}>
                                                <div>
                                                    <span
                                                        style={{
                                                            background: getTaskKindColor(t.Kind),
                                                            color: "white",
                                                            fontWeight: "bold",
                                                            fontSize: "0.8em",
                                                            padding: "0 0.4em",
                                                            borderRadius: "0.375rem",
                                                            display: "inline-block",
                                                        }}>
                                                        {getTaskKindDescription(t.Kind)}
                                                    </span>
                                                    <span style={{ fontSize: "1.2em", fontWeight: 650 }}>
                                                        {" "}
                                                        {t.Title} <span style={{ color: "green" }}>{t.WorkHours}h</span>
                                                    </span>
                                                </div>
                                                {!dateFrom && <div style={{ fontSize: "1.0em", color: "gray" }}>{t.Description}</div>}
                                                {!dateFrom && (
                                                    <ul>
                                                        {t.Comments.map((c, k) => (
                                                            <li key={k}>
                                                                <span style={{ fontSize: "1.2em" }}>{c.Text}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </div>
                                        ))}
                                    </ul>
                                    <hr
                                        style={{
                                            border: "none",
                                            borderTop: "1px solid lightgray",
                                            margin: "0.5em 0",
                                        }}
                                    />
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </div>
            )}
        </Container>
    );
};

export default Report;
