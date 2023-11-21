export enum BinaryFileTypes {
    PNG = '89504e47',
    GIF = '47494638',
    JPEG = 'ffd8ffe0',
    PDF = '25504446',
    MS_WORD = 'd0cf11e0',
    EXCEL = '504b0304',
    TXT = '7b5c7274',
    ZIP = '504b0304',
    RAR = '52617221',
    CSV = '2e2e2e2e',
    JPG = 'ffD8ff',
    SVG = '3c3f786d6c',
    TIFF = '49492a',
    JSON = '7b5c7274',
    BMP = '424d',
    // WAV = '52494646',
    // AVI = '52494646',
    // MP3 = '494433',
    // MP4 = '000000',
}

export enum FileExtensions {
    PNG = '.png',
    JPEG = '.jpeg',
    GIF = '.gif',
    PDF = '.pdf',
    DOC = '.doc',
    DOCX = '.docx',
    XLS = '.xls',
    XLSX = '.xlsx',
    PPT = '.ppt',
    PPTX = '.pptx',
    ZIP = '.zip',
    RAR = '.rar',
    TXT = '.txt',
    CSV = '.csv',
    JSON = '.json',
    SVG = '.svg',
    TIFF = '.tiff',
    JPG = '.jpg',
    BMP = '.bmp',
    // XML = '.xml',
    // MP3 = '.mp3',
    // MP4 = '.mp4',
    // WAV = '.wav',
    // AVI = '.avi'
    // Add more file extensions as needed
}

export enum DataTypes {
    PNG = 'image/png',
    GIF = 'image/gif',
    JPEG = 'image/jpeg',
    PDF = 'application/pdf',
    MS_WORD = 'application/msword',
    DOC = 'application/msword',
    DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    XLS = 'application/vnd.ms-excel',
    XLSX = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    PPT = 'application/vnd.ms-powerpoint',
    PPTX = 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    TXT = 'text/plain',
    ZIP = 'application/zip',
    RAR = 'application/x-rar-compressed',
    CSV = 'text/csv',
    JSON = 'application/json',
    JPG = 'image/jpg',
    SVG = 'image/svg+xml',
    TIFF = 'image/tiff',
    BMP = 'image/bmp',
    UNKNOWN = 'unknown',

    // Not supported

    // XML = 'application/xml',
    // MP3 = 'audio/mpeg',
    // MP4 = 'video/mp4',
    // WAV = 'audio/wav',
    // AVI = 'video/x-msvideo',
}

export enum DataSupportType {
  TEXTBLOB = 'text-blob',
  TEXT = 'text',
  BLOB = 'blob'
}