import fs from 'fs/promises'

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

export const decodeBase64Image = (base64String: string): Buffer => {
    const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    const buffer = Buffer.from(matches![2], 'base64');
    return buffer;
}

export const saveTempFile = async (base64String: string) => {
    const file = decodeBase64Image(base64String)
    const mimeType = getMimeType(base64String).replace('image/', '')
    const name = `relogio_${Date.now()}.${mimeType}`
    const path = `public/uploads/${name}`

    await fs.writeFile(path, file, 'base64')
    console.info(`** Arquivo salvo em: ${path}`)
    return { name, path, mimeType: `image/${mimeType}`
}
}