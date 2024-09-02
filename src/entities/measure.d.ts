import { MeasureType } from "@prisma/client";

export interface IMeasure {
    image?: string;
    measure_uuid?: string;
    measure_uri?: string;
    measure_datetime: Date;
    measure_value: number;
    measure_type: MeasureType;
    has_confirmed?: boolean;
    customer_code: string;
}