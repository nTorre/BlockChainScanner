import { connection } from './connectionDb';
import { Token, Blockchain } from '../types/customTypes';
import { RowDataPacket } from 'mysql2';

export async function insertOrUpdateTokens(tokens: Token[]) {
    try {
        for (const token of tokens) {
            await (await connection).query(
                `INSERT INTO token_details (address, decimals, logoURI, symbol, name, liquidity, last_update, mc, blockchain) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE 
                decimals = VALUES(decimals), 
                logoURI = VALUES(logoURI), 
                symbol = VALUES(symbol), 
                name = VALUES(name), 
                liquidity = VALUES(liquidity), 
                last_update = VALUES(last_update), 
                mc = VALUES(mc), 
                blockchain = VALUES(blockchain)`,
                [token.address, token.decimals, token.logoURI, token.symbol, token.name, token.liquidity, token.time, token.mc, token.chain]
            );
        }
        console.log('Inserimento/Aggiornamento completato con successo per tutti i token.');
    } catch (error) {
        console.error('Errore durante l\'inserimento/aggiornamento dei token:', error);
        throw error;
    }
}

export async function retireveTokenList(chain: Blockchain, minMc: number): Promise<Token[]> {
    try {
        let sql = 'SELECT * FROM token_details WHERE blockchain = ? AND mc >= ? AND liquidity > 1';
        const [rows, fields] = await (await connection).execute<RowDataPacket[]>(sql, [chain, minMc]);

        return rows as Token[];

    } catch (error) {
        throw(error);
    }
}

export async function clearTable(tableName: string) {
    try {
        await (await connection).execute(`TRUNCATE TABLE ${tableName}`);
        console.log(`Tabella ${tableName} pulita con successo.`);
    } catch (error) {
        console.error(`Errore durante la pulizia della tabella ${tableName}:`, error);
        throw error;
    }
}
