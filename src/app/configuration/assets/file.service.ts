import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BinaryFileTypes, DataTypes, FileExtensions } from '../enums/file-type.enum';

@Injectable({
    providedIn: 'root',
})
export class FileService {
    constructor() { }

    determineBlobDataType(blob: Blob): Observable<string> {
        return new Observable((observer) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result as ArrayBuffer;
                const uint8Array = new Uint8Array(arrayBuffer.slice(0, 4)); // Read the first 4 bytes
                const hex = Array.from(uint8Array)
                    .map((byte) => byte.toString(16).padStart(2, '0'))
                    .join('');

                observer.next(blob.type || this.getDataType(hex));
                observer.complete();
            };

            reader.onerror = (error) => {
                observer.error(error);
            };

            reader.readAsArrayBuffer(blob.slice(0, 4));
        });
    }

    getDataType(hex: string) {
        let dataType: string;

        switch (true) {
            case hex.startsWith(BinaryFileTypes.PNG):
                dataType = DataTypes.PNG;
                break;
            case hex.startsWith(BinaryFileTypes.GIF):
                dataType = DataTypes.GIF;
                break;
            case hex.startsWith(BinaryFileTypes.JPEG):
                dataType = DataTypes.JPEG;
                break;
            case hex.startsWith(BinaryFileTypes.JPG):
                dataType = DataTypes.JPG;
                break;
            case hex.startsWith(BinaryFileTypes.SVG):
                dataType = DataTypes.SVG;
                break;
            case hex.startsWith(BinaryFileTypes.TIFF):
                dataType = DataTypes.TIFF;
                break;
            case hex.startsWith(BinaryFileTypes.BMP):
                dataType = DataTypes.BMP;
                break;
            case hex.startsWith(BinaryFileTypes.PDF):
                dataType = DataTypes.PDF;
                break;
            case hex.startsWith(BinaryFileTypes.MS_WORD):
                dataType = DataTypes.MS_WORD;
                break;
            case hex.startsWith(BinaryFileTypes.EXCEL):
                dataType = DataTypes.EXCEL;
                break;
            case hex.startsWith(BinaryFileTypes.TXT):
                dataType = DataTypes.TXT;
                break;
            case hex.startsWith(BinaryFileTypes.ZIP):
                dataType = DataTypes.ZIP;
                break;
            case hex.startsWith(BinaryFileTypes.RAR):
                dataType = DataTypes.RAR;
                break;
            case hex.startsWith(BinaryFileTypes.CSV):
                dataType = DataTypes.CSV;
                break;
            case hex.startsWith(BinaryFileTypes.JSON):
                dataType = DataTypes.CSV;
                break;
            default:
                dataType = DataTypes.UNKNOWN;
                break;
        }

        return dataType;
    }

    nonImageFileTypeGenerate(file_name: string, version: string): string {
        let result = '';

        if (file_name.endsWith(FileExtensions.PDF)) {
            result =
                version == 'v1'
                    ? '<img src="/assets/pdf.png" style="width:50px;height:50px">'
                    : '/assets/pdf.png';
        } else if (
            file_name.endsWith(FileExtensions.DOC) ||
            file_name.endsWith(FileExtensions.DOCX)
        ) {
            result =
                version == 'v1'
                    ? '<img src="/assets/ms-word.png" style="width:50px;height:50px">'
                    : '/assets/ms-word.png';
        } else if (
            file_name.endsWith(FileExtensions.XLS) ||
            file_name.endsWith(FileExtensions.XLSX)
        ) {
            result =
                version == 'v1'
                    ? '<img src="/assets/excel.png" style="width:50px;height:50px">'
                    : '/assets/excel.png';
        } else if (
            file_name.endsWith(FileExtensions.PPT) ||
            file_name.endsWith(FileExtensions.PPTX)
        ) {
            result =
                version == 'v1'
                    ? '<img src="/assets/powerpoint.png" style="width:50px;height:50px">'
                    : '/assets/powerpoint.png';
        } else if (
            file_name.endsWith(FileExtensions.ZIP) ||
            file_name.endsWith(FileExtensions.RAR)
        ) {
            result =
                version == 'v1'
                    ? '<img src="/assets/zip.png" style="width:50px;height:50px">'
                    : '/assets/zip.png';
        } else if (
            file_name.endsWith(FileExtensions.TXT) ||
            file_name.endsWith(FileExtensions.CSV)
        ) {
            result =
                version == 'v1'
                    ? '<img src="/assets/txt.png" style="width:50px;height:50px">'
                    : '/assets/txt.png';
        } else if (file_name.endsWith(FileExtensions.JSON)) {
            result =
                version == 'v1'
                    ? '<img src="/assets/json.png" style="width:50px;height:50px">'
                    : '/assets/json.png';
        } else {
            result =
                version == 'v1'
                    ? '<img src="/assets/file.png" style="width:50px;height:50px">'
                    : '/assets/file.png';
        }

        return result;
    }

    getImageMimeType(base64String: string): string {
        const mimeTypeSubstring = base64String.substring(
            5,
            base64String.indexOf(';')
        );

        switch (mimeTypeSubstring) {
            case DataTypes.JPEG:
            case DataTypes.JPG:
            case DataTypes.PNG:
            case DataTypes.GIF:
            case DataTypes.TIFF:
            case DataTypes.SVG:
            case DataTypes.BMP:
                return mimeTypeSubstring;
            default:
                return DataTypes.JPEG; // Default to JPEG if the format is not recognized
        }
    }

    formatFileSize(fileSizeInBytes: number): string {
        if (fileSizeInBytes >= 1024 * 1024) {
            return `${(fileSizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
        } else {
            return `${(fileSizeInBytes / 1024).toFixed(2)} KB`;
        }
    }

    nonImageFilePreview(file_name: string, blobData: any, dataType: string) {
        const base64String = blobData.split(',')[1]; // Get the base64 data (remove data:image/jpeg;base64,)
        const byteArray = atob(base64String);
        const byteNumbers = new Array(byteArray.length);

        for (let i = 0; i < byteArray.length; i++) {
            byteNumbers[i] = byteArray.charCodeAt(i);
        }

        const uint8Array = new Uint8Array(byteNumbers);
        const mimeType = this.getImageMimeType(base64String);
        const blob = new Blob([uint8Array], { type: mimeType });
        const fileSizeDisplay = this.formatFileSize(blob.size);

        //mobile responsive
        const isMobile = window.innerWidth <= 768;
        const div = `
            <tr>
                <td style="text-align: center;">${file_name}</td>
                <td style="text-align: center;">${dataType}</td>
                <td style="text-align: center;">${fileSizeDisplay}</td>
                <td style="text-align: center;">
                <div class="message-file-preview-non-image" style="box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                padding:10px;width:100px;overflow:auto;text-overflow: ellipsis;margin:auto">
                    <div style="margin-bottom:10px;${isMobile ? 'text-align:center;' : ''}">
                        <a href="${blobData}" download style="color: #999999; font-size: 12px;">download</a><br>
                    </div>
                    <div style="display:flex;align-items:center;justify-content:center">
                        ${this.nonImageFileTypeGenerate(file_name, 'v1')}
                    </div>
                </td>
            </tr>`;

            return div;
    }

    imageFilePreview(file_name: string, blobData: any, dataType: string, selection: any = null) {
        const base64String = blobData.split(',')[1]; // Get the base64 data (remove data:image/jpeg;base64,)
        const byteArray = atob(base64String);
        const byteNumbers = new Array(byteArray.length);

        for (let i = 0; i < byteArray.length; i++) {
            byteNumbers[i] = byteArray.charCodeAt(i);
        }

        const uint8Array = new Uint8Array(byteNumbers);
        const mimeType = this.getImageMimeType(base64String);
        const blob = new Blob([uint8Array], { type: mimeType });
        const imageUrl = URL.createObjectURL(blob);

        const fileSizeDisplay = this.formatFileSize(blob.size);

        //mobile responsive
        const isMobile = window.innerWidth <= 768;
        const div = `
            <tr>
                <td style="text-align: center;">${file_name}</td>
                <td style="text-align: center;">${dataType}</td>
                <td style="text-align: center;">${fileSizeDisplay}</td>
                <td style="text-align: center;">
                <a style="cursor:pointer;" href="${imageUrl}" target="_blank">
                    <img class="message-file-preview-img" src="${imageUrl}" style="width: 50px; height: 50px; margin: 5px;">
                </a>
                </td>
            </tr>`;

        return div;
    }
}
