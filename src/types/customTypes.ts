type CandleTimeframe = '1m' | '3m' | '5m' | '15m' | '30m' | '1H' | '2H' | '4H' | '6H' | '8H' | '12H' | '1D' | '3D' | '1W' | '1M';

enum Blockchain {
    Solana = 'solana',
    Ethereum = 'ethereum',
    Arbitrium = 'arbitrium',
    Avalance = 'avalanche',
    Bsc = 'bsc',
    Optimism = 'optimism',
    Polygon = 'polygon',
    Base = 'base'
}

type Token = {
    address: string,
    decimals: number,
    liquidity: number,
    logoURI: string,
    mc: number,
    symbol: string,
    v24hChangePercent: number,
    v24hUSD: number,
    name: string,
    lastTradeUnixTime: number,
    chain: Blockchain,
    time: number,
}

interface GenericCandle extends SimpleCandle {
    address: string,
    type: CandleTimeframe
}

interface SimpleCandle {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    unixTime: number;
}

type TokenOHLCV = {
    address: string,
    type: CandleTimeframe,
    candles: SimpleCandle[]
}

export { Blockchain, Token, CandleTimeframe, TokenOHLCV, SimpleCandle };