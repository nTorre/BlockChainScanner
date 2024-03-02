/**
 * Convert date from timestamp to date and viceversa
 */
const moment = require('moment');
import { CandleTimeframe } from "../types/customTypes";

export function getFromByPeriods(to: number, periods: number, timeFrame: CandleTimeframe): number {
    return to - timeFrameNumber(timeFrame) * periods;
}

export function timeFrameNumber(timeFrame: CandleTimeframe) {
    const timeFrameInSeconds: { [key: string]: number } = {
        '1m': 60,
        '3m': 3 * 60,
        '5m': 5 * 60,
        '15m': 15 * 60,
        '30m': 30 * 60,
        '1H': 60 * 60,
        '2H': 2 * 60 * 60,
        '4H': 4 * 60 * 60,
        '6H': 6 * 60 * 60,
        '8H': 8 * 60 * 60,
        '12H': 12 * 60 * 60,
        '1D': 24 * 60 * 60,
        '3D': 3 * 24 * 60 * 60,
        '1W': 7 * 24 * 60 * 60,
        '1M': 30 * 24 * 60 * 60,
    };

    return timeFrameInSeconds[timeFrame];
}


export function timestampToMMDDHHMM(timestamp: number) {
    // Converto il timestamp in millisecondi in un oggetto moment
    const momentObj = moment(timestamp * 1000);

    // Formatto la data nel formato mm/dd hh:mm
    const formattedDate = momentObj.format('MM/DD HH:mm');

    return formattedDate;
}