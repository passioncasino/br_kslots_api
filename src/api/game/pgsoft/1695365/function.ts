import isaac from 'isaac';
import * as GlobalFunctions from '@/api/utill/functions';

const PAYLINES = [[1, 4, 7], [0, 3, 6], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

export const getGameInfo = ( rtp:number, isDragonFeature:boolean, betAmount: number, isSureWin: any ) => {
    let symbols: number[] = [];
    let SYMBOLS: number[][] =[];
    
    const REEL: { [key: string] : {[key: number]: Array<number[]>} } = {
        NORMAL: {
            1: [
                [5,6,6,4,5,4,5,5,7,4,5,4,5,6,6,4,7,6,4,7,7,5,7,4,3,3,6,4,4,6,6,3,5,5,5,4,7,5,4,6,5,7,6,3,6,6,0,6,7,5,6,5,4,4,6,4,6,7,6,6,6,5,7,4,7,5,3,6,4,5,7,6,6,7,6,2,2,7,6,6,6,5,4,5,6,4,7,0,4,5,6,7,5,5,2,2,5,6],
                [6,3,6,4,5,3,5,5,6,2,6,3,3,6,2,2,4,0,0,0,0,3,5,4,6,6,4,6,7,3,5,7,4,6,6,7,4,3,5,4,5,3,5,5,7,3,5,2,7,5,4,6,4,5,6,7,6,4,6,0,0,7,5,2,5,7,6,6,5,7,5,2,0,0,6,5,6,7,2,5,2,6,4,6,7,7,4,6,4,4,6,4],
                [3,6,4,5,5,0,3,6,4,3,5,4,3,2,5,6,3,5,5,2,7,2,5,5,6,0,0,0,0,3,4,6,6,4,0,2,2,2,2,2,5,6,5,5,5,4,3,3,2,3,5,5,5,4,2,5,3,2,3,7,7,7,5,6,4,3,7,0,0,6,5,6,5,6,6,4,5,3,3,6,6,4,7,0,0,7,2,6,5,6,4,6,2,6,6]
            ],
            2: [
                [5,6,6,4,5,4,5,5,7,4,5,4,5,6,6,4,7,6,4,7,7,5,7,4,3,3,6,4,4,6,6,3,5,5,5,4,7,5,4,6,5,7,6,3,6,6,0,6,7,5,6,5,4,4,6,4,6,7,6,6,6,5,7,4,7,5,3,6,4,5,7,6,6,7,6,2,2,7,6,6,6,5,4,5,6,4,7,0,4,5,6,7,5,5,2,2,5,6],
                [6,3,6,4,5,3,5,5,6,2,6,3,3,6,2,2,4,0,0,0,0,3,5,4,6,6,4,6,7,3,5,7,4,6,6,7,4,3,5,4,5,3,5,5,7,3,5,2,7,5,7,6,4,5,6,7,6,4,6,2,0,7,5,2,5,7,6,6,5,7,5,2,0,0,6,5,6,7,2,5,2,6,4,6,7,7,4,6,4,4,6,4],
                [3,6,4,5,5,0,3,6,4,3,5,4,3,2,5,6,3,5,5,2,7,2,5,5,6,0,0,0,0,3,4,6,6,4,0,2,2,2,2,2,5,6,5,5,5,4,3,3,2,3,5,5,5,4,2,5,3,2,3,7,7,7,5,6,4,3,7,0,0,6,5,6,5,6,6,4,5,3,3,6,6,4,7,0,0,7,2,6,5,6,4,6,2,6,6]
            ],
            3: [
                [5,6,6,4,5,4,5,5,7,4,5,4,5,6,6,4,7,6,4,7,7,5,7,4,3,3,6,4,4,6,6,3,5,5,5,4,7,5,4,6,5,7,6,3,6,6,0,6,7,5,6,5,4,4,6,4,6,7,6,6,6,5,7,4,7,5,3,6,4,5,7,6,6,7,6,2,2,7,6,6,6,5,4,5,6,4,7,0,4,5,6,7,5,5,2,2,5,6],
                [6,3,6,4,5,3,5,5,6,2,6,3,3,6,2,2,4,0,0,0,0,3,5,4,6,6,4,6,7,3,5,7,4,6,6,7,4,3,5,4,5,3,5,5,7,3,5,2,7,5,7,6,4,5,6,7,6,4,6,2,0,7,5,2,5,7,6,6,5,7,5,2,0,0,6,5,6,7,2,5,2,6,4,6,7,7,4,6,4,4,6,4],
                [3,6,4,5,5,0,3,6,4,3,5,4,3,2,5,6,3,5,5,2,7,2,5,5,6,5,0,0,0,3,4,6,6,4,0,2,2,2,2,2,5,6,5,5,5,4,3,3,2,3,5,5,5,4,2,5,3,2,3,7,7,7,5,6,4,3,7,0,0,6,5,6,5,6,6,4,5,3,3,6,6,4,7,0,0,7,2,6,5,6,4,6,2,6,6]
            ],
        },
        FREESPIN: {
            1: [
                [6,7,7,5,7,6,7,4,7,0,5,6,5,0,0,6,0,0,6,7,5,2,2,6,6,5,7,7,3,5,7,5,7,4,3,3,4,7,0,7,3,5,5,6,6,6,7,7,0,5,6,7,5,5,0,7,5,2,5,3,3,5,5,2,6,6,5,4,2,6,5,0,4,5,6,5,5,5,4,4,5,7,3,5,3,3,7,0,5,5,3,3,3,4,5,5,4,6,7,4,6],
                [5,7,5,6,7,3,7,2,4,6,5,2,4,3,6,6,3,5,7,7,7,5,7,7,7,5,3,5,7,6,0,3,7,6,5,3,4,3,4,7,6,7,4,2,7,2,5,0,0,7,4,7,4,5,5,7,7,6,2,6,6,4,4,6,0,0,3,6,6,5,7,6,6,7,4,6,4,4,7,4,7,6,0,0,0,3,6,6,5,0,7,6,4,5,0,4,4,2,5,4,5],
                [6,7,5,7,6,6,3,6,7,5,0,0,6,7,7,6,5,7,6,0,2,7,7,6,4,4,5,4,6,0,4,4,6,4,5,6,4,7,6,6,5,6,4,6,7,6,4,4,0,0,6,4,4,7,7,6,6,5,6,6,7,7,4,4,4,6,7,7,5,6,2,0,2,2,5,5,5,0,4,5,5,5,6,6,3,6,2,5,6,5,7,3,2,0,4,7,3,5,7,5,0]
            ],
            2: [
                [6,7,7,5,7,6,7,4,7,0,5,6,5,0,0,6,0,0,6,7,5,2,2,6,6,5,7,7,3,5,7,5,7,4,3,3,4,7,0,7,3,5,5,6,6,6,7,7,0,5,6,7,5,5,0,7,5,2,5,3,3,5,5,2,6,6,5,4,2,6,5,0,4,5,6,5,5,5,4,4,5,7,3,5,3,3,7,0,5,5,3,3,3,4,5,5,4,6,7,4,6],
                [5,7,5,6,7,3,7,2,4,6,5,2,4,3,6,6,3,5,7,7,7,5,7,7,7,5,3,5,7,6,0,3,7,6,5,3,4,3,4,7,6,7,4,2,7,2,5,0,0,7,4,7,4,5,5,7,7,6,2,6,6,4,4,6,0,0,3,6,6,5,7,6,6,7,4,6,4,4,7,4,7,6,0,0,0,3,6,6,5,0,7,6,4,5,0,4,4,2,5,4,5],
                [6,7,5,7,6,6,3,6,7,5,0,0,6,7,7,6,5,7,6,0,2,7,7,6,4,4,5,4,6,0,4,4,6,4,5,6,4,7,6,6,5,6,4,6,7,6,4,4,0,0,6,4,4,7,7,6,6,5,6,6,7,7,4,4,4,6,7,7,5,6,2,0,2,2,5,5,5,0,4,5,5,5,6,6,3,6,2,5,6,5,7,3,2,0,4,7,3,5,7,5,0]
            ],
            3: [
                [6,7,7,5,7,6,7,4,7,0,5,6,5,0,0,6,0,0,6,7,5,2,2,6,6,5,7,7,3,5,7,5,7,4,3,3,4,7,0,7,3,5,5,6,6,6,7,7,0,5,6,7,5,5,0,7,5,2,5,3,3,5,5,2,6,6,5,4,2,6,5,0,4,5,6,5,5,5,4,4,5,7,3,5,3,3,7,0,5,5,3,3,3,4,5,5,4,6,7,4,6],
                [5,7,5,6,7,3,7,2,4,6,5,2,4,3,6,6,3,5,7,7,7,5,7,7,7,5,3,5,7,6,0,3,7,6,5,3,4,3,4,7,6,7,4,2,7,2,5,0,0,7,4,7,4,5,5,7,7,6,2,6,6,4,4,6,0,0,3,6,6,5,7,6,6,7,4,6,4,4,7,4,7,6,0,0,0,3,6,6,5,0,7,6,4,5,0,4,4,2,5,4,5],
                [6,7,5,7,6,6,3,6,7,5,0,0,6,7,7,6,5,7,6,0,2,7,7,6,4,4,5,4,6,0,4,4,6,4,5,6,4,7,6,6,5,6,4,6,7,6,4,4,0,0,6,4,4,7,7,6,6,5,6,6,7,7,4,4,4,6,7,7,5,6,2,0,2,2,5,5,5,0,4,5,5,5,6,6,3,6,2,5,6,5,7,3,2,0,4,7,3,5,7,5,0]
            ],
        },
        SUREWIN: {
            1: [
                [5,2,3,6,3,5,6,5,5,6,3,5,6,6,5,3,2],
                [6,7,2,4,6,4,6,2,7,7,6,4,6,7,6,4,7],
                [7,5,7,3,5,5,7,3,7,3,5,7,7,5,3,5,7]
            ],
            2: [
                [4,6,6,4,6,4,6,3,6,4,2,3,4,6,2,6,4],
                [5,7,7,4,5,2,7,5,4,5,7,3,2,4,7,4,5],
                [6,7,3,5,5,6,7,3,7,5,7,6,3,7,7,6,7]
            ],
            3: [
                [2,7,5,7,3,7,7,2,5,3,5,7,5,3,7,5,7],
                [6,5,6,4,5,4,5,6,6,5,4,5,6,5,6,4,6],
                [2,7,4,7,3,7,4,7,3,2,4,7,3,7,4,3,4]
            ],
        }
    }
    
    if ( Number(isSureWin) === 2) {
        SYMBOLS = REEL.SUREWIN[rtp];
        if (isDragonFeature) SYMBOLS = REEL.FREESPIN[rtp];
    } else {
        if (isDragonFeature) SYMBOLS = REEL.FREESPIN[rtp];
        else SYMBOLS = REEL.NORMAL[rtp];
    }
    for (let i = 0; i < 3; i++) {
        const reelLength = SYMBOLS[i].length;
        const idx = Math.floor(isaac.random() * reelLength);
        for (let j = 0; j < 3; j++) {
            symbols[3 * i + j] = SYMBOLS[i][(idx + j) % reelLength];
        }
    }

    if (!isDragonFeature && Number(isSureWin) === 2) {
        const sureWinSymbols = getSureWinSymbols(symbols);
        symbols.length = 0;
        symbols = sureWinSymbols;
    }
    
    const mulInfo = getMultiplierInfo(isDragonFeature, isSureWin, rtp);
    const paylineInfo = checkPayLinesAndCalcBenefits(symbols, betAmount);
 
    return {
        symbols : symbols,
        mulInfo : mulInfo,
        paylineInfo : paylineInfo
    }
}

const getSureWinSymbols = (symbols: number[]) => {
    let result = symbols.slice();
    let wildSymbolFlag = false;
    let symbolForWining: number[] = [];
    let paylineForWining: number[][] = [];
    const lineCountProbability = isaac.random();
    const linCountThreshold = [0.85, 0.9, 1];
    const lineCount = linCountThreshold.findIndex(threshold => lineCountProbability <= threshold);
    
    for (let i = 0; i < lineCount + 1; i++) {
        const indexProbability = isaac.random();
        const paylineThresholds = [0.3, 0.55, 0.65, 0.8, 1];
        const indexPayline = paylineThresholds.findIndex(threshold => indexProbability <= threshold);
        paylineForWining.push(PAYLINES[indexPayline]);
        if (indexPayline === 3 || indexPayline === 4) wildSymbolFlag = true;
        if (paylineForWining.length === 1) wildSymbolFlag = false;

        const symbolProbability = isaac.random();
        const symDic = [5,4,3,7,2,6];
        const symbolThresholds = [0.4, 0.7, 0.8, 0.9, 0.95, 1];
        const symbolIndex = symbolThresholds.findIndex(threshold => symbolProbability <= threshold);
        symbolForWining.push(symDic[symbolIndex]);
    }
    paylineForWining.forEach((payline, index) => payline.forEach(v => result[v] = symbolForWining[index]));
    
    const anotherChanceForWildSymbol = isaac.random();
    if (wildSymbolFlag) result[4] = 0;
    if (anotherChanceForWildSymbol > 0.8) result[4] = 0, result[3] = 0;
    else if (anotherChanceForWildSymbol > 0.9) result[4] = 0, result[8] = 0;
    return result;
}

const getMultiplierInfo = (isDragon: boolean, isSureWin: any, rtp: number) => {
    let cnt = 2, totalMultiplier = 0;
    let target: number[] = [];
    let status: boolean[] = [];
    let indices: number[] = [];
    let expandingFlag = isaac.random() > 0.989;
    
    const mulDictionary = [2,5,10,2,5,2,2,5,2,2,5];
    const sureWinThresholds = [0.78,0.737,0.752];

    if (isDragon) cnt = isaac.random() > 0.9 ? 3 : 4, expandingFlag = false;
    else {
        const probability = isaac.random();
        if (expandingFlag) {
            if (probability < 0.6) cnt = 2;
            else if (probability < 0.7) cnt = 4;
            else if (probability < 0.8) cnt = 3;     
        } else {
            if (isSureWin) {
                if (probability > sureWinThresholds[rtp - 1]) cnt = 1;//96
                else cnt = 2;
            } else {
                if (probability > 0.98) cnt = 1;
                else cnt = 2;
            }
        }
    }
    
    for (let i = 0; i < cnt; i++) {
        const id = mulDictionary[Math.floor(10 * isaac.random())];
        target.push(id);
    }
    if (cnt === 3) {
        const limitFlag3 = (target[0] + target[1] + target[2]) > 10 ? true : false;
        if (limitFlag3) {
            const probability = isaac.random();
            if (probability < 0.8) target = [2,2,2]; 
            else if (probability < 0.82) target = [2,2,5]; 
            else if (probability < 0.84) target = [2,5,2]; 
            else if (probability < 0.86) target = [5,2,2];  
        }
    }
    if (cnt === 4) {
        const limitFlag4 = (target[1] + target[2]) > 10 ? true : false;
        if (limitFlag4) {
            const probability = isaac.random();
            if (probability < 0.5) target[1] = 2, target[2] = 2; 
            else if (probability < 0.6) target[1] = 5, target[2] = 2; 
            else if (probability < 0.7) target[1] = 2, target[2] = 5; 
            else if (probability < 0.9) target[1] = 5, target[2] = 5; 
        }
    }

    if (cnt === 1) status = [true], indices = [0], totalMultiplier = target[0];
    else if (cnt === 2) status = [false, false], totalMultiplier = 1;
    else if (cnt === 3) status = [true, true, true], indices = [0, 1, 2], totalMultiplier = target[0] + target[1] + target[2];
    else if (cnt === 4) status = [false, true, true, false], indices = [1, 2], totalMultiplier = target[1] + target[2];
  
    return {
        it : expandingFlag,
        gm : totalMultiplier,
        mf : {
            mt : target,
            ms : status,
            mi : indices
        }
    }
}

const checkPayLinesAndCalcBenefits = (symbols: number[], betAmount: number) => {
    let payInfo: number[][] = [];
    let winPositions: { [key: string]: number[] } = {};
    let lineWinBenefits: { [key: string]: number } = {};
    let reelWinSpin: { [key: string]: number } = {};
    let nullFlag = true;
    let symArr = symbols.slice();
    let totalWin = 0;
    const PAYTABLES: { [key: number]: number } = { 0: 100, 2: 50, 3: 25, 4: 10, 5: 5, 6: 3, 7: 2 };

    PAYLINES.forEach((indices, no) => {
        const row = indices.map(index => symArr[index]);
        const firstNonTwo = row.find(x => x !== 0);
        const wildFlag = row.filter(x => x === 0).length === 3 ? true : false;
        const value = wildFlag ? row : row.map(v => (v === 0 ? firstNonTwo : v)) as number[];
        const matchLength = [3].find(len => value.slice(0, len).every(v => v === value[0]));
        if (matchLength) payInfo.push([value[0], no]);
    });
 
    if (payInfo.length > 0) {
        nullFlag = false;
        payInfo.forEach(([symbol, line]) => {
            if (!PAYTABLES[symbol]) return;
            const eachBenefit = Math.round(100 * PAYTABLES[symbol] * betAmount) / 100;
            winPositions[line + 1] = PAYLINES[line];
            lineWinBenefits[line + 1] = eachBenefit;
            totalWin = totalWin + eachBenefit;
            reelWinSpin[line + 1] = PAYTABLES[symbol];
        });
    }

    return {
        totalWin: totalWin,
        wpInfo: nullFlag ? null : winPositions,
        lwInfo: nullFlag ? null : lineWinBenefits,
        rwspInfo: nullFlag ? null : reelWinSpin
    }
}

export const generateSpinResponse = ( spinParams:any ) => {
    const now = GlobalFunctions.getCurrentTime();
    const betMoney = Math.round(100 * spinParams.betCoin) / 20;
    const spinCycleWin = Math.round(100 * spinParams.spinCycleWin) / 100;
    const gameInfo = spinParams.gameInfo;
    const awVal = spinParams.isFWS ? spinParams.fsWinMoney : spinCycleWin;

    let stVal = 1;
    let geVal = 1;
    let nstVal = 1;
    let fsVal = null;
    let fstcVal = null;
    let tbVal = betMoney;
    if (spinParams.fwsCnt > 0) {
        geVal = 2;
        nstVal = 2;
        fsVal = {
            s: 8 - spinParams.fwsCnt,
            ts: 8,
            aw: awVal
        };
        if (spinParams.fwsCnt > 1) {
            tbVal = 0;
            stVal = 2;
            fstcVal = { 2: spinParams.fwsCnt - 1 };
            if (spinParams.fwsCnt === 8) nstVal = 1;
        }
    }

    const spin = {
        wp: gameInfo.paylineInfo.wpInfo,
        lw: gameInfo.paylineInfo.lwInfo,
        gm: gameInfo.mulInfo.gm,
        it: gameInfo.mulInfo.it,
        orl: gameInfo.symbols,
        fs: fsVal,
        mf: gameInfo.mulInfo.mf,
        ssaw: spinCycleWin,
        crtw: 0.0,
        imw: false,
        gwt: -1,
        fb: null,
        ctw: spinCycleWin,
        pmt: null,
        cwc: spinParams.cwcVal,
        fstc: fstcVal,
        pcwc: spinParams.cwcVal,
        rwsp: gameInfo.paylineInfo.rwspInfo,
        hashr: null,
        ml: spinParams.ml,
        cs: spinParams.coin,
        rl: gameInfo.symbols,
        st: stVal,
        nst: nstVal,
        pf: spinParams.pf,
        aw: awVal,
        wid: 0,
        wt: "C",
        wk: "0_C",
        wbn: null,
        wfg: null,
        tb: tbVal,
        tbb: betMoney,
        tw: spinCycleWin,
        np: Math.round(100 * spinCycleWin - 100 * tbVal) / 100,
        ocr: null,
        mr: null,
        ge: [geVal, 11],
        psid: (now * 100).toString(),
        sid: (now * 100).toString(),
        blb: Math.round(100 * spinParams.balance + 100 * tbVal) / 100,
        blab: spinParams.balance,
        bl: Math.round(100 * spinParams.balance + 100 * spinCycleWin) / 100
    }
    
    return spin
}
