export class testHelper {
    public static getTestContainer(search: string): testContainer | null {
        let queryParams = new URLSearchParams(search);
        let testBase64 = queryParams.get("test");
        if (testBase64) {
            let json = atob(testBase64);
        return JSON.parse(json) as testContainer;
        } else {
            return null;
        }
    }
    public static setTestContainer(test: testContainer): string {
        return btoa(JSON.stringify(test));
    }
}
export class testContainer {
    public  action: string;
    public  error: string;
    public  errors: any;
}