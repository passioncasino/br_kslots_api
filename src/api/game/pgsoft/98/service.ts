import { getUserInfo, saveHistory, updateUserInfo, updateUserBalance, updateSequenceHistory } from '@/common/models';
import { getCurrentTime, generatePgNextId, generateRoundNo } from '@/api/utill/functions';
import { PGActionType, PGScoreProps, PGSpinParamType, HistoryType, SequenceHistoryType } from '@/api/utill/interface';
import { getGameInfo, generateSpinResponse } from './function';
export const fortuneOxService = {
    handleSpin: async ( actionData: PGActionType ) => {
        const GAMECODE = "98";
        const userInfo = await getUserInfo( actionData.atk, GAMECODE );

        const isFunMode = userInfo.property.mode === 0 ? true : false;
        const rtp = userInfo.property.rtp;
        const now = getCurrentTime();
        const ml = Number(actionData.ml);
        const cs = Number(actionData.cs);
        const betCoin = Math.round(cs * ml * 100) / 100;
        userInfo.gameStatus.coin = Number(actionData.cs);

        // if ((userInfo.balance - 10 * betCoin) < 0) return GlobalConstants.ERRORSTRING[1];
        if (!userInfo.gameStatus.isFWS) userInfo.balance = Math.round(100 * userInfo.balance - 1000 * betCoin) / 100;

        const gameInfo = getGameInfo( userInfo.gameStatus.isFWS, betCoin );
        if (gameInfo.isOxFeature) {
            userInfo.gameStatus.isFWS = true;
            if (userInfo.gameStatus.fwsCnt === -1) userInfo.gameStatus.fwsCnt = 0;
            if (gameInfo.scoreInfo.totalWin !== 0 && userInfo.gameStatus.fwsCnt === 0) {
                userInfo.gameStatus.fwsCnt = -1;
                userInfo.gameStatus.isFWS = false;
            }
        }
        const twMoney = Math.round(100 * gameInfo.scoreInfo.totalWin) / 100;
        const spinParams : any = {
            ml : ml,
            pf : Number(actionData.pf),
            wk : actionData.wk,
            coin : Number(actionData.cs),
            spinCycleWin: twMoney,
            betCoin : betCoin,
            balance : userInfo.balance,
            gameInfo : gameInfo,
            isFWS : userInfo.gameStatus.isFWS,
            fwsCnt : userInfo.gameStatus.fwsCnt
        }

        const spinRes = generateSpinResponse(spinParams);
        const resp = {
            dt: {
                si: spinRes
            },
            err: null
        }
        const roundid = generateRoundNo( now, GAMECODE );
        const historyInfo : HistoryType = {
            gameCode : GAMECODE, 
            roundid : roundid, 
            user : userInfo.property.user,
            balance : 0,
            currency : userInfo.property.currency,
            stake : 0,
            profit : 0,
            response : resp,
            isSequence : false
        }

        if (userInfo.gameStatus.isFWS) {            
            if (userInfo.gameStatus.fwsCnt === 0) {
                userInfo.property.lastId = roundid;
                await saveHistory( historyInfo );
            } else {
                const sequenceHistoryInfo : SequenceHistoryType = {
                    gameCode : GAMECODE, 
                    lastId : userInfo.property.lastId, 
                    profit : 0,
                    response : resp
                }
                await updateSequenceHistory( sequenceHistoryInfo ); 
            }

            if (gameInfo.scoreInfo.totalWin !== 0) userInfo.gameStatus.isFWS = false;
            else userInfo.gameStatus.fwsCnt++;
        }

        if (!userInfo.gameStatus.isFWS) {
            userInfo.balance = Math.round( 100 * userInfo.balance + 100 * twMoney ) / 100;
            if (userInfo.gameStatus.fwsCnt > 0 && gameInfo.scoreInfo.totalWin !== 0) {
                userInfo.gameStatus.fwsCnt = -1;
            } else {
                await saveHistory( historyInfo );
            }
        }
        await updateUserBalance( userInfo.property.user, userInfo.balance );
        await updateUserInfo( GAMECODE, userInfo.token, userInfo );

        return resp;
    }
}