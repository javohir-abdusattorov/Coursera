export declare class FileService {
    private uploadFile;
    validateFileType(file: any, type: any): boolean;
    uploadCourseVideo(file: any): Promise<string>;
    uploadUserImage(file: any): Promise<string>;
    uploadCourseImage(file: any): Promise<string>;
    deleteFiles(files: string[]): void;
}
