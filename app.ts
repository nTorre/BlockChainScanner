import { testChecker } from './src/controllers/globalController';
import { updateTokensData } from './src/controllers/tokenDataController';
import { updateTokenList } from './src/controllers/tokenInfoController';
import { bollingerBadsChecker } from './src/indicators/bollingerBands';
import { deleteFilesInDirectory } from './src/services/chart';
import TelegramBot, { Message } from 'node-telegram-bot-api';
const cron = require('node-cron');
const moment = require('moment');
// Setup data downloader

import { Blockchain, TokenOHLCV } from "./src/types/customTypes";
import { ids } from './src/services/telegram';

// Setup data checker

let bollingerBotToken = "6473366973:AAFAXkT1YJIrWNCFlCON6kTrHhvjXM0cWxc";
    const bollingerBot = new TelegramBot(bollingerBotToken, { polling: true });
    bollingerBot.on('message', (msg: Message) => {
        let id = msg.chat.id;
        ids.push(id);
        // add id to list and send;
    });

async function bollingerSolana() {

    await updateTokenList(Blockchain.Solana, 100_000).then(async ()=>{
        await updateTokensData(Blockchain.Solana, '2H', 22, 100_000);
    });

    await deleteFilesInDirectory('./assets/charts');

    await testChecker(bollingerBot, Blockchain.Solana, 100_000, 21, '2H', bollingerBadsChecker);
}



async function bollingerBase() {

    await updateTokenList(Blockchain.Base, 100_000).then(async ()=>{
        await updateTokensData(Blockchain.Base, '2H', 22, 100_000);
    });

    await deleteFilesInDirectory('./assets/charts');

    let bollingerBotToken = "7084829241:AAH2HKEPmMfJtXCIHj4faFZv51i0jC7Ybsg";
    const bollingerBot = new TelegramBot(bollingerBotToken, { polling: true });
    
    await testChecker(bollingerBot, Blockchain.Base, 800_000, 21, '2H', bollingerBadsChecker);
}


cron.schedule('0 * * * *', async () => {
    const oraCorrente = moment().hour();
    if (oraCorrente % 2 === 0) {
        bollingerSolana();
    }
});

