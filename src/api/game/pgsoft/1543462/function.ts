import isaac from 'isaac';
import { IPGSpinParamType, PGScoreProps, IPGwinning } from "@/api/utill/interface";
import { PAYLINESBYGAME, PAYTABLESBYGAME } from "@/api/utill/constants";
import { getIdxByRand } from '@/api/utill/functions';
import { generatePGWinningInfo } from '../pgFunctions';

interface cpf {
    p: number
    bv: number // show number
    m: number
}

interface fs {
    aw: number
    s: number
    ts: number
}

const GAMECODE = "1543462", money = 8;

export const getSymbols = ( isFs:boolean ) => {
    const REELS: {[key: string]: Array<number[]>} = {
        NORMAL: [
            [
                2,7,8,8,6,4,6,4,4,4,7,5,5,4,5,7,6,7,5,5,7,4,6,5,6,6,2,8,6,5,2,6,8,4,4,4,6,6,5,8,7,5,7,7,4,6,5,6,6,2,6,8,7,7,4,7,7,2,4,6,4,4,5,7,6,7,3,8,2,6,4,5,7,8,8,4,6,7,6,6,7,4,6,7,5,7,6,7,4,4,2,5,7,2,7,2,7,8,4,7,2,4,5,2,6,4,2,5,7,2,5,6,0,7,4,5,7,7,8,8,4,7,5,2,5,6,6,4,5,6,5,6,7,7,7,2,4,3,5,6,7,6,4,8,6,6,2,3,2,7,8,0,3,7,7,2,4,6,6,6,3,8,5,5,7,2,5,2,2,7,7,4,6,2,7,2,5,7,7,6,7,2,3,6,6,5,6,6,5,5,7,8,7,4,5,5,6,6,4,7,7,6,4,6,0,5,6,6,6,6,7,5,5,6,4,8,6,7,6,2,7,6,3,7,4,7,6,7,7,8,7,7,8,7,4,6,5,5,6,3,7,7,2,7,7,6,6,6,5,5,7,6,7,8,7,7,6,7,5,6,4,4,5,7,8,4,2,5,5,6,2,5,5,4,6,5,4,6,7,5,6,8,5,6,6,6,6,6,2,6,2,4,7,8,6,3,6,4,5,4,4,5,3,6,3,2,6,7,7,6,8,7,5,6,5,6,6,7,2,7,8,6,7,4,6,2,2,6,5,6,4,6,4,6,8,2,4,7,2,6,4,5,4,8,6,5,7,2,7,5,4,4,7,4,2,6,6,6,6,4,6,8,6,7,6,5,7,2,6,2,6,4,4,8,5,5,7,4,2,5,3,3,4,3,7,6,6,4,5,6,0,7,7,5,6,6,4,4,7,8,4,6,8,6,5,7,8,5,4,8,5,5,0,7,4,5,8,5,7,5,6,6,6,5,6,7,2,6,6,7,5,8,7,6,5,6,6,0,4,5,8,2,6,6,4,4,6,3,2,2,6,5,7,6,5,2,7,4,6,7,7,5,2,8,3,2,3,8,6,2,8,7,7,7,6,6,5,2,4,7,3,3,2,7,7,2,5,3,6,2,6,2,6,5,7,4,2,6,8,6,3,4,5,6,4,7,7,8,2,3,7,6,7,5,6,4,7,6,7,3,5,5,8,6,3,7,5,3,2,6,8,5,6,4,2,7,6,6,7,7,4,6,6,5,2,6,8,6,4,6,5,6,7,6,2,5,4,6,2,6,3,6,7,6,7,7,4,0,0,0,4,4,6,7,8,6,5,4,7,6,4,6,7,7,6,7,7,2,5,5,7,6,5,6,3,6,7,2,4,2,6,2,4,6,6,5,6,6,7,3,5,4,5,6,6,4,7,7,6,8,4,4,8,7,6,6,8,7,7,2,7,5,8,3,7,2,6,6,8,6,7,7,5,6,6,7,2,6,7,5,6,6,7,6,8,7,7,3,6,5,7,8,4,7,6,6,7,0,5,7,6,7,5,6,4,5,6,4,4,7,2,8,6,6,7,5,7,5,7,6,8,4,7,5,4,6,4,6,6,2,4,6,6,7,8,4,6,6,5,5,6,2,4,7,7,6,7,5,8,2,6,2,6,4,5,6,6,8,5,6,8,7,7,7,7,4,3,6,2,7,2,3,4,6
            ], [
                6,6,6,6,2,6,2,7,5,4,8,7,7,7,2,6,2,7,7,6,6,5,7,6,5,7,5,7,5,7,5,5,6,7,8,5,5,0,6,5,6,7,7,8,7,7,8,8,2,6,7,8,7,7,7,3,3,6,6,7,6,0,4,2,7,2,5,5,5,0,7,5,7,5,5,0,7,5,7,2,7,7,2,2,6,0,7,6,6,7,4,7,7,5,6,6,2,6,6,7,7,5,7,6,7,8,6,7,7,0,5,6,5,8,2,2,6,8,5,2,6,6,2,7,7,7,3,7,3,7,7,0,0,0,0,8,5,7,5,6,5,7,3,7,7,2,5,6,6,7,7,7,6,7,5,6,8,8,5,7,5,6,8,7,7,7,6,7,6,2,5,5,5,0,5,6,5,4,6,3,4,7,7,7,6,6,3,5,3,2,5,8,7,5,6,6,7,8,7,6,3,7,7,8,6,7,6,5,2,5,5,6,5,5,0,6,8,7,5,6,2,6,2,5,6,5,5,7,5,6,6,7,6,7,7,2,7,7,6,2,5,7,6,2,7,7,0,7,7,7,5,6,2,7,5,8,5,5,7,5,5,6,6,8,3,5,8,7,8,5,6,5,7,7,6,6,8,8,5,3,6,6,6,6,7,6,5,6,5,5,0,6,7,7,6,5,5,7,8,7,7,5,7,3,7,5,8,5,5,6,7,5,7,0,7,2,7,7,5,7,7,7,5,6,7,7,5,8,5,7,6,8,7,0,6,8,7,3,4,5,6,2,5,2,0,4,2,6,5,2,7,6,0,5,7,5,7,7,5,7,7,5,5,6,6,2,7,7,6,5,5,7,5,7,8,7,6,8,5,6,5,8,6,6,6,6,6,7,7,6,4,7,3,5,8,6,7,4,5,6,7,6,6,7,5,5,8,4,0,6,5,6,6,0,2,7,2,4,8,4,8,3,7,2,8,5,7,7,5,5,2,7,6,7,0,6,5,5,2,4,7,7,8,8,6,5,7,5,8,6,7,8,4,6,7,5,7,5,5,5,4,2,6,7,6,7,7,0,6,6,8,5,6,7,5,5,8,5,8,4,5,6,5,6,0,6,7,5,6,0,7,7,6,2,5,6,7,7,6,7,2,7,2,7,7,0,6,8,7,7,7,5,5,5,4,4,5,4,7,7,7,6,8,2,6,6,5,5,7,5,8,6,5,7,6,2,7,7,3,7,5,6,5,2,5,3,6,5,7,2,2,7,8,7,7,6,3,7,5,6,6,2,6,6,7,5,7,6,6,6,5,8,7,6,7,4,6,6,5,7,6,5,4,2,7,5,7,7,7,2,8,0,7,7,2,7,7,2,8,2,7,6,5,7,6,6,5,2,2,6,7,5,6,5,0,7,6,8,7,8,7,5,7,7,2,6,5,6,7,5,8,2,7,6,7,6,6,2,8,6,6,5,6,0,2,7,6,2,7,7,0,0,0,0,7,6,2,8,0,8,8,6,0,6,5,6,2,6,7,6,3,2,5,4,4,3,6,5,6,7,6,3,7,7,5,5,8,7,5,0,4,5,6,5,6,8,0,6,5,2,7,7,7,6,3,4,5,5,2,0,6,2,6,8,8,7,4,7,7,7,7,7,2,8,7,7,2,8,6,8,5,6,7,5,6,6,0,4,6,6,7,7,7,6,7,6,7,6,7,7,2,6,7,8,6,2,7,2,7,5,0,3,6,6,6,2,6,7,6,5,5,6,2,6,6,5,4,7,8,7,6,5,6,5,7,8,7,5,0,7,3,3,7,5,2,2,7,7,8,7,6,6,6,7,6,6,5,6,6,6,6,3,5,3,7,5,6,7,8,6,6,7,6,5,7,6,6,8,7,7,6,7,8,4,7,4,2,6,8,7,6,7,8,3,7,8,7,5,3,2,5,6,2,6,7,0,6,8,7,5,5,2,6,5,7,2,0,4,6,6,7,7,7,7,6,7,2,6,7,5,6,7,5,6,7,4,3,7,2,8,4,5,5,5,7,0,4,6,6,5,7,8,6,2,6,2,5,3,7,6,6,7,3,7,5,3,7,6,6,2,0,6,8,7,0,2,6,7,6,2,2,6,7,5,6,5,5,2,7,7,7,5,5,7,2,7,3,7,7,3,7,5,6,6,8,6,6,6,7,4,8,7,6,7,7,8,7,7,6,6,6,5,5,5,6,5,6,7,7,6,8,6,0,6,7,4,8,2,7,7,3,3,6,2,2
            ], [
                8,7,5,5,5,3,2,6,3,3,4,4,7,3,6,8,3,3,5,6,5,8,6,6,4,6,4,5,0,6,4,8,5,4,3,2,3,3,3,7,0,6,2,8,8,8,7,7,5,6,0,0,5,7,4,2,4,4,0,7,0,8,4,3,7,3,2,4,3,7,5,6,6,7,7,2,0,6,7,3,6,0,3,5,6,4,0,5,2,6,6,7,6,3,3,7,5,5,5,6,6,2,5,7,3,2,0,5,4,7,6,6,0,6,3,3,5,6,7,0,5,8,0,3,6,5,3,2,4,6,3,7,5,5,4,7,5,3,4,7,3,6,5,2,6,7,6,6,2,5,7,3,8,3,7,4,3,5,5,3,2,7,2,8,0,2,7,3,7,5,7,7,6,6,2,7,6,7,8,7,7,6,6,8,6,8,5,5,6,4,5,6,6,6,6,3,6,2,8,7,6,5,6,0,7,3,3,5,2,6,5,6,2,5,5,3,2,8,2,8,5,5,2,6,3,3,5,4,2,6,3,3,5,5,4,5,6,3,6,3,4,2,6,5,7,5,5,7,3,5,7,7,4,5,7,6,2,7,3,3,6,6,4,7,5,6,7,6,8,2,3,6,6,8,3,7,5,6,7,3,4,7,7,5,5,7,5,3,8,8,2,5,6,3,5,7,5,3,2,5,5,6,7,4,7,7,8,0,3,6,6,5,6,7,8,3,6,6,7,3,4,5,8,3,6,6,2,3,5,2,8,4,3,4,4,5,2,4,8,3,5,6,2,4,6,6,0,0,0,3,3,6,5,3,4,5,5,0,3,8,0,2,7,6,5,6,6,7,2,5,8,2,2,3,2,3,3,5,4,0,4,6,4,5,5,3,4,3,6,8,7,7,8,7,2,3,0,5,8,7,2,5,2,2,5,3,4,2,2,2,6,8,5,2,4,5,2,2,5,4,7,4,3,2,7,7,7,4,3,7,4,8,8,7,6,6,6,5,4,4,4,7,2,5,4,3,3,7,5,6,7,0,3,6,5,2,6,5,3,6,6,3,5,2,3,7,7,6,5,6,6,6,6,5,2,4,3,7,3,5,7,7,3,5,6,0,8,3,7,3,2,5,5,4,2,5,6,3,7,8,4,5,6,6,8,6,7,8,0,2,5,7,3,3,6,5,6,3,3,4,3,2,6,2,7,4,4,3,3,6,4,7,5,7,4,6,3,6,5,5,5,7,6,8,6,5,7,4,6,3,5,8,4,4,8,8,4,5,5,6,3,6,3,6,5,5,4,6,5,4,2,7,3,3,4,4,3,3,3,3,7,4,0,2,6,3,5,5,0,7,6,7,4,7,4,8,3,3,4,2,3,5,6,8,4,7,6,5,4,3,3,6,4,8,5,3,7,3,6,5,0,0,3,5,6,7,3,6,3,4,7,6,5,5,4,6,2,7,3,3,3,5,7,0,6,7,6,5,7,4,6,4,6,3,4,0,6,5,0,3,7,6,4,3,7,7,3,8,5,4,8,4,6,4,8,5,4,7,5,6,6,6,6,5,6,6,5,3,5,6,4,6,6,6,2,5,7,3,6,8,6,5,5,5,7,7,6,5,3,2,5,4,4,6,6,2,6,7,8,3,7,3,5,6,7,5,5,8,6,3,0,6,5,6,7,2,6,7,7,8,2,6,6,6
            ]
        ],
        FREESPIN: [
            [
                1,8,8,1,1,1,1,1,1,8,8,1,1,1,1,1,1,8,8,1,1,1,1,1,1,8,1,1,1,1,1,8,1,1,8,1,8,1,1,1,1,1,8,8,1,1,1,1,1,1,1,8,8,1,8,1,1,1,1,1,1,1,1,1,1,8,1,1,1,1,1,1,1,1,8,8,8,1,1,8,1,1,1,1,1,1,1,8,8,1,1,1,1,1,8,1,1,1,1,1,8,1,8,1,1,1,1,1,8,1,1,1,1,1,1,8,1,1,1,8,1,1,1,8,8,1,1,1,1,1,1,8,8,1,1,1,1,1,1,1,8,8,1,1,1,1,1,1,8,1,1,1,1,1,1,1,1,8,1,1,1,1,8,1,1,1,1,8,1,1,1,1,1,1,8,8,8,1
            ],[
                1,1,8,8,8,8,1,1,1,1,1,1,1,1,8,1,1,1,8,1,8,8,8,1,1,8,1,1,8,1,8,1,1,1,1,1,8,1,1,1,1,1,8,1,1,1,1,1,8,8,1,1,8,1,1,1,1,1,1,1,8,1,1,8,1,1,8,8,1,1,1,1,1,1,8,1,1,8,1,1,1,1,8,8,1,1,8,8,1,1,8,1,1,1,1,1,1,8,1,1,1,1,1,1,1,8,8,1,1,8,8,1,1,8,1,1,1,1,1,1,1,1,8,1,8,8,8,1,1,1,8,8,1,1,1,8,8,1,1,1,8,8,1,1,1,1,1,1,8,1,8,1,1,1,1,1,1,8,1,1,8,1,1,1,1,1,1,1,8,8,8,8,1,1,1,8,8,1,1,8,1,1,1,1,8,1,1,8,8,8,8,1,1

            ],[
                1,1,8,1,1,1,1,1,1,1,8,1,1,1,1,1,8,8,8,1,1,1,1,1,1,8,1,1,1,1,1,1,8,8,8,1,1,1,1,1,1,8,1,1,1,1,8,1,1,1,1,1,8,1,1,1,1,1,1,8,1,1,1,1,8,8,1,8,1,1,1,8,1,1,1,1,1,1,1,1,8,1,1,1,1,1,8,1,1,1,1,1,8,8,1,1,1,1,8,1,1,1,1,1,8,1,1,1,1,1,1,8,1,1,1,1,1,1,1,8,1,1,1,1,1,1,8,1,1,1,1,1,8,1,1,1,1,1,1,1,8,8,1,8,1,1,1,1,1,8,1,1,1,1,8,8,1,1,1,1,1,1,8,8,8,1,1,1,1,8,8,1,1,1,1,1,8,1,1,1,1,1,1,1,8,8,8,1,1,1
            ]
        ]
    }
    let symbols: number[] = [];
    const SYMBOLS = isFs ? REELS.FREESPIN : REELS.NORMAL;
    for (let ind = 0; ind < 3; ind++) {
        const reelRand = Math.floor( isaac.random()*SYMBOLS[ind].length );
        for( let j=0; j<4; j++ ) {
            symbols.push( SYMBOLS[ind][ (reelRand+j)%SYMBOLS[ind].length ] );
        }
    }
    symbols[ 3 ] = symbols[ 11 ] = 99;

    if( 
        !isFs &&
        symbols.filter( (item) => item === money ).length >= 1
    ) {
        const rabbitRand = isaac.random();
        const isRabbit = rabbitRand < 0.09 ;
        if( isRabbit ) {
            const repSymbols = symbols.map(num => (num === 8 || num === 99) ? num : 1);
            // console.log(`rabbitRand=${rabbitRand}, repSymbols=${repSymbols}`);
            return repSymbols;
        }
        return symbols;
    } else {
        return symbols;
    }
}

