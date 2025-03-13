export default class fileExtension {
    public static getFileIcon(fileName: string): string {
        let extension = this.getFileExtension(fileName);
        switch (extension) {
            case "pdf":
                return "bi-file-earmark-pdf text-danger"; // Красный цвет для PDF
            case "jpg":
            case "png":
            case "jpeg":
                return "bi-file-earmark-image text-primary"; // Синий для изображений
            case "txt":
                return "bi-file-earmark-text text-secondary"; // Серый для текстовых файлов
            default:
                return "bi-file-earmark"; // Стандартная иконка файла
        }
    }

    private static getFileExtension(fileName: string): string | null {
        return fileName.split(".").pop()?.toLowerCase() ?? null;
    }
}
