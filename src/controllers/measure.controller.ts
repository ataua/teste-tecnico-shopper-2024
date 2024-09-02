
import { Request, Response } from 'express';
import measureService from '../services/measure.service';

const measureController = {
    checkImage: async (req: Request, res: Response) => {
        const fileCheck = await measureService.check(req.body)
        res.status(fileCheck.error_number ?? 200).json(fileCheck)
    },


    confirmMeasure: async (req: Request, res: Response) => {
        const result = await measureService.confirm(req.body)
        return res.status(result.error_number ?? 200).json(result)
    },

    listMeasuresByConsumerCode: async (req: Request, res: Response) => {
        const result = await measureService.listByConsumerCode(req)
        // @ts-ignore
        if(!!result[0].error_number) return res.status(result[0].error_number).json(result[0])
        return res.status(200).json(result)
    }
}

export default measureController