export const checkScoreLine = ( params: PGScoreProps ) => {
    const payArr : any[] = [];
    let minKey = 0;
    let maxKey = 7;
    let twoSymbol = 100;

    for( let i=1; i<=Object.keys( PAYLINESBYGAME[ params.gameCode ] ).length; i++ ){
        let isWin = false;
        const payVal:any = {
            symbol: 0,
            profit: 0,
            line : 0,
            sameCount: 1
        };
        const payLine = PAYLINESBYGAME[params.gameCode][i];
        const keySymbol = params.symbols[payLine[0]];
        if( keySymbol >= minKey && keySymbol <= maxKey ) {
            payVal.symbol = keySymbol;
            payVal.line = i;
            for(let j = 1; j < payLine.length; j++) {
                if( payVal.symbol === params.wild ) {
                    for( let i=1; i<payLine.length;i++ ) {
                        if( 
                            params.symbols[payLine[i]] > 1 && 
                            params.symbols[payLine[i]] <= maxKey && 
                            params.symbols[payLine[i]] !== params.wild 
                        ){
                            payVal.symbol = params.symbols[payLine[i]];
                            break;
                        }
                    }
                }
                if( payVal.symbol === params.symbols[ payLine[j] ] 
                    || params.symbols[ payLine[j] ] === params.wild 
                ) {
                    payVal.sameCount++;
                } else {
                    break;
                }
            }
            if(payVal.sameCount === 2 && payVal.symbol === twoSymbol) {
                isWin = true;
            } else if(payVal.sameCount > 2) {
                if( payVal.symbol > 1 ) { 
                    isWin = true;
                    payVal.profit = PAYTABLESBYGAME[ params.gameCode ][ payVal.symbol ][ 3-payVal.sameCount ] * params.stake / 10;
                }
            }

            if(isWin) payArr.push( payVal );
        }
    }
    return payArr || [] ;
}

