import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, UploadFileResponse } from "@google/generative-ai/server";
import { saveTempFile } from "./image";

const key = process.env.GEMINI_API_KEY
if (!key) throw new Error("Missing API key")

const fileManager = new GoogleAIFileManager(key);
const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-001",
});

const sendImage = async (base64String: string) => {
    const file = await saveTempFile(base64String)
    return await fileManager.uploadFile(file.path, {
        mimeType: file.mimeType,
        displayName: file.name
    });
}

const askGemini = async (uploadResponse: UploadFileResponse) => {
    try {
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: `${uploadResponse.file.mimeType}`,
                    fileUri: uploadResponse.file.uri
                }
            }, {
                text: "Informe o valor numérico do consumo registrado no relógio presente na imagem. Formato de saída: apenas um número inteiro, por exemplo: 1234567890",
            }
        ]);
        return result
    } catch (error) {
        console.error(error)
        throw error
    }
}

const checkAPI = async (base64String: string) => {
    // envia imagem para API e retorna a leitura
    const uploadResponse = await sendImage(base64String)
    const result = await askGemini(uploadResponse)
    return {text: parseInt(result.response.text()), uri: uploadResponse.file.uri}
}

export default checkAPI