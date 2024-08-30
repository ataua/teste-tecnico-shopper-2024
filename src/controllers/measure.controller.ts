
import measureService from '../services/measure.service';
import { Request, Response } from 'express';

const measureController = {
    checkImage: async (req: Request, res: Response) => {
        const fileCheck = await measureService.check(req.body)
        if (!!fileCheck.error_code) return res.status(400).json(fileCheck)
        res.json(fileCheck)
    },


    confirmMeasure: async (req: Request, res: Response) => {
        const result = await measureService.confirm(req.body)
        res.json(result)
    },

    listMeasuresByConsumerCode: async (req: Request, res: Response) => {
        const result = await measureService.listByConsumerCode(req.params.id)
        res.json(result)
    }
}
export default measureController