export function getPrizeInfo( symbols: number[], stake: number ) {
    const prizes: number[] = [];
    let cptw = 0;
    let id = 0;
    for (let ind = 0; ind < symbols.length; ind++) {
        if( symbols[ind]===money ) {
            const prize = getIdxByRand( GAMECODE, "prize" );
            prizes.push( prize );
            cptw = Math.round( cptw*100 + prize*100 ) / 100;
            id++;
        }
    }
    cptw = id<5 ? 0 : cptw*stake;
    return { prizes, cptw };
}

const getCPF = ( stake: number, symbols: number[], prizes:number[] ) => {
    const cpfs: { [key: number]: cpf } = {};
    let key = 1;
    let idx = 0;
    for (let ind = 0; ind < symbols.length; ind++) {
        if( symbols[ind]===money ) {
            cpfs[key] = { p: idx, bv: stake*prizes[key-1], m: prizes[key-1] };
            key++;
        }
        idx++;
    }
    return cpfs;
}

const generateFs = ( fsCnt:number, fsProfit:number ) => {
    const fs: fs = {
        aw: fsProfit,
        s: 8-fsCnt,
        ts: 8
    }
    return fs;
}

const generateFstc = ( fsCnt:number ) => {
    const fstc = { 2 : fsCnt-1 };
    return fstc;
}

