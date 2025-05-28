import * as GlobalTypes from '@/api/utill/interface';
import * as GlobalConstants from '@/api/utill/constants';
import * as GlobalFunctions from '@/api/utill/functions';
import * as Models from '@/common/models';
import * as Functions from '@/api/game/pgsoft/1695365/function';
import { generatePgNextId, generatePGError } from '@/api/game/pgsoft/pgFunctions';

export const fortuneDragonService = {
    handleSpin: async (actionData: GlobalTypes.PGActionType) => {
        const GAMECODE = "1695365";
        const userInfo = await Models.getUserInfo( actionData.atk, GAMECODE );
        if (userInfo === null) return GlobalConstants.ERRORSTRING[6];

        const rtp = userInfo.property.rtp;        
        const ml = Number(actionData.ml);
        const cs = Number(actionData.cs);
        const betCoin = Math.round( cs * ml * 100 )/100;
        let bcCoin = betCoin;
        if (Number(actionData.fb) === 2) bcCoin = 5 * betCoin;
        if( userInfo.balance<5*bcCoin ) return generatePGError( 500, actionData.traceId );

        let twMoney = 0;
        let limitFlag = false;
        userInfo.gameStatus.coin = cs;
        
        if (userInfo.gameStatus.twMoney !== 0) userInfo.gameStatus.cwc++;
        else userInfo.gameStatus.cwc = 0;
        
        if( ( userInfo.balance - 5 * bcCoin ) < 0 ) return GlobalConstants.ERRORSTRING[ 1 ];
        if (!userInfo.gameStatus.isFWS) userInfo.balance = Math.round(100 * userInfo.balance - 500 * bcCoin) / 100;

        const gameInfo = Functions.getGameInfo( userInfo.gameStatus.isFWS, betCoin, actionData.fb);
        if (gameInfo.mulInfo.it) {
            userInfo.gameStatus.isFWS = true;
            if (userInfo.gameStatus.fwsCnt === -1) userInfo.gameStatus.fwsCnt = 1;
        }        
        if (gameInfo.paylineInfo.totalWin !== 0) twMoney = Math.round(100 * gameInfo.mulInfo.gm * gameInfo.paylineInfo.totalWin) / 100;
        else twMoney = 0;
        if (userInfo.gameStatus.isFWS) {
            userInfo.gameStatus.fsProfit = Math.round(100 * userInfo.gameStatus.fsProfit + 100 * twMoney) / 100;
            limitFlag = Math.round(100 * userInfo.gameStatus.fsProfit / (5 * bcCoin)) / 100 === 2500 ? true : false;
        } else {
            limitFlag = Math.round(100 * twMoney / (5 * bcCoin)) / 100 === 2500 ? true : false;
        }
        userInfo.gameStatus.twMoney = twMoney;

        const spinParams : any = {
            ml : ml,
            pf : Number(actionData.pf),
            wk : actionData.wk,
            coin : Number(actionData.cs),
            spinCycleWin: twMoney,
            betCoin : betCoin,
            balance : userInfo.balance,
            gameInfo : gameInfo,
            cwcVal : userInfo.gameStatus.cwc,
            isFWS : userInfo.gameStatus.isFWS,
            fwsCnt : userInfo.gameStatus.fwsCnt,
            fsWinMoney :userInfo.gameStatus.fsProfit
        }
        const spinResponse = Functions.generateSpinResponse(spinParams);
        const res = {
            dt: {
                si: spinResponse
            },
            err: null
        };
        const roundid = generatePgNextId();
        const historyInfo : GlobalTypes.HistoryType = {
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

        if (userInfo.gameStatus.isFWS) {            
            if (userInfo.gameStatus.fwsCnt === 1) {
                await Models.saveHistory( historyInfo );
                userInfo.property.lastId = roundid;
            } else {
                const sequenceHistoryInfo : GlobalTypes.SequenceHistoryType = {
                    gameCode : GAMECODE, 
                    lastId : userInfo.property.lastId, 
                    profit : 0,
                    response : res
                }
                await Models.updateSequenceHistory( sequenceHistoryInfo ); 
            }

            userInfo.gameStatus.fwsCnt++;
            if (limitFlag) userInfo.gameStatus.fwsCnt = 9;
            if (userInfo.gameStatus.fwsCnt === 9) {
                userInfo.gameStatus.fsProfit = 0;
                userInfo.gameStatus.isFWS = false;
            }
        }

        userInfo.balance = Math.round( 100 * userInfo.balance + 100 * twMoney ) / 100;   
        if (userInfo.gameStatus.fwsCnt === 9)  userInfo.gameStatus.fwsCnt = -1;
        else await Models.saveHistory( historyInfo );
        
        await Models.updateUserBalance( userInfo.property.user, userInfo.balance );
        await Models.updateUserInfo( GAMECODE, userInfo.token, userInfo );
        return res;
    }
}
