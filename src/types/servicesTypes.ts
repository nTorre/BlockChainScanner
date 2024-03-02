import { CandleTimeframe } from "./customTypes"

type BECandle = {
    o: number,
    h: number,
    l: number,
    c: number,
    v: number,
    unixTime: number,
    address: string,
    type: CandleTimeframe
}

type BEToken = {
    address: string,
    decimals: number,
    liquidity: number,
    logoURI: string,
    mc: number,
    symbol: string,
    v24hChangePercent: number,
    v24hUSD: number,
    name: string,
    lastTradeUnixTime: number
}

export { BECandle, BEToken }