import { testContainer } from "../helpers/test.helper";
import reportRepository from "../repositories/report.rep";
import { ReportModel } from "./models/report.models";
import Response from "./models/response";

export default class reportService {
    private rep: reportRepository;

    constructor(test: testContainer | null) {
        this.rep = new reportRepository(test);
    }

    public getByDate(date: string) {
        return this.rep
            .getByDate(date)
            .then((response) => {
                let model = new ReportModel(response.data);
                return Response.success<ReportModel>(model);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }

    public getByRange(dateFrom: string, dateTo: string) {
        return this.rep
            .getByRange(dateFrom, dateTo)
            .then((response) => {
                let model = new ReportModel(response.data);
                return Response.success<ReportModel>(model);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }
}
