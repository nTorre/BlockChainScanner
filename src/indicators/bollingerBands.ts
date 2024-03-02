import { Indicators } from "@ixjb94/indicators"
import { TokenOHLCV } from "../types/customTypes";

export async function bollingerBadsChecker(data: TokenOHLCV): Promise<boolean>{
    let closes: number[] = [];
    data.candles.forEach(candle => {
        closes.push(candle.close * 1_000_000);
    });

    closes.pop();

    let ta = new Indicators()
    let bbValues = await ta.bbands(closes, 19, 2);
    let lastUpper = bbValues[2][bbValues[2].length-1];

    if (isNaN(lastUpper)){
        return false;
    }

    if (lastUpper<closes[closes.length-1]){
        console.log(lastUpper, closes[closes.length-1]);
        return true;
    }

    return false;

}