export const generateSpinResponse = ( params: IPGSpinParamType ) => {
    const cpfs = getCPF( params.stake, params.symbols, params.prizes );
    const wpParams : IPGwinning = {
        scoreInfo: params.scoreInfo,
        stake: params.stake,
        gameCode: GAMECODE
    }
    const { wpInfo, lwInfo, rwspInfo } = generatePGWinningInfo( wpParams );
    const moneyWin = params.cptw > 0; 
    let profit = params.ctw + params.cptw;
    let fs: any = null;
    let fstc: any = null;
    let iff = false;
    let ge = 1, st = 1, tb=params.stake, nst = params.isFs ? 2 : 1;
    let gwt = params.cptw > 0 ? 3 : -1;
    let cwc = profit > 0 ? 1 : 0;
    let bl = 0;
    let blb = params.balance;
    let blab = params.balance;

    if( params.isFs ) {
        profit = params.fsProfit;
        fs = generateFs( params.fsCnt, params.fsProfit );
        iff = true;
        ge = moneyWin ? 3 : 2;
        if( params.fsCnt > 1 ) {
            tb = 0;
            fstc = generateFstc( params.fsCnt );
            st = 2;
            if( params.fsCnt===8 ) {
                iff = false;
                nst = 1;
            }
            bl = params.balance + params.fsProfit;
            blab = blb = bl - params.spinProfit;
        } else {
            blb = params.balance;
            blab = Math.round( params.balance*100 - params.stake*100 ) / 100;
            bl = Math.round( blab*100 + params.fsProfit*100 ) / 100;
        }
    } else {
        blb = params.balance;
        blab = Math.round( params.balance*100 - params.stake*100 ) / 100;
        bl = Math.round( blab*100 + params.fsProfit*100 ) / 100;
    }
    const spinResponse = {
        wp: wpInfo,
        lw: lwInfo,
        orl: params.symbols,
        ift: false,
        iff: iff,
        cpf: cpfs,
        cptw: params.cptw,
        crtw: 0,
        imw: false,
        fs: fs,
        gwt: gwt,
        pmt: null,
        ab: null,
        ml: Number(params.actionData.ml),
        cs: Number(params.actionData.cs),
        rl: params.symbols,
        ctw: params.spinProfit,
        cwc: cwc,
        fstc: fstc,
        pcwc: params.ctw>0? 1 : 0,
        rwsp: rwspInfo,
        hashr: "0:8;6;3#8;2;7#8;2;0#99;3;99#MV#6.0#MT#1#MG#0#",
        fb: null,
        sid: params.nextId,
        psid: params.nextId,
        st: st,
        nst: nst,
        pf: Number(params.actionData.pf),
        aw: profit,
        wid: 0,
        wt: "C",
        wk: params.actionData.wk,
        wbn: null,
        wfg: null,
        blb: blb,
        blab: blab,
        bl: bl,
        tb: tb,
        tbb: params.stake,
        tw: params.spinProfit,
        np: Math.round( params.spinProfit*100-tb*100 )/100,
        ocr: null,
        mr: null,
        ge: [ ge, 11 ]
    };

    return spinResponse;
}