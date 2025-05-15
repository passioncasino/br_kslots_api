import isaac from 'isaac';
import * as GlobalFunctions from '@/api/utill/functions';
import { SpinType, CpfType } from '@/api/utill/interface';

const REEL: { [key: string] : {[key: number]: Array<number[]>} } = {
    NORMAL: {
        1: [
            [7,7,7,3,3,2,3,5,5,5,0,6,6,6,4,3,5,5,5,0,4,8,8,8,5,1,6,5,3,4,4,3,7,7,7,6,5,7,4,5,5,7,7,2,6],
            [5,7,4,5,6,5,7,7,6,5,7,4,3,5,7,5,3,6,8,8,8,6,6,5,5,6,2,2,2,2,7,6,5,7,4,7,7,7,7,6,5,7,4,3,5,7,2,3,6,5,6,3,8,6,6,6,6,5,3,0,7,4,5,5,5,5,3,4,7,4,6,5,7,6,7],
            [5,4,7,7,6,5,7,7,6,5,7,4,3,5,7,5,3,6,3,3,2,4,4,4,5,6,6,8,8,8,7,6,5,7,4,3,5,7,2,3,6,5,6,6,6,4,5,5,5,3,2,7,6,7,7,7,5,7,7,6,5,7,4,3,4,5,5,7,6,4,5,3,0,0,0]
        ],
        2: [
            [7,7,7,4,3,2,3,5,5,5,0,6,6,6,4,3,5,5,5,0,4,8,8,8,5,1,6,5,3,4,4,3,7,7,7,6,5,7,4,5,5,7,7,2,6],
            [5,7,4,5,6,5,7,7,6,5,7,4,3,5,7,5,3,6,8,8,8,6,6,5,5,6,2,2,2,2,7,6,5,7,4,7,7,7,7,6,5,7,4,3,5,7,2,3,6,5,6,3,8,6,6,6,6,5,3,0,7,4,5,5,5,5,3,4,7,4,6,5,7,6,7],
            [5,4,7,7,6,5,7,7,6,5,7,4,3,5,7,5,3,6,3,3,2,4,4,4,5,6,6,8,8,8,7,6,5,7,4,3,5,7,2,3,6,5,6,6,6,4,5,5,5,3,2,7,6,7,7,7,5,7,7,6,5,7,4,3,4,5,5,7,6,4,5,3,0,0,0]
        ],
        3: [
            [7,7,7,4,2,2,3,5,5,5,0,6,6,6,4,3,5,5,5,0,4,8,8,8,5,1,6,5,3,4,4,3,7,7,7,6,5,7,4,5,5,7,7,2,4,5],
            [5,7,4,5,6,5,7,7,6,5,7,4,3,5,7,5,3,6,8,8,8,6,6,5,5,6,2,2,2,2,7,6,5,7,4,7,7,7,7,6,5,7,4,3,5,7,2,3,6,5,6,3,8,6,6,6,6,5,3,0,7,4,5,5,5,5,3,4,7,4,6,5,7,6,7],
            [5,4,7,7,6,5,7,7,6,5,7,4,3,5,7,5,3,6,3,3,2,4,4,4,5,6,6,8,8,8,7,6,5,7,4,3,5,7,2,3,6,5,6,6,6,4,5,5,5,3,2,7,6,7,7,7,5,7,7,6,5,7,4,3,4,5,5,7,6,4,5,3,0,0,0]
        ],
    },
    FREESPIN: {
        1: [
            [1,1,8,1,1,8,1,1,1,8,8,1,1,1,8,1,8,8,1,1,8,1,1,8,1,1,8,1,1,1,8,8,1,1,1,8,8,1,1,1,8,1,1,1,1,8,8,1,1,1,8,8,1,1,1,8,1,8,8,1],
            [1,1,1,8,1,1,1,1,1,8,1,1,1,8,8,1,1,8,1,1,1,1,8,8,8,8,1,1,8,1,1,1,1,8,1,8,1,1,1,8,1,1,1,1,1,8,8,1,8,8,1,1,1,8,1,1,1,1,1,8],
            [1,1,1,1,8,8,8,1,8,1,1,1,1,1,1,8,1,1,8,1,8,8,1,1,8,1,1,8,1,1,1,8,1,1,8,1,1,8,1,1,8,1,8,1,1,1,1,8,1,1,8,1,8,1,1,8,1,1,1,8]
        ],
        2: [
            [1,1,8,1,1,8,1,1,1,8,8,1,1,1,8,1,8,8,1,1,8,1,1,8,1,1,8,1,1,1,8,8,1,1,1,8,8,1,1,1,8,1,1,1,1,8,8,1,1,1,8,8,1,1,1,8,1,8,8,1],
            [1,1,1,8,1,1,1,1,1,8,1,1,1,8,8,1,1,8,1,1,1,1,8,8,8,8,1,1,8,1,1,1,1,8,1,8,1,1,1,8,1,1,1,1,1,8,8,1,8,8,1,1,1,8,1,1,1,1,1,8],
            [1,1,1,1,8,8,8,1,8,1,1,1,1,1,1,8,1,1,8,1,8,8,1,1,8,1,1,8,1,1,1,8,1,1,8,1,1,8,1,1,8,1,8,1,1,1,1,8,1,1,8,1,8,1,1,8,1,1,1,8]
        ],
        3: [
            [1,1,8,1,1,8,1,1,1,8,8,1,1,1,8,1,8,8,1,1,8,1,1,8,1,1,8,1,1,1,8,8,1,1,1,8,8,1,1,1,8,1,1,1,1,8,8,1,1,1,8,8,1,1,1,8,1,8,8,1],
            [1,1,1,8,1,1,1,1,1,8,1,1,1,8,8,1,1,8,1,1,1,1,8,8,8,8,1,1,8,1,1,1,1,8,1,8,1,1,1,8,1,1,1,1,1,8,8,1,8,8,1,1,1,8,1,1,1,1,1,8],
            [1,1,1,1,8,8,8,1,8,1,1,1,1,1,1,8,1,1,8,1,8,8,1,1,8,1,1,8,1,1,1,8,1,1,8,1,1,8,1,1,8,1,8,1,1,1,1,8,1,1,8,1,8,1,1,8,1,1,1,8]
        ],
    }
}

