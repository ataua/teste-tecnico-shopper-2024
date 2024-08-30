import { IMeasure } from "@/entities/measure.interface"
import checkAPI from "@/libs/gemini"
import { checkIsImage } from "@/libs/image"
import measureRepository from "@/repositories/measure.repository"

const measureService = {
    check: async (measure: IMeasure) => {
        // verificar se todos os campos foram informados
        if (!measure.customer_code) return {
            data: {},
            error: {
                error_number: 0,
                error_code: 'INVALID_DATA',
                error_description: 'Código do consumidor não informado'
            }
        }
        if (!measure.measure_datetime) return {
            data: {},
            error: {
                error_number: 0,
                error_code: 'INVALID_DATA',
                error_description: 'Data da leitura não informada'
            }
        }

        // verificar se é imagem base64
        const isImage = checkIsImage(measure.image)
        if (!isImage) return {
            data: {},
            error: {
                error_number: 0,
                error_code: 'INVALID_DATA',
                error_description: 'Arquivo enviado não uma é imagem base64 ou possui formato incorreto'
            }
        }

        // verificar se já existe registro para o mês informado
        const found = await measureRepository.findExisting(measure)
        if (!!found) return {
            data: {},
            error: {
                error_number: 0,
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada'
            }
        }

        // envia para IA e retorna leitura
        const result = await checkAPI(measure.image)
        if (!!result.error || !result.result) return {
            data: {},
            error: {
                error_number: 0,
                error_code: 'INTERNAL ERROR',
                error_description: result.error
            }
        }

        // salva dados no db
        const saved = await measureRepository.create({
            ...measure,
            measure_value: parseInt(result.result.response.text()) || 0
        })

        // retorna leitura
        return {
            data: {
                image_url: result.metadata.uri,
                measure_value: saved.measure_value,
                measure_uuid: saved.measure_uuid
            },
            error: null
        }
    },
    confirm: ({ measure_uuid, confirmed_value }: { measure_uuid: string, confirmed_value: number }) => {
        console.log(measure_uuid, confirmed_value)
        return {
            data: {
                image_url: null,
                measure_value: null,
                measure_uuid: null,
            },
            error: {
                error_number: 0,
                error_code: 'Not implemented',
                error_description: 'Not implemented'
            }
        }
    },
    listByConsumerCode: (consumer_code: string) => {
        console.log(consumer_code)
        return {
            data: {
                image_url: null,
                measure_value: null,
                measure_uuid: null
            },
            error: {
                error_number: 0,
                error_code: 'Not implemented',
                error_description: 'Not implemented'
            }
        }
    }
}

export default measureService