import { getCurrentTime, generateRoundNo } from '@/api/utill/functions';
import { getUserInfo, updateUserInfo, updateUserBalance, saveHistory, updateSequenceHistory } from '@/common/models';
import { PGActionType, PGScoreProps, IPGSpinParamType, HistoryType, SequenceHistoryType } from '@/api/utill/interface';
import { getSymbols, checkScoreLine, getPrizeInfo, generateSpinResponse } from './function';
import { generatePgNextId, generatePGError } from '../pgFunctions';

export const fortuneRabbitService = {
    handleSpin: async ( actionData: PGActionType ) => {
        const GAMECODE = "1543462";
        const wild = 0;
        let isBalance = false;
        const userInfo = await getUserInfo( actionData.atk, GAMECODE );
        
        if( 
            ( userInfo.gameStatus.sid!=="0" &&  
            userInfo.gameStatus.sid !== actionData.id ) || 
            (actionData.id === "0" &&
            userInfo.gameStatus.id === "0")
        ) {
            const res = generatePGError( 1201, actionData.traceId );
            return res;
        }

        if( userInfo.gameStatus.coin !== Number(actionData.cs) * Number(actionData.ml)) {
            userInfo.gameStatus.coin = Number(actionData.cs) * Number(actionData.ml);
        }
        const stake = userInfo.gameStatus.coin*10; // 1 ;
        if( userInfo.balance<stake ) return generatePGError( 500, actionData.traceId );
        const symbols = getSymbols( userInfo.gameStatus.isFs );
        const isRabbit = symbols.filter( (item) => item === 1 ).length >= 8;

        if( !userInfo.gameStatus.isFs ) {
            if( isRabbit ) {
                userInfo.gameStatus.isFs = true;
            }
        }

        const scoreParams: PGScoreProps = {
            gameCode: GAMECODE,
            symbols,
            stake,
            wild
        };
        const scoreInfo = checkScoreLine( scoreParams );
        const { prizes, cptw } = getPrizeInfo( symbols, stake );
        const ctw = scoreInfo.reduce( (total, item) => Math.round( total*100 + item.profit*100 )/100, 0 ); // lineProfit
        const spinProfit = Math.round( ctw*100 + cptw*100 ) / 100;
        if( userInfo.gameStatus.isFs ) {
            userInfo.gameStatus.fsCnt++;
            userInfo.gameStatus.fsProfit = Math.round( userInfo.gameStatus.fsProfit*100 + spinProfit*100 ) / 100;
        }

        console.log(`>---> cptw=${cptw}, ctw=${ctw}, fsProfit=${userInfo.gameStatus.fsProfit}`);
        const nextId = generatePgNextId();
        userInfo.gameStatus.sid = nextId;
        
        const params: IPGSpinParamType = {
            symbols,
            actionData,
            scoreInfo,
            prizes,
            cptw,
            stake,
            ctw,
            spinProfit,
            nextId,
            isFs: userInfo.gameStatus.isFs,
            fsCnt: userInfo.gameStatus.fsCnt,
            fsProfit: userInfo.gameStatus.fsProfit,
            balance: userInfo.balance
        };
        const spinRes = generateSpinResponse( params );
        const res = {
            dt: {
                si: spinRes
            },
            err: null
        };

        const now = getCurrentTime();
        const roundid = generateRoundNo( now, GAMECODE );
        const historyInfo : HistoryType = {
            gameCode : GAMECODE, 
            roundid : roundid, 
            user : userInfo.property.user,
            balance : 0,
            currency : userInfo.property.currency,
            stake : 0,
            profit : 0,
            response : res,
            isSequence : false
        }

        if( userInfo.gameStatus.isFs ) {
            if( userInfo.gameStatus.fsCnt === 1 ) {
                userInfo.balance = Math.round( userInfo.balance*100 - stake*100 ) / 100;
                isBalance = true;
                userInfo.property.lastId = roundid;
                await saveHistory( historyInfo );
            } else {
                const sequenceHistoryInfo : SequenceHistoryType = {
                    gameCode : GAMECODE, 
                    lastId : userInfo.property.lastId, 
                    profit : 0,
                    response : res
                }
                await updateSequenceHistory( sequenceHistoryInfo ); 
            }
            if( userInfo.gameStatus.fsCnt===8 ) {
                userInfo.balance = Math.round( userInfo.balance*100 + userInfo.gameStatus.fsProfit*100 ) / 100;
                userInfo.gameStatus.isFs = false;
                userInfo.gameStatus.fsCnt = 0;
                userInfo.gameStatus.fsProfit = 0;
                isBalance = true;
            }
        } else {
            userInfo.balance = Math.round( userInfo.balance*100 - stake*100 ) / 100;
            if( spinProfit > 0 ) {
                userInfo.balance = Math.round( userInfo.balance*100 + spinProfit*100 ) / 100;
            }
            isBalance = true;
            await saveHistory( historyInfo );
        }
        if( isBalance ) {
            await updateUserBalance( userInfo.property.user, userInfo.balance );
        }
        await updateUserInfo( GAMECODE, actionData.atk, userInfo );
        return res;
    }
}
