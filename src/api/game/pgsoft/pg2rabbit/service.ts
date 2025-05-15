import { PGActionType, HistoryType, SequenceHistoryType, SpinType } from '@/api/utill/interface';
import * as GlobalConstants from '@/api/utill/constants';
import * as GlobalFunctions from '@/api/utill/functions';
import * as Models from '@/common/models';
import * as Functions from '@/api/game/pgsoft/pg2rabbit/function';

export const pg2rabbitService = {
    handleSpin: async (actionData: PGActionType) => {
        let twMoney = 0;
        let limitFlag = false;
        const GAMECODE = "1543462";
        const userInfo = await Models.getUserInfo( actionData.atk, GAMECODE );
        if (userInfo === null) return GlobalConstants.ERRORSTRING[6];

        userInfo.gameStatus.coin = Number(actionData.cs);
        const ml = Number(actionData.ml);
        const cs = Number(actionData.cs);
        const rtp = userInfo.property.rtp;
        const now = GlobalFunctions.getCurrentTime();
        const betCoin = Math.round(cs * ml * 100) / 100;
        if (userInfo.gameStatus.twMoney !== 0) userInfo.gameStatus.cwc++;
        else userInfo.gameStatus.cwc = 0;

        if ( userInfo.balance < 10 * betCoin ) return GlobalConstants.ERRORSTRING[1];
        if (!userInfo.gameStatus.isFWS) userInfo.balance = Math.round(100 * userInfo.balance - 1000 * betCoin) / 100;
        const gameInfo = Functions.getGameInfo(rtp, userInfo.gameStatus.isFWS, betCoin);
        
        if (gameInfo.isRabbitFeature) {
            userInfo.gameStatus.isFWS = true;
            if (userInfo.gameStatus.fwsCnt === -1) userInfo.gameStatus.fwsCnt = 1;
        }
        
        twMoney = Math.round(100 * gameInfo.totalBenefits) / 100;
        if (userInfo.gameStatus.isFWS) {
            userInfo.gameStatus.fsProfit = Math.round(100 * userInfo.gameStatus.fsProfit + 100 * twMoney) / 100;
            limitFlag = Math.round(100 * userInfo.gameStatus.fsProfit / (10 * betCoin)) / 100 === 5000 ? true : false;
        } else {
            limitFlag = Math.round(100 * twMoney / (10 * betCoin)) / 100 === 5000 ? true : false;
        }
        userInfo.gameStatus.twMoney = twMoney;
        const spinParams: SpinType = {
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
        const roundid = GlobalFunctions.generateRoundNo( now, GAMECODE );

        const historyInfo: HistoryType = {
            gameCode : GAMECODE, 
            roundid : roundid, 
            user : userInfo.property.user,
            balance : 0,
            currency : userInfo.property.currency,
            stake : 0,
            profit : 0,
            response : spinResponse,
            isSequence : false
        }

        if (userInfo.gameStatus.isFWS) {
            if( userInfo.gameStatus.fwsCnt > 0 ) {
                userInfo.gameStatus.fwsSymbols = gameInfo.symbols;
                if (userInfo.gameStatus.fwsCnt === 1) {
                    userInfo.property.lastId = roundid;
                    await Models.saveHistory( historyInfo );
                } else {
                    const sequenceHistoryInfo : SequenceHistoryType = {
                        gameCode : GAMECODE, 
                        lastId : userInfo.property.lastId, 
                        profit : 0,
                        response : spinResponse
                    }
                    await Models.updateSequenceHistory( sequenceHistoryInfo ); 
                }
                userInfo.gameStatus.fwsCnt++;
                if (limitFlag) userInfo.gameStatus.fwsCnt = 9;
                if (userInfo.gameStatus.fwsCnt === 9) {
                    userInfo.gameStatus.fsProfit = 0;
                    userInfo.gameStatus.isFWS = false;
                    userInfo.gameStatus.fwsCnt = -1
                }
            }
        } else {
            userInfo.property.lastId = roundid;
            await Models.saveHistory( historyInfo );
        }
        if( twMoney>0 ) {
            userInfo.balance = Math.round( 100*userInfo.balance + 100*twMoney ) / 100;    
        }
        await Models.updateUserBalance( userInfo.property.user, userInfo.balance );
        
        await Models.updateUserInfo( GAMECODE, userInfo.token, userInfo );
        return spinResponse;
    }
}
