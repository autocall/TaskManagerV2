export default class FileModel {
    Id: number;
    CompanyId: number;
    FileName: string;
    Size: bigint;
    IsDeleted: boolean;
    Blob: File;

    constructor(data?: any) {
        if (data) {
            this.Id = data.Id;
            this.CompanyId = data.CompanyId;
            this.FileName = data.FileName;
            this.Size = data.Size;
            this.IsDeleted = false;
            this.Blob = data.Blob;
        }
    }
    static createFromBlob(blob: File): FileModel {
        return new FileModel({
            FileName: blob.name,
            Size: blob.size,
            Blob: blob,
        });
    }
}
