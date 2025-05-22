import { PGActionType, HistoryType } from '@/api/utill/interface';
import { getCurrentTime, generateRoundNo } from '@/api/utill/functions';
import { getUserInfo, updateUserInfo, updateUserBalance, saveHistory, updateSequenceHistory } from '@/common/models';
import { getSymbols, generateSpinResponse } from './function';

export const cashManiaService = {
    handleSpin: async( actionData: PGActionType ) => {
        const GAMECODE = "1682240";
        
        const userInfo = await getUserInfo( actionData.atk, GAMECODE );

        const symbols = getSymbols( );
        const params = {
            symbols,
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

        await saveHistory( historyInfo );

        return res;
    }
}