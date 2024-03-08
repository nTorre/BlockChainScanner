import { Blockchain, Token, TokenOHLCV } from "../types/customTypes";
import { genChart } from '../services/chart';

export var ids: number[] = [];

export async function sendSignal(bot: any, tokenData: TokenOHLCV, token: Token, chain: Blockchain){
    const markdownMessage = `
⛓ Chain: *${chain}*
💵 Pair detected: *${token.symbol}/USD*
📊 Address: \`${token.address}\`

Price USD: *${tokenData.candles[tokenData.candles.length-1].close} $*
FDV: *${Number(token.mc).toFixed(2)}$*
Total liquidity: *${Number(token.liquidity).toFixed(2)}*

Last volume (2H): *${Number(tokenData.candles[tokenData.candles.length-2].volume).toFixed(2)}*`;

let file = "./assets/charts/" + token.address + (new Date()).getTime() + ".png";

    genChart(tokenData, file);

    await sleep(500);

    for (let i=0;i<ids.length; i++){
        let id = ids[i];
        bot.sendPhoto(id, file, {
            caption: markdownMessage, parse_mode: 'Markdown', reply_markup: {
                inline_keyboard: [
                    [
                        { text: '🦉 BirdEye', url: `https://birdeye.so/token/${token.address}?chain=solana` },
                        { text: '🦅 DexScreener', url: `https://dexscreener.com/solana/${token.address}` }
                    ]
                ]
            }
        });
    }
}

function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}