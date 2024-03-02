import { OkPacket } from "mysql";
import { TokenOHLCV, Blockchain, CandleTimeframe, SimpleCandle, Token } from "../types/customTypes";
import { connection } from "./connectionDb";
import { RowDataPacket } from 'mysql2';
import { retireveTokenList } from "./insertTokenInfoDb";

export async function insertOrUpdateTokenData(candles: TokenOHLCV) {
    try {

        // recupero il token id dall'address
        let address: string = candles.address;
        let tokenId = await getTokenId(address);

        candles.candles.forEach(async candle => {
            await (await connection).execute(
                `INSERT INTO token_historical_data (token_id, close, high, low, open, type, unixTime, volume) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                close = VALUES(close),
                high = VALUES(high),
                low = VALUES(low),
                open = VALUES(open),
                volume = VALUES(volume)`,
                [tokenId, candle.close, candle.high, candle.low, candle.open, candles.type, candle.unixTime, candle.volume]
            );
        });

        console.log('Elemento inserito con successo nella tabella token_historical_data.');
    } catch (error) {
        console.error('Errore durante l\'inserimento dell\'elemento nella tabella token_historical_data:', error);
        throw error;
    }
}


// TODO: riscrivere generica con data di inizio e fine
export async function retrieveTokenData(chain: Blockchain, address: string, candleTimeframe: CandleTimeframe, periods: number): Promise<TokenOHLCV> {
    // recupero i dati, scrivere query
    try {
        let tokenId = await getTokenId(address);
        let sql = 'SELECT * FROM token_historical_data WHERE token_id = ? AND type = ? ORDER BY unixTime DESC LIMIT ?';
        const [rows, fields] = await (await connection).execute<RowDataPacket[]>(sql, [tokenId, candleTimeframe, periods]);
        
        let data: TokenOHLCV = {
            address: address,
            type: candleTimeframe,
            candles: []
        }

        rows.reverse().forEach(element => {
            let candle: SimpleCandle = {
                open: element.open,
                high: element.high,
                low: element.low,
                close: element.close,
                volume: element.volume,
                unixTime: element.unixTime
            }

            data.candles.push(candle);
        })

        return data;

    } catch (error) {
        throw(error);
    }
}

export async function retireveTokensList(chain: Blockchain, minMc: number): Promise<Token[]> {
    return retireveTokenList(chain, minMc);
}


async function getTokenId(address: string): Promise<number> {
    try{
        let sql = 'SELECT * from token_details WHERE address = ?'
        let [result, fields] = await (await connection).execute<RowDataPacket[]>(sql, [address]);
        let tokenId: number = result[0].id;
        return tokenId;
    } catch (err){
        throw(err);
    }
}
