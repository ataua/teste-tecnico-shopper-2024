import { IMeasure } from "@/entities/measure.interface"
import prisma from "@/prismaclient/prismaclient"

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
            return await prisma.measure.create({ data: measure })
        } catch (error: any) {
            return nullData
        }
    },

    findAll: async (customer_code: string) => {
        try {
            return await prisma.measure.findMany({ where: { customer_code }, orderBy: { measure_datetime: 'desc' } }) || {}
        } catch (error: any) {
            return { data: {}, error: error.message }
        }
    },

    findExisting: async (measure: IMeasure) => {
        try {
            const { measure_datetime, measure_type, customer_code } = measure
            return await prisma.measure.findFirst({
                where: {
                    measure_datetime,
                    measure_type,
                    customer_code
                }
            })
        } catch (error: any) {
            return { data: {}, error: error.message }
        }
    }
}

export default measureRepository