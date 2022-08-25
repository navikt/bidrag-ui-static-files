export interface InMemFile {
    content: Buffer,
    contentType: string,
}

export type FileCache = {
    [key: string]: InMemFile;
};
