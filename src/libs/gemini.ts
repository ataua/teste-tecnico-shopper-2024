import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server";

const key = process.env.GEMINI_API_KEY
if (!key) throw new Error("Missing API key")

const fileManager = new GoogleAIFileManager(key);
const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-001",
});

const sendImage = async (base64String: string) => await fileManager.uploadFile(base64String, {
    mimeType: "image/jpeg",
    displayName: `relogio_${Date.now()}`
});

const getImageMetaData = async (uploadResponse: UploadFileResponse) => await fileManager.getFile(uploadResponse.file.uri)

const askGemini = async (uploadResponse: UploadFileResponse) => {

    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri
            }
        }, {
            text: "Informe o valor numérico do consumo registrado no relógio presente na imagem. Formato de saída: apenas um número inteiro, por exemplo: 1234567890",
        }
    ]);

    return result
}

const checkAPI = async (base64String: string) => {
    // envia imagem para API e retorna a leitura
    try {
        const uploadResponse = await sendImage(base64String)
        const metadata = await getImageMetaData(uploadResponse)
        const result = await askGemini(uploadResponse)
        return { result, metadata, error: null }
    } catch (error: any) {
        return { result: null, metadata: null, error: error }
    }
}

export default checkAPI