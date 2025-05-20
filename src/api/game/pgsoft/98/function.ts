import isaac from 'isaac';
import * as GlobalFunctions from '@/api/utill/functions';

const REEL: { [key: string] : {[key: number]: Array<number[]>} } = {
    NORMAL: {
        1: [
            [6,6,6,5,5,7,7,4,2,2,7,3,5,6,7,5,4,2,3,5,6,2,7,6,4,7,6,3,7,4,6,2,7,6,2,5,2,4,4,6,7,6,6,2,7,7,4,2,4,4,6,3,2,4,7,4,0,4,4,0,4,4,7,0,0,2,4,5,3,7,4,7,6,6,6,5,6,6,2,2],
            [7,6,7,5,6,6,7,5,5,3,3,3,3,7,7,7,7,6,6,7,5,5,5,6,5,7,6,7,7,6,5,6,5,0,4,4,4,4,6,6,6,0,6,7,5,5,5,5,6,7,6,6,3,3,3,7,7,7,5,6,2,2,2,6,7,6,6,6,6,4,4,4,5,7,5,5,2,7,6,5,7,4,4,4,4,5,5,5,7,6,5,5,5,3,2,2,3,5],
            [2,6,4,5,5,0,3,6,4,3,5,5,5,5,5,4,3,2,5,6,3,5,5,2,7,2,5,5,6,5,0,0,0,3,4,6,6,4,0,2,2,7,4,4,5,6,5,5,5,4,3,3,2,3,5,5,5,4,2,5,3,2,3,7,7,7,5,6,4,3,7,0,0,6,2,6,5,6,6,4,5,3,3,6,6,4,7,0,0,7,2,6,5,6,4,2,2,6,6]
        ],
        2: [
            [6,6,6,5,5,7,7,4,2,2,7,3,5,6,7,5,4,2,3,5,6,2,7,6,4,7,6,3,7,4,6,2,7,6,2,5,2,4,4,6,7,6,6,2,7,7,4,2,4,4,6,3,2,4,7,4,0,4,4,0,4,4,7,0,0,2,4,5,3,7,4,7,6,6,6,5,6,6,5,2],
            [7,6,7,5,6,6,7,5,5,3,3,3,3,7,7,7,7,6,6,7,5,5,5,6,5,7,6,7,7,6,5,6,5,0,4,4,4,4,6,6,6,0,6,7,5,5,5,5,6,7,6,6,5,3,3,7,7,7,5,6,2,2,2,6,7,6,6,6,6,4,4,4,5,7,5,5,2,7,6,5,7,4,4,4,4,5,5,5,7,6,5,5,5,3,2,2,3,5],
            [2,6,4,5,5,0,3,6,4,3,5,5,5,5,5,4,3,2,5,6,3,5,5,2,7,2,5,5,6,5,0,0,0,3,4,6,6,4,0,2,2,7,4,4,5,6,5,5,5,4,3,3,2,3,5,5,5,4,2,5,3,2,3,7,7,7,5,6,4,3,7,0,0,6,2,6,5,6,6,4,2,3,3,6,6,4,7,0,0,7,2,6,5,6,4,6,2,6,6]
        ],
        3: [
            [6,6,6,5,5,7,7,4,2,2,7,3,5,6,7,5,4,2,3,5,6,2,7,6,4,7,6,3,7,4,6,5,7,6,2,5,2,4,4,6,7,6,6,2,7,7,4,2,4,4,6,3,2,4,7,4,0,4,4,0,4,4,7,0,0,2,4,5,3,7,4,7,6,6,6,5,6,6,2,2],
            [7,6,7,5,6,6,7,5,5,3,3,3,3,7,7,7,7,6,6,7,5,5,5,6,5,7,6,7,7,6,5,6,5,0,4,4,4,4,6,6,6,0,6,7,5,5,5,5,6,7,6,6,3,3,3,7,7,7,5,6,2,2,2,6,7,6,6,6,6,4,4,4,5,7,5,5,2,7,6,5,7,4,4,4,4,5,5,5,7,6,5,5,5,3,2,2,3,3],
            [2,6,4,5,5,0,3,6,4,3,5,5,5,5,5,4,3,2,5,6,3,5,5,4,7,3,5,5,6,5,0,0,0,3,4,6,6,4,0,2,2,7,4,4,5,6,5,5,5,4,3,3,2,3,5,5,5,4,2,5,3,5,3,7,7,7,5,6,4,3,7,0,0,6,2,6,5,6,6,4,5,3,3,6,6,4,7,0,0,7,2,6,5,6,4,2,2,6,6]
        ],
    },
    FREESPIN: {
        1: [
            [6,6,3,3,2,2,2,7,7,7,7,3,3,3,3,5,5,5,5,4,4,4,4,5,5,7,7,7,6,6,6,6,3,5,5,5,0,0,0,0,4,4,2,7,7,7,4,2,2,6,6,6],
            [5,5,5,5,3,3,3,5,6,3,3,3,2,2,6,6,6,6,6,6,7,7,4,4,7,7,7,7,4,4,4,4,4,4,2,2,2,6,6,6,0,0,0,0,5,5,7,7,4,4,4,2,4,2,2,2,7,4,4,4,3,3,5,5,6,6,6,3,3,2,2,2,2],
            [6,6,3,3,2,2,2,2,0,0,0,0,7,7,7,7,3,3,3,3,5,5,5,5,4,4,4,4,5,7,7,7,6,6,6,6,3,5,5,5,4,4,2,2,7,7,4,4,2,6,6,6]
        ],
        2: [
            [6,6,3,3,2,2,2,7,7,7,7,3,3,3,3,5,5,5,5,4,4,4,4,5,5,7,7,7,6,6,6,6,3,5,5,5,0,0,0,0,4,4,2,7,7,7,4,2,2,6,6,6],
            [5,5,5,5,3,3,3,5,6,3,3,3,2,2,6,6,6,6,6,6,7,7,4,4,7,7,7,7,4,4,4,4,4,4,2,2,2,6,6,6,0,0,0,0,5,5,7,7,4,4,4,2,4,2,2,2,7,4,4,4,3,3,5,5,6,6,6,3,3,2,2,2,2],
            [6,6,3,3,2,2,2,2,0,0,0,0,7,7,7,7,3,3,3,3,5,5,5,5,4,4,4,4,5,7,7,7,6,6,6,6,3,5,5,5,4,4,2,2,7,7,4,4,2,6,6,6]
        ],
        3: [
            [6,6,3,3,2,2,2,7,7,7,7,3,3,3,3,5,5,5,5,4,4,4,4,5,5,7,7,7,6,6,6,6,3,5,5,5,0,0,0,0,4,4,2,7,7,7,4,2,2,6,6,6],
            [5,5,5,5,3,3,3,5,6,3,3,3,2,2,6,6,6,6,6,6,7,7,4,4,7,7,7,7,4,4,4,4,4,4,2,2,2,6,6,6,0,0,0,0,5,5,7,7,4,4,4,2,4,2,2,2,7,4,4,4,3,3,5,5,6,6,6,3,3,2,2,2,2],
            [6,6,3,3,2,2,2,2,0,0,0,0,7,7,7,7,3,3,3,3,5,5,5,5,4,4,4,4,5,7,7,7,6,6,6,6,3,5,5,5,4,4,2,2,7,7,4,4,2,6,6,6]
        ],
    }
}

