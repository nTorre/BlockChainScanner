import { Blockchain, CandleTimeframe } from "../types/customTypes";
import { getTokenList, updateTokenList } from "./tokenInfoController";
import { insertTokenOHLCVbyPeriods, getTokenOHLCV } from './tokenDataController';
import { sendSignal } from './../services/telegram';

export async function testChecker(bot: object, chain: Blockchain, minMc: number, periods: number, timeFrame: CandleTimeframe, checker: Function) {
    let tokens = await getTokenList(chain, minMc);
    let i = 0;
    for (let j = 0; j < tokens.length; j++) {
        let token = tokens[j];
        let tokenData = await getTokenOHLCV(chain, token.address, timeFrame, periods);
        if (tokenData.candles.length > 0 && await checker(tokenData)) {
            await sendSignal(bot, tokenData, token);
            await sleep(1500);
            i++;
        }
    }

    console.log("**************", i);
}

async function updateAllData(chain: Blockchain, minMc: number, candleTimeFrame: CandleTimeframe, periods: number) {
    let tokens = await updateTokenList(chain, minMc);
    //console.log(tokens);
    tokens.forEach(token => {
        console.log(token.address)
        insertTokenOHLCVbyPeriods(chain, token.address, candleTimeFrame, periods);
    });
}


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}