import axios from "axios";
import authHeader from "../services/auth-header";
import { testContainer } from "../helpers/test.helper";
import { TaskKindEnum } from "../enums/task.kind.enum";
import { TaskStatusEnum } from "../enums/task.status.enum";

const API_URL = "/api/overview/";

export default class overviewRepository {
    private testContainer: testContainer | null;

    public constructor(test: testContainer | null) {
        this.testContainer = test;
    }

    private generateHeaders(action: string): any {
        if (this.testContainer && this.testContainer.action === action) {
            return {
                ...authHeader(),
                error: this.testContainer.error,
                errors: JSON.stringify(this.testContainer.errors),
            };
        }
        return authHeader();
    }

    public get(
        filterText: string,
        filterKindId: TaskKindEnum | null,
        filterStatus: TaskStatusEnum | null,
        filterProjectId: number | null,
        filterDate: string,
    ) {
        let action = "get";
        let query = {};
        if (filterText) {
            query = { ...query, Text: filterText.trim() };
        }
        if (filterKindId) {
            query = { ...query, Kind: filterKindId };
        }
        if (filterStatus) {
            query = { ...query, Status: filterStatus };
        }
        if (filterProjectId) {
            query = { ...query, ProjectId: filterProjectId };
        }
        if (filterDate) {
            query = { ...query, Date: filterDate };
        }
        return axios.get(`${API_URL}${action}?` + new URLSearchParams(query).toString(), { headers: this.generateHeaders(action) });
    }

    public getStatistic(firstDayOfWeek: number) {
        let action = "getStatistic";
        return axios.get(`${API_URL}${action}?firstDayOfWeek=${firstDayOfWeek}`, { headers: this.generateHeaders(action) });
    }
}
