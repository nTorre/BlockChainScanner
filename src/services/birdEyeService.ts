import axios from 'axios';
import dotenv from 'dotenv';
import { BEToken, BECandle } from './../types/servicesTypes'
import { Blockchain, CandleTimeframe, Token, TokenOHLCV, SimpleCandle } from './../types/customTypes';

dotenv.config();

export async function getTokens(chain: Blockchain, offset: number = 0): Promise<Token[]> {
    try {
        const headers: object = {
            'X-API-KEY': process.env.BIRDEYE_TOKEN,
            'x-chain': chain,
        };

        const response = await axios.get(`https://public-api.birdeye.so/defi/tokenlist?sort_by=mc&sort_type=desc&offset=${offset}&limit=50`, { headers });
        if (!response.data.success) {
            throw new Error("error downloading data");
        }

        let result: Token[] = [];

        response.data.data.tokens.forEach((beToken: BEToken) => {
            let token: Token = {
                address: beToken.address,
                decimals: beToken.decimals,
                liquidity: beToken.liquidity,
                logoURI: beToken.logoURI,
                mc: beToken.mc,
                symbol: beToken.symbol,
                v24hChangePercent: beToken.v24hChangePercent,
                v24hUSD: beToken.v24hUSD,
                name: beToken.name,
                lastTradeUnixTime: beToken.lastTradeUnixTime,
                chain: chain,
                time: response.data.data.updateUnixTime
            };
            result.push(token);
        });


        return result; // Si assume che response.data sia nel formato corretto
    } catch (error) {
        throw new Error(error as string); // Puoi lanciare un errore specifico se necessario
    }
}

export async function insertBETokenOHLCV(chain: Blockchain, address: string, candleTimeframe: CandleTimeframe, timeFrom: number, timeTo: number): Promise<TokenOHLCV> {
    try {
        const headers: object = {
            'X-API-KEY': process.env.BIRDEYE_TOKEN,
            'x-chain': chain,
        };

        const response = await axios.get(`https://public-api.birdeye.so/defi/ohlcv?address=${address}&type=${candleTimeframe}&time_from=${timeFrom}&time_to=${timeTo}`, { headers });
        if (!response.data.success) {
            throw new Error("error downloading data");
        }

        let result: TokenOHLCV = {
            address: address,
            type: candleTimeframe,
            candles: []
        }

        response.data.data.items.forEach((candle: BECandle) => {
            let simpleCandle: SimpleCandle = {
                open: candle.o,
                high: candle.h,
                low: candle.l,
                close: candle.c,
                volume: candle.v,
                unixTime: candle.unixTime
            }
            result.candles.push(simpleCandle);
        });

        return result; // Si assume che response.data sia nel formato corretto
    } catch (error) {
        throw new Error(error as string); // Puoi lanciare un errore specifico se necessario
    }
}

module.exports = { getTokens, insertBETokenOHLCV }