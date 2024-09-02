import { IMeasure } from "../entities/measure.d"
import prisma from "../prismaclient/prismaclient"
import { MeasureType } from "@prisma/client"

const nullData = {
    measure_uuid: null,
    measure_datetime: null,
    measure_value: null,
    measure_type: null,
    has_confirmed: null,
    customer_code: null
}

const measureRepository = {

    create: async (measure: IMeasure) => {
        try {
            measure.measure_type = measure.measure_type.toLocaleUpperCase() as MeasureType
            return await prisma.measure.create({ data: measure })
        } catch (error: any) {
            console.error({ error })
            return nullData
        }
    },

    findOne: async (measure_uuid: string) => {
        try {
            return await prisma.measure.findUnique({ where: { measure_uuid } }) || nullData
        } catch (error: any) {
            console.error({ error })
            return nullData
        }
    },

    findAll: async (customer_code: string, measure_type?: MeasureType) => {
        try {
            return await prisma.measure.findMany({
                where: {
                    customer_code,
                    ...(measure_type && { measure_type: measure_type.toLocaleUpperCase() as MeasureType })
                },
                orderBy: { measure_datetime: 'desc' }
            }) || []
        } catch (error: any) {
            console.error({ error })
            return []
        }
    },

    findExisting: async (measure: IMeasure) => {
        try {
            const { measure_datetime, measure_type, customer_code } = measure
            return await prisma.measure.findFirst({
                where: {
                    measure_datetime,
                    measure_type: measure_type!.toLocaleUpperCase() as MeasureType,
                    customer_code
                }
            })
        } catch (error: any) {
            console.error({ error })
            return nullData
        }
    },

    update: async (measure_uuid: string, measure_value: number) => {
        try {
            return await prisma.measure.update({
                where: { measure_uuid },
                data: {
                    has_confirmed: true,
                    measure_value,
                }
            })
        } catch (error: any) {
            return nullData
        }
    }
}

export default measureRepository