const symDic = [2,3,4,5,6,7];
const prizeDictionary = [0.5, 1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 80, 90, 100, 200, 300, 400];
const PAYLINES = [[0,4,8], [0,5,8], [0,5,9], [1,5,8], [1,5,9], [1,6,9], [1,6,10], [2,6,9], [2,6,10], [2,7,10]];
const PAYTABLES: { [key: number]: number } = { 0: 200, 2: 100, 3: 50, 4: 10, 5: 5, 6: 3, 7: 2 };

export const getGameInfo = ( rtp:number, isRabbitFeature:boolean, betAmount: number ) => {
    let totalBenefits = 0;
    let prizeBenifits = 0;
    let scoreBenefits = 0;
    let symbols: number[] = [];
    let isPrizeJackpot = false;
    let isCarrotFeature = false;
    let cpfStr: CpfType = {};

    const SYMBOLS = isRabbitFeature ? REEL.FREESPIN[rtp] : REEL.NORMAL[rtp];
    for (let i = 0; i < 3; i++) {
        const reelLength = SYMBOLS[i].length;
        const idx = Math.floor(isaac.random() * reelLength);
        for (let j = 0; j < 4; j++) {
            symbols[4 * i + j] = SYMBOLS[i][(idx + j) % reelLength];
        }
    }

    const eightCount = symbols.filter(x => x === 8).length;
    const hasOne = symbols.filter(x => x === 1).length > 0 ? true : false;

    if (eightCount > 0) {
        const prizeInfo = makePrizeValue(symbols, betAmount);
        if (eightCount >= 3) {
            if (hasOne) {
                isCarrotFeature = true;
                for (let i = 0; i < symbols.length; i++) {
                    if (symbols[i] !== 8 && symbols[i] !== 1) symbols[i] = 1;
                }
            } else {
                symbols.forEach((v, i) => v === 1 && (symbols[i] = symDic[Math.floor(5 * isaac.random())]));
            }
            if (eightCount >= 5) {
                isPrizeJackpot = true;
                prizeBenifits = prizeInfo.prizeBenifits;
            }
        } else if (eightCount < 3) {
            if (hasOne) {                
                symbols.forEach((v, i) => v === 1 && (symbols[i] = symDic[Math.floor(5 * isaac.random())]));
            }
        } 
        cpfStr = prizeInfo.cpf;
    } else {
        if (hasOne) {
            symbols.forEach((v, i) => v === 1 && (symbols[i] = symDic[Math.floor(5 * isaac.random())]));
        }
    }
    symbols[3] = symbols[11] = 99;   
    
    const scoreInfo = checkPayLinesAndCalcBenefits(symbols, betAmount);
    const wpInfo = scoreInfo.wpInfo;
    const lwInfo = scoreInfo.lwInfo;
    const rwspInfo = scoreInfo.rwspInfo;
    scoreBenefits = scoreInfo.totalWin;
    totalBenefits = prizeBenifits + scoreBenefits;

    return {
        cpfStr: cpfStr,
        symbols: symbols,
        wpInfo: wpInfo,
        lwInfo: lwInfo,
        rwspInfo: rwspInfo,
        eightCount: eightCount,
        hasOne: hasOne,
        cptwBenefit: prizeBenifits,
        scoreBenefits: scoreBenefits,
        totalBenefits: totalBenefits,
        isPrizeJackpot: isPrizeJackpot,
        isRabbitFeature: isCarrotFeature
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

    PAYLINES.forEach((indices, no) => {
        const row = indices.map(index => symArr[index]);
        const firstNonTwo = row.find(x => x !== 2);
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

const makePrizeValue = (symbols: number[], betAmount: number) => {
    let cnt = 0;
    let totalBenefits = 0;
    let cpf: CpfType = {}
    symbols.forEach((v, i) => {
        if (v === 8) {
            cnt++;
            const prizeValue = prizeDictionary[Math.round(16 * isaac.random())];
            const eachBenefit = Math.round( betAmount*prizeValue*100 ) / 100;
            totalBenefits = totalBenefits + eachBenefit;
            cpf[cnt] = { p: i, bv: eachBenefit, m: prizeValue };
        }
    });
    return {
        cpf: cpf,
        prizeBenifits: totalBenefits
    }
}

export const generateSpinResponse = ( spinParams: SpinType ) => {
    const now = GlobalFunctions.getCurrentTime();
    const betMoney = Math.round(100 * spinParams.betCoin) / 10;
    const gameInfo = spinParams.gameInfo;
    const probability = isaac.random();
    const spinCycleWin = Math.round(100 * spinParams.spinCycleWin) / 100;
    const awVal = spinParams.isFWS ? spinParams.fsWinMoney : spinCycleWin;

    let stVal = 1;
    let geVal = 1;
    let nstVal = 1;
    let gwtVal = -1;
    let fsVal = null;
    let iffVal = false;
    let iftVal = false;
    let fstcVal = null;
    let tbVal = betMoney;
    if (gameInfo.wpInfo !== null) {
        if (Object.keys(gameInfo.wpInfo).length === 2) {
            gwtVal = 2;
        }
    }

    if (spinParams.fwsCnt > 0) {
        nstVal = 2;
        geVal = 2;
        iffVal = true;
        fsVal = { aw: awVal,s:8 - spinParams.fwsCnt,ts:8 };
        if (spinParams.fwsCnt > 1) {
            tbVal = 0;
            stVal = 2;
            iffVal = false;
            fstcVal = { 2: spinParams.fwsCnt - 1 };
            if (spinParams.fwsCnt === 8) {
                geVal = 1;
                nstVal = 1;
            }
        }
    }

    if (gameInfo.cptwBenefit !== 0) {
        geVal = 3;
        gwtVal = 2;
    }

    if (gameInfo.eightCount !== 0 && !gameInfo.hasOne) {
        if (probability > 0.9) iftVal = true;
    }
    if (!gameInfo.isRabbitFeature) {
        if (probability > 0.98) iftVal = true;
    }

    const spin = {
        dt: {
            si: {
                wp: spinParams.fwsCnt > 0 ? null : gameInfo.wpInfo,
                lw:  spinParams.fwsCnt > 0 ? null : gameInfo.lwInfo,
                orl: gameInfo.symbols,
                ift: iftVal,
                iff: iffVal,
                cpf: gameInfo.cpfStr,
                cptw: gameInfo.cptwBenefit,
                crtw: 0.0,
                imw: false,
                fs: fsVal,
                gwt: gwtVal,
                fb: null,
                ctw: gameInfo.totalBenefits,
                pmt: null,
                cwc: spinParams.cwcVal,
                fstc: fstcVal,
                pcwc: spinParams.cwcVal,
                rwsp: spinParams.fwsCnt > 0 ? null : gameInfo.rwspInfo,
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
        },
        err: null
    }
    
    return spin;
}