const PAYLINES = [[0,4,8], [0,5,8], [0,5,9], [1,5,8], [1,5,9], [1,6,9], [1,6,10], [2,6,9], [2,6,10], [2,7,10]];
const PAYTABLES: { [key: number]: number } = { 0: 200, 2: 100, 3: 50, 4: 20, 5: 10, 6: 5, 7: 3 };

export const getGameInfo = ( rtp:number, isOxFeature:boolean, betAmount: number ) => {
    let symbols: number[] = [];
    let isOHFeature = false;

    const SYMBOLS = isOxFeature ? REEL.FREESPIN[rtp] : REEL.NORMAL[rtp];
    for (let i = 0; i < 3; i++) {
        const reelLength = SYMBOLS[i].length;
        const idx = Math.floor(isaac.random() * (reelLength - 1));
        for (let j = 0; j < 4; j++) {
            symbols[4 * i + j] = SYMBOLS[i][(idx + j) % (reelLength - 1)];
        }
    }

    symbols[3] = symbols[11] = 99;
    if (symbols[0] === symbols[8] && symbols[1] === symbols[9] && symbols[2] === symbols[10]) isOHFeature = true;
    
    const scoreInfo = checkPayLinesAndCalcBenefits(symbols, betAmount);

    return {
        symbols: symbols,
        scoreInfo: scoreInfo,
        isOxFeature: isOHFeature
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
    let multiplierFlag = false;

    const thousandFlag = symArr.filter(x => x === 0).length === 9 ? true : false;
    [0,2,3,4,5,6,7].forEach(v => symArr.filter(num => num === v).length === 10 && (multiplierFlag = true));

    if (thousandFlag) {
        nullFlag = false;
        PAYLINES.forEach((indices, no) => {
            winPositions[no + 1] = PAYLINES[no];
            lineWinBenefits[no + 1] = 2000 * betAmount;
            totalWin = totalWin + 2000 * betAmount;
            reelWinSpin[no + 1] = 2000;
        });        
    } else {
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
        if (!thousandFlag && multiplierFlag) totalWin = 10 * totalWin;
    }

    return {
        totalWin: totalWin,
        multiplierFlag: multiplierFlag,
        wpInfo: nullFlag ? null : winPositions,
        lwInfo: nullFlag ? null : lineWinBenefits,
        rwspInfo: nullFlag ? null : reelWinSpin
    }
}

export const generateSpinResponse = ( spinParams:any ) => {
    const now = GlobalFunctions.getCurrentTime();
    const betMoney = Math.floor(100 * Number(spinParams.betCoin)) / 10
    const gameInfo = spinParams.gameInfo;
    let rcVal = 0;
    let geVal = 1;
    let stVal = 1;
    let cwsVal = 0;
    let pcwcVal = 0;
    let fstc = null;
    let fsVal = false;
    let rtfVal = false;
    let itwFlag = true;
    let tbVal = betMoney;
    let nstVal = spinParams.isFWS ? 4 : 1;
    if (spinParams.fwsCnt > 0) {    
        tbVal = 0; 
        stVal = 4;
        geVal = 2;
        cwsVal = 1;
        itwFlag = false; 
        pcwcVal = cwsVal;  
        rcVal = spinParams.fwsCnt;
        fstc = { "4": spinParams.fwsCnt };
        if (spinParams.spinCycleWin > 0) {
            nstVal = 1;
            geVal = 1; 
            pcwcVal = 0;
        }
    }
    let symbols = gameInfo.symbols.slice() as number[];
    let count: {[key: number]: number} = {};
    let count1: {[key: number]: number} = {};
    let index = symbols.findIndex(x => x !== 0 && x <= 7);
    [0,1,2,4,5,6,7].forEach(v => {
        if (symbols[v] === 0 && index !== -1) symbols[v] = symbols[index];
        count[symbols[v]] = (count[symbols[v]] || 0) + 1;
    }); 
    [0,1,2,8,9,10].forEach(v => count1[symbols[v]] = (count1[symbols[v]] || 0) + 1);   
    if (Object.keys(count).length === 1 || Object.keys(count1).length === 1) fsVal = true;
    if (rcVal === 0 && !gameInfo.isOHFeature && rcVal === 0 && !gameInfo.scoreInfo.multiplierFlag && itwFlag) rtfVal = true;

    const spin = {
        "dt": {
            "si": {
                "wp": gameInfo.scoreInfo.wpInfo,
                "lw": gameInfo.scoreInfo.lwInfo,
                "rf": gameInfo.isOHFeature,
                "rtf": rtfVal,
                "fs": fsVal,
                "rc": rcVal,
                "im": gameInfo.scoreInfo.multiplierFlag,
                "itw": itwFlag,
                "wc": 0,//
                "gwt": -1,//
                "fb": null,
                "ctw": spinParams.spinCycleWin,
                "pmt": null,
                "cwc": cwsVal,
                "fstc": fstc,
                "pcwc": pcwcVal,
                "rwsp": gameInfo.scoreInfo.rwspInfo,
                "ml": spinParams.ml,
                "cs": spinParams.coin,
                "rl": gameInfo.symbols,
                "st": stVal,
                "nst": nstVal,
                "pf": spinParams.pf,
                "aw": spinParams.spinCycleWin,
                "wid": 0,
                "wt": "C",
                "wk": "0_C",
                "wbn": null,
                "wfg": null,
                "tb": tbVal,
                "tbb": betMoney,
                "tw": spinParams.spinCycleWin,
                "np": Math.round(100 * spinParams.spinCycleWin - 100 * tbVal) / 100,
                "ocr": null,
                "mr": null,
                "ge": [
                    geVal,
                    11
                ],
                "psid": (now * 100).toString(),
                "sid": (now * 100).toString(),
                "blb": Math.round(100 * spinParams.balance + 100 * tbVal) / 100,
                "blab": spinParams.balance,
                "bl": Math.round(100 * spinParams.balance + 100 * spinParams.spinCycleWin) / 100
            }
        },
        "err": null
    }

    return spin;
}