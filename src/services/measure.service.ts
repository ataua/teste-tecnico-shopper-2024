import measureRepository from '../repositories/measure.repository';
import { Request } from 'express';
import { checkIsImage } from '../utils/image';
import type { IMeasure } from '../entities/measure.d.ts';
import checkAPI from '../utils/gemini';
import { MeasureType } from '@prisma/client';


const measureService = {
    check: async (measure: IMeasure) => {
        // verificar se todos os campos foram informados
        if (!measure.customer_code) return {
            error_number: 400,
            error_code: 'INVALID_DATA',
            error_description: 'Código do consumidor não informado'
        }
        if (!measure.measure_datetime) return {
            error_number: 400,
            error_code: 'INVALID_DATA',
            error_description: 'Data da leitura não informada'
        }
        if (!['WATER', 'GAS'].includes(measure.measure_type.toLocaleUpperCase())) return {
            error_number: 400,
            error_code: 'INVALID_DATA',
            error_description: 'Tipo de leitura inválido (WATER ou GAS)'
        }

        // verificar se é imagem base64
        const isImage = checkIsImage(measure.image as string)
        if (!isImage) return {
            error_number: 400,
            error_code: 'INVALID_DATA',
            error_description: 'Arquivo enviado não uma é imagem base64 ou possui formato incorreto'
        }

        // verificar se já existe registro para o mês informado
        const found = await measureRepository.findExisting(measure)
        if (!!found) return {
            error_number: 409,
            error_code: 'DOUBLE_REPORT',
            error_description: 'Leitura do mês já realizada'
        }

        try {
            // envia para IA e retorna leitura
            const result = await checkAPI(measure.image as string)

            // salva dados no db
            delete measure.image
            measure.measure_uri = result.uri
            measure.measure_value = result.text ?? 0
            const saved = await measureRepository.create(measure)

            // retorna leitura
            return {
                image_url: result.uri,
                measure_value: saved.measure_value,
                measure_uuid: saved.measure_uuid
            }
        } catch (error) {
            return {
                error_number: error.status ?? 500,
                error_code: 'ERROR',
                error_description: error.statusText ?? error.message
            }
        }
    },

    confirm: async ({ measure_uuid, confirmed_value }: { measure_uuid: string, confirmed_value: number }) => {
        try {
            if (!measure_uuid || typeof measure_uuid !== 'string') return {
                error_number: 400,
                error_code: 'INVALID_DATA',
                error_description: 'Código do consumidor não informado ou incorreto'
            }
            if (!confirmed_value || typeof confirmed_value !== 'number') return {
                error_number: 400,
                error_code: 'INVALID_DATA',
                error_description: 'Valor confirmado não informado ou inválido'
            }
            const measure = await measureRepository.findOne(measure_uuid)
            if (!measure.measure_uuid) return {
                error_number: 404,
                error_code: "MEASURE_NOT_FOUND",
                error_description: "Leitura do mês já realizada"
            }
            if (!!measure.has_confirmed) {
                return {
                    error_number: 409,
                    error_code: "CONFIRMATION_DUPLICATE",
                    error_description: "Leitura do mês já realizada"
                }
            }
            const updated = await measureRepository.update(measure_uuid, confirmed_value)
            return {
                success: true
            }
        } catch (error) {
            return {
                error_number: error.status ?? 500,
                error_code: 'ERROR',
                error_description: error.statusText ?? error.message
            }
        }
    },

    listByConsumerCode: async (req: Request) => {
        try {
            const { customer_code } = req.params
            let { measure_type } = req.query || null
            if (!!measure_type && typeof measure_type === 'string') measure_type = measure_type.toLocaleUpperCase()

            if (!!measure_type && !['WATER', 'GAS'].includes(measure_type!.toString().toUpperCase())) return [{
                error_number: 400,
                error_code: 'INVALID_TYPE',
                error_description: 'Tipo de medição não permitida'
            }]
            const measures = await measureRepository.findAll(customer_code, measure_type as MeasureType)
            if (!measures.length) return [{
                error_number: 404,
                error_code: 'MEASURES_NOT_FOUND',
                error_description: 'Nenhuma leitura encontrada'
            }]
            return measures

        } catch (error) {
            return [{
                error_number: error.status ?? 500,
                error_code: 'ERROR',
                error_description: error.statusText ?? error.message
            }]

        }
    }
}

export default measureService