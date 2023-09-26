export type clientUploadedCover = {
    mdData?: pictureFromMetadata
    url: string
    file?: File
}

export type pictureFromMetadata = {
    data: Uint8Array,
    description?:string,
    format:string,
    type?:string
}