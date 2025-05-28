import isaac from 'isaac';
import * as Models from "@/common/models";
import { LauncherType } from "@/api/utill/interface";
import * as GlobalConstants from "@/api/utill/constants";

let round = 0;

export const validateProviderParams = ( params : LauncherType ) => {
    if(params.ip === "") return 7;
    if(params.mode === "") return 7;
    if(params.lang === "") return 7;
    if(params.game === "") return 8;
    if(params.currency === "") return 7;
    else {
        if( params.rtp===1 || params.rtp===2 || params.rtp===3 ) return 0;
        else return 7;
    }
}

export const getCurrentTime = () => {
    return Date.now();
}

export const generateRandomString = ( length:number, type:number ) => {
    const chars = type === 1 ? 'abcdefghijklmnopqrstuvwxyz' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' + '0123456789';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export const generateToken = async( mode:string ) => {
    const part1 = generateRandomString( 8, 0 );
    const part2 = mode==="real" ? "R" : "F" + generateRandomString( 3, 0 );
    const part3 = generateRandomString( 4, 0 );
    const part4 = generateRandomString( 4, 0 );
    const part5 = generateRandomString( 12, 0 );
    const token = `${part1}-${part2}-${part3}-${part4}-${part5}`;
    return token;
}

export const getIdxByRand = ( gameCode:string, flag: string ) => {
    const multipliers = GlobalConstants.MULTIPLIER_RULE_BY_GAME[ gameCode ][ flag ].multipliers;
    const rules = GlobalConstants.MULTIPLIER_RULE_BY_GAME[ gameCode ][ flag ].rules;
    const mulRand = isaac.random();
    let mul = multipliers[ 0 ];
    for( let i=0; i<rules.length; i++ ) {
        if( rules[i]>=mulRand ) {
            mul = multipliers[ i ];
            return mul;
        }
    }
    return mul;
}

export const generateProviderErrorString = ( errorCode : number ) => {
    let errorString : any;
    errorString = {
        error : errorCode,
        description : GlobalConstants.ERRORDESCRIPTION[ errorCode ]
    }
    return errorString;
}

export const generateRoundNo = ( now : number, symbolName : string ) => {
    round++;
    if( round>100000 ) round = 0;
    return "" + String(symbolName) + "_" + now + round.toString().padStart(8, '0');
}

export const generateErrorResponse = ( errorCode:number ) => {
    const response = {
        error : errorCode,
        description : GlobalConstants.ERRORMSG[errorCode]
    };
    return response;
}
/**
 * Common functions
 */
export const checkScoreLine = ( symbolArr : number[], gameCode : string, wild : number ) => {
    let minKey = 0;
    let twoSymbol = 0;
    let maxKey = 10;
    const payArr : any[] = [];

    for( let i=1; i<=Object.keys( GlobalConstants.PAYLINESBYGAME[gameCode] ).length; i++ ) {
        let isWin = false;
        const payVal:any = {
            symbol: 0,
            line : 0,
            sameCount: 1
        };
        const payLine = GlobalConstants.PAYLINESBYGAME[gameCode][i];
        const keySymbol = symbolArr[payLine[0]];
        if( keySymbol >= minKey && keySymbol <= maxKey ) {
            payVal.symbol = keySymbol;
            payVal.line = i;
            for(let j = 1; j < payLine.length; j++) {
                // insert for pg
                if( payVal.symbol === wild ) {
                    for( let i=1; i<payLine.length;i++ ) {
                        if( symbolArr[payLine[i]]>1 && symbolArr[payLine[i]] !== wild ){
                            payVal.symbol = symbolArr[payLine[i]];
                            break;
                        }
                    }
                }
                // insert for pg
                if( payVal.symbol === symbolArr[ payLine[j] ] || symbolArr[ payLine[j] ] === wild ) {
                    payVal.sameCount++;
                } else {
                    break;
                }
            }
            if(payVal.sameCount === 2 && payVal.symbol === twoSymbol) isWin = true;
            else if(payVal.sameCount > 2) isWin = true;

            if(isWin) payArr.push( payVal );
        }
    }
    return payArr;
}

export const calcScoreLineBenefit = ( payArr : any[], betMoney : number, gameCode: string, reelWidth : number ) => {
    const benefits : number[] = [];
    payArr.forEach(item => {
        if( item.symbol !== -1 ) {
            benefits.push( Math.round((GlobalConstants.PAYTABLESBYGAME[gameCode][ item.symbol ][ reelWidth - item.sameCount ] || 0)*betMoney*100)/100 );
        }
    })
    return benefits;    
}

export const compareArray = ( arr1:number[], arr2:number[] ) => {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}