import { PGActionType, HistoryType, SequenceHistoryType } from '@/api/utill/interface';
import { getCurrentTime, generateRoundNo } from '@/api/utill/functions';
import { getUserInfo, updateUserInfo, updateUserBalance, saveHistory, updateSequenceHistory } from '@/common/models';
import { getGameInfo, generateSpinResponse } from './function';
import { generatePgNextId, generatePGError } from '@/api/game/pgsoft/pgFunctions';

export const cashManiaService = {
    handleSpin: async( actionData: PGActionType ) => {
        let isBalance = false, isFsMore=false;
        let fsMoreCnt = 0;
        const minFs = 12;
        const GAMECODE = "1682240";
        const fsDist: {[ key: number ]: number } = { 12:5, 13:10, 14:20 };
        const userInfo = await getUserInfo( actionData.atk, GAMECODE );
        if( userInfo === null ) {
            const err = generatePGError( 1310, actionData.traceId );
            return err;
        }
        const stake = actionData.cs * actionData.ml * 10;
        if( !userInfo.gameStatus.isFs ) {
            userInfo.balance = Math.round( userInfo.balance*100-stake*100 )/100;
        }
        const gameParams = {
            stake,
            isFs: userInfo.gameStatus.isFs
        }
        const { symbols, rv, rsSymbols, rsrv, scoreInfo, flag } = getGameInfo( gameParams );
        const spinProfit = scoreInfo.length === 0 ? 0 : scoreInfo[0].profit ;
        if(
            !symbols.includes(0) &&
            symbols[4] >= minFs
        ) {
            if( !userInfo.gameStatus.isFs ) {
                userInfo.gameStatus.isFs = true;
                userInfo.gameStatus.fsMaxCnt = fsDist[ symbols[4] ];
                userInfo.gameStatus.fsType = userInfo.gameStatus.fsMaxCnt === 20 ? 2 : userInfo.gameStatus.fsMaxCnt === 10 ? 1 : 0;
            } else {
                isFsMore = true;
                userInfo.gameStatus.fsMaxCnt += fsDist[ symbols[4] ];
                fsMoreCnt = fsDist[ symbols[4] ];
            }
        }

        if( userInfo.gameStatus.isFs ) {
            userInfo.gameStatus.fsCnt++;
            if( spinProfit>0 ) userInfo.gameStatus.fsProfit = Math.round( userInfo.gameStatus.fsProfit*100 + spinProfit*100 ) / 100;
            console.log(`userInfo.gameStatus.fsProfit=`, userInfo.gameStatus.fsProfit);
        }

        const nextId = generatePgNextId();
        userInfo.gameStatus.sid = nextId;
        const params = {
            actionData,
            symbols,
            rv,
            rsSymbols,
            rsrv,
            scoreInfo,
            flag,
            stake,
            spinProfit,
            nextId,
            isFsMore,
            fsMoreCnt,
            isFs: userInfo.gameStatus.isFs,
            fsType: userInfo.gameStatus.fsType,
            fsCnt: userInfo.gameStatus.fsCnt,
            fsMaxCnt: userInfo.gameStatus.fsMaxCnt,
            fsProfit: userInfo.gameStatus.fsProfit,
            balance: userInfo.balance
        }
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
            if( userInfo.gameStatus.fsCnt===0 ) {
                isBalance = true;
                await saveHistory( historyInfo );
            } else {
                const sequenceHistoryInfo: SequenceHistoryType = {
                    gameCode : GAMECODE, 
                    lastId : userInfo.property.lastId, 
                    profit : 0,
                    response : res
                }
                await updateSequenceHistory( sequenceHistoryInfo ); 
            }
            if( userInfo.gameStatus.fsCnt === userInfo.gameStatus.fsMaxCnt ) {
                isBalance = true;
                userInfo.balance = Math.round( userInfo.balance*100 + userInfo.gameStatus.fsProfit*100 )/100;
                userInfo.gameStatus.isFs = false;
                userInfo.gameStatus.fsCnt = -1;
                userInfo.gameStatus.fsMaxCnt = 0;
                userInfo.gameStatus.fsProfit = 0;
            }
        } else {
            await saveHistory( historyInfo );
            isBalance = true;
            if( spinProfit>0 ) userInfo.balance = Math.round( userInfo.balance*100 + spinProfit*100 )/100;
        }

        if( isBalance ) {
            await updateUserBalance( userInfo.property.user, userInfo.balance );
        }

        await updateUserInfo( GAMECODE, actionData.atk, userInfo );
        return res;
    }
}