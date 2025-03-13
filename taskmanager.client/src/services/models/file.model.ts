export default class FileModel {
    Id: number;
    FileName: string;
    Size: bigint;

    constructor(data?: any) {
        if (data) {
            this.Id = data.Id;
            this.FileName = data.FileName;
            this.Size = data.Size
        }
    }
    
    
}
