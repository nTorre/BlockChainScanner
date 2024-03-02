import { insertOrUpdateTokenData, retireveTokensList, retrieveTokenData } from "../db/insertTokenDataDb";
import { insertBETokenOHLCV } from "../services/birdEyeService";
import { Blockchain, CandleTimeframe, TokenOHLCV } from "../types/customTypes";
import { getFromByPeriods } from "../utils/dataUtils";
import { getTokenList } from "./tokenInfoController";

export async function insertTokenOHLCV(chain: Blockchain, address: string, candleTimeframe: CandleTimeframe, timeFrom: number, timeTo: number) {
    // dovrei controllare che non ci siano già i dati dentro il db (per evitare doppie richieste)
    insertBETokenOHLCV(chain, address, candleTimeframe, timeFrom, timeTo).then((result: TokenOHLCV) => {
        insertOrUpdateTokenData(result);
    });
}

export async function insertTokenOHLCVbyPeriods(chain: Blockchain, address: string, candleTimeframe: CandleTimeframe, periods: number) {
    // calcolo from e to in base ai periodi
    let to = Math.floor(new Date().getTime() / 1000);
    let from = getFromByPeriods(to, periods, candleTimeframe);

    await insertTokenOHLCV(chain, address, candleTimeframe, from, to);
}

export async function getTokenOHLCV(chain: Blockchain, address: string, candleTimeframe: CandleTimeframe, periods: number): Promise<TokenOHLCV> {
    // recupero i dati da database

    return retrieveTokenData(chain, address, candleTimeframe, periods).then((data: TokenOHLCV) => {
        return data;
    }).catch( err =>{
        throw(err);
    });

}

export async function updateTokensData(chain: Blockchain, candleTimeframe: CandleTimeframe, periods: number, minMc: number) {
    console.log("Ciao");
    let tokensList = await retireveTokensList(chain, minMc);
    for (let i=0; i<tokensList.length; i++){
        let token = tokensList[i];
        await insertTokenOHLCVbyPeriods(chain, token.address, candleTimeframe, periods);
    }
}

