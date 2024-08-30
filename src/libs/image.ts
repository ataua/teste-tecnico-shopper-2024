const acceptedMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/heic',
    'image/heif'
]

export const getMimeType = (base64String: string): string => {
    const isImage = base64String.match(/^data:(.+);base64,/)
    if (!isImage) return '';
    return isImage[1]
}

export const checkIsImage = (base64String: string): boolean => {
    const imageType = getMimeType(base64String)
    if (!imageType) return false;
    return acceptedMimeTypes.some(mimeType => mimeType === imageType)
}