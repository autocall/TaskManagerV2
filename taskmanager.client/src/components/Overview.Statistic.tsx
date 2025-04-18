import { Badge, Card, Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import CategoryModel from "../services/models/category.model";
import useAsyncEffect from "use-async-effect";
import { useDispatch } from "react-redux";
import moment from "moment";
import authService from "../services/auth.service";
import { useState } from "react";

interface OverviewStatisticProps {
    categories: CategoryModel[];
}

const OverviewStatistic: React.FC<OverviewStatisticProps> = ({ categories }: OverviewStatisticProps) => {
    let dispatch = useDispatch();
    const [todayHours, setTodayHours] = useState<number>(0);
    const [weekHours, setWeekHours] = useState<number>(0);

    useAsyncEffect(() => {
        const user = new authService(null).getCurrentUser();
        const format = "YYYY-MM-DD";
        const nowTz = moment.tz( user!.TimeZoneId);
        const now = nowTz.format(format);
        const weekStart = nowTz.startOf("week").format(format);
        const weekEnd = nowTz.endOf("week").format(format);

        const todayHours = categories
            .flatMap((category) => category.Tasks)
            .flatMap((task) => task.Comments)
            .filter((comment) => comment.Date === now)
            .reduce((sum, comment) => sum + comment.WorkHours, 0);
        setTodayHours(todayHours);

        const weekHours = categories
            .flatMap((category) => category.Tasks)
            .flatMap((task) => task.Comments)
            .filter((comment) => comment.Date >= weekStart && comment.Date <= weekEnd)
            .reduce((sum, comment) => sum + comment.WorkHours, 0);
        setWeekHours(weekHours);
    }, [dispatch, categories]);

    return (
        <Container fluid className="mt-2">
            <Card key="statistic" className="column-card">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Today Hours</span>
                        <Badge pill bg="primary">
                            {todayHours}h
                        </Badge>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Week Hours</span>
                        <Badge pill bg="primary">
                            {weekHours}h
                        </Badge>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};
export default OverviewStatistic;
