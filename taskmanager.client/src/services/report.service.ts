import { testContainer } from "../helpers/test.helper";
import reportRepository from "../repositories/report.rep";
import { ReportModel } from "./models/report.models";
import Response from "./models/response";

export default class reportService {
    private rep: reportRepository;

    constructor(test: testContainer | null) {
        this.rep = new reportRepository(test);
    }

    public get(date: string) {
        return this.rep
            .get(date)
            .then((response) => {
                let model = new ReportModel(response.data);
                return Response.success<ReportModel>(model);
            })
            .catch((exception) => {
                return Response.fail<any>(exception);
            });
    }
}
