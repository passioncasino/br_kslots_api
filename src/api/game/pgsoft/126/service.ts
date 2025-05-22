import * as GlobalTypes from '@/api/utill/interface';
import * as GlobalConstants from '@/api/utill/constants';
import * as GlobalFunctions from '@/api/utill/functions';
import * as Models from '@/common/models';
import * as Functions from './function';

export const fortuneTigerService = {
    handleSpin: async (actionData: GlobalTypes.PGActionType) => {
        const GAMECODE = "126";
        const userInfo = await Models.getUserInfo( actionData.atk, GAMECODE );
        if (userInfo === null) return GlobalConstants.ERRORSTRING[6];

        userInfo.gameStatus.coin = Number(actionData.cs);
        const ml = Number(actionData.ml);
        const rtp = userInfo.property.rtp;
        const now = GlobalFunctions.getCurrentTime();
        const betCoin = Math.round( userInfo.gameStatus.coin*ml*100 )/100;
        if ((userInfo.balance - 10 * betCoin) < 0) return GlobalFunctions.generatePGError( 500, actionData.traceId );

        const symbolsInfo = Functions.getSymbolInfo( rtp, userInfo.gameStatus.isFWS, userInfo.gameStatus.fws, userInfo.gameStatus.fwsSymbols );
        const scoreInfo = GlobalFunctions.checkScoreLine(symbolsInfo.symbols, GAMECODE, 0);
        const benefits = GlobalFunctions.calcScoreLineBenefit(scoreInfo, betCoin, GAMECODE, 3);
        const multiplier = benefits.length === 5 ? 10 : 1;
        const lineProfit = benefits.reduce((total, item)=>Math.round(total*100+item*100)/100, 0) * multiplier ;

        if( symbolsInfo.fwsResult.length > 0  ) {
            userInfo.gameStatus.fwsCnt++;
            if( userInfo.gameStatus.fwsCnt===0 ) {
                if(scoreInfo.length > 0) {
                    userInfo.gameStatus.isFWS = true;
                    userInfo.gameStatus.fws = Number( symbolsInfo.fwsResult[0][0] );
                    userInfo.gameStatus.fwsSymbols = symbolsInfo.symbols;
                } else {
                    userInfo.gameStatus.fwsCnt = -1;
                }
            } else {
                if( GlobalFunctions.compareArray( userInfo.gameStatus.fwsSymbols, symbolsInfo.symbols ) === false ) userInfo.gameStatus.fwsSymbols = symbolsInfo.symbols;
                else userInfo.gameStatus.isFWS = false;

                if( benefits.length === 5 ) userInfo.gameStatus.isFWS = false;
            }
        }

        if( !userInfo.gameStatus.isFWS ) {
            if( userInfo.gameStatus.fwsCnt===-1 ) userInfo.balance = Math.round( userInfo.balance*100-betCoin*1000 ) / 100;
        } else {
            if( userInfo.gameStatus.fwsCnt === 0) userInfo.balance = Math.round( userInfo.balance*100-betCoin*1000 ) / 100;
        }
        const spinProfit = userInfo.gameStatus.isFWS ? 0 : lineProfit;
        const roundid = GlobalFunctions.generateRoundNo( now, GAMECODE );

        const spinParams : any = {
            ml : ml,
            pf : Number(actionData.pf),
            wk : actionData.wk,
            coin : actionData.cs,
            betCoin : betCoin,
            isFWS : userInfo.gameStatus.isFWS,
            newFwsFlag : GlobalFunctions.compareArray( userInfo.gameStatus.fwsSymbols, symbolsInfo.symbols ),
            balance : userInfo.balance,
            symbols : symbolsInfo.symbols,
            scoreInfo : scoreInfo,
            benefits : benefits,
            spinProfit : spinProfit,
            fwsVal : userInfo.gameStatus.fws,
            fwsCnt : userInfo.gameStatus.fwsCnt
        }
        const spinResponse = Functions.generateSpinResponse( spinParams );
        const res = {
            dt: {
                si: spinResponse
            },
            err: null
        }
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
        const sequenceHistoryInfo : GlobalTypes.SequenceHistoryType = {
            gameCode : GAMECODE, 
            lastId : userInfo.property.lastId, 
            profit : 0,
            response : res
        }
        
        if( !userInfo.gameStatus.isFWS ) {
            if( userInfo.gameStatus.fwsCnt===-1 ) {
                await Models.saveHistory( historyInfo );
            }
        } else {
            if( userInfo.gameStatus.fwsCnt===0 ) {
                userInfo.property.lastId = roundid;
                await Models.saveHistory( historyInfo );
            } else{
                await  Models.updateSequenceHistory( sequenceHistoryInfo );
            }
        }

        if( !userInfo.gameStatus.isFWS ) {
            if( userInfo.gameStatus.fwsCnt>0 ) {
                if( userInfo.gameStatus.fwsCnt === 0 ) {
                    userInfo.balance = Math.round( userInfo.balance*100+spinProfit*100-betCoin*500 ) / 100;
                }
            } else  {
                userInfo.gameStatus.fwsSymbols.length = 0;
            }
            
            userInfo.balance = Math.round( userInfo.balance*100+spinProfit*100 ) / 100;

            userInfo.gameStatus.fws = 0;
            userInfo.gameStatus.fwsCnt = -1;
        }

        await Models.updateUserBalance( userInfo.property.user, userInfo.balance );
        await Models.updateUserInfo( GAMECODE, userInfo.token, userInfo );
        return res;
    }
}