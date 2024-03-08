import { Blockchain, Token } from "../types/customTypes";
import { getTokens } from "../services/birdEyeService";
import { clearTable } from '../db/insertTokenInfoDb';
import { insertOrUpdateTokens, retireveTokenList } from "../db/insertTokenInfoDb";

/**
 * Ottiene le informazioni per un token
 * @param {Blockchain} chain - name of the blockchain
 * @param {number} minMc - min market cap of token
 */
export async function updateTokenList(chain: Blockchain, minMc: number): Promise<Token[]> {
    let offset: number = 0;
    let tokenList: Token[] = [];
    let exit: boolean = false;

    while (!exit) {
        try {
            const result: Token[] = await getTokens(chain, offset);

            for (const token of result) {
                if (token.mc < minMc) {
                    exit = true;
                    break;
                } else if(token.liquidity > 0){
                    tokenList.push(token);
                }
            }

            console.log("Offset:", offset);
            offset+=50;

        } catch (error) {
            console.error('Errore durante il recupero dei token:', error);
            // Gestire l'errore se necessario
            break; // Esci dal ciclo in caso di errore
        }
    }
    
    await insertOrUpdateTokens(tokenList);

    return tokenList;
}

export async function getTokenList(chain: Blockchain, minMc: number): Promise<Token[]> {
    return retireveTokenList(chain, minMc);
}

export async function clearTableInfo() {
    clearTable('token_details');
}
