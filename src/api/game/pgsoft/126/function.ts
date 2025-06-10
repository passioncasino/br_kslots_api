import isaac from 'isaac';
import * as GlobalConstants from '@/api/utill/constants';
const GAMECODE = "126";

export const getSymbolInfo = (rtp: number, isFWS: boolean, fws: number, fwsSymbols: number[]) => {
    const symbolDis: {
        [key: number]: number
    } = {
        0: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
    }
    const SYMBOLS: number[][] = [
        [4, 6, 7, 4, 6, 7, 6, 7, 6, 5, 7, 6, 5, 2, 6, 5, 2, 6, 7, 0, 5, 6, 7, 6, 5, 3, 2, 7, 6, 5, 6, 4, 6, 7, 7, 5, 6, 2, 4, 6, 5, 7, 6, 5, 6, 7, 6, 4, 2, 7, 3, 7, 6, 2, 3, 4, 6, 7, 0, 6, 2, 5, 6, 7, 3, 5, 5, 7, 0, 6, 7, 3, 6, 5, 7, 5, 6, 7, 2, 7, 5, 6, 5, 4, 7, 5, 6, 3, 6, 4, 2, 6, 7, 6, 5, 3, 6, 7, 5, 6, 5, 2, 7, 3, 6, 5, 5, 3, 3, 6, 7, 7, 7, 4, 3, 2, 7, 4, 7, 6, 6, 3, 7, 6, 3, 2, 5, 4, 4, 6, 7, 3, 5, 7, 2, 6, 4, 6, 7, 5, 2, 6, 4, 2, 5, 7, 6, 5],
        [3, 7, 6, 3, 7, 3, 4, 6, 7, 5, 3, 7, 5, 2, 5, 6, 5, 7, 7, 4, 4, 5, 7, 5, 6, 3, 2, 4, 5, 7, 5, 7, 2, 5, 3, 7, 3, 3, 4, 5, 7, 2, 3, 4, 2, 7, 6, 3, 7, 0, 6, 5, 2, 3, 7, 7, 0, 5, 6, 4, 5, 7, 5, 6, 7, 2, 0, 2, 6, 2, 4, 6, 3, 3, 2, 7, 2, 7, 3, 7, 6, 7, 6, 5, 5, 6, 5, 6, 3, 7, 7, 6, 7, 4, 6, 7, 0, 2, 0, 4, 7, 5, 7, 5, 7, 3, 4, 7, 5, 5, 7, 2, 6, 7, 6, 4, 6, 5, 7, 0, 5, 7, 6, 6, 5, 7, 5, 5, 3, 3, 7, 2, 6, 7, 0, 3, 0, 7, 7, 0, 5, 2, 7, 6, 4, 7, 2, 0],
        [6, 5, 7, 4, 6, 7, 6, 6, 4, 7, 0, 4, 6, 7, 6, 7, 6, 6, 7, 3, 4, 5, 5, 7, 6, 0, 7, 4, 6, 3, 7, 6, 2, 2, 6, 2, 5, 7, 6, 3, 5, 7, 7, 5, 4, 5, 6, 2, 4, 2, 6, 3, 7, 6, 0, 5, 2, 2, 7, 0, 6, 5, 3, 3, 6, 5, 4, 4, 4, 6, 5, 7, 7, 6, 6, 6, 4, 7, 7, 5, 5, 7, 3, 0, 5, 7, 3, 7, 4, 5, 3, 3, 3, 6, 0, 5, 5, 6, 0, 3, 7, 7, 6, 5, 2, 3, 3, 7, 5, 4, 4, 5, 4, 7, 2, 4, 7, 4, 7, 4, 7, 7, 2, 6, 2, 6, 2, 4, 7, 6, 7, 4, 3, 5, 6, 3, 6, 5, 4, 2, 7, 7, 6, 7, 4, 7, 5, 6]
    ]
    let symbols: number[] = [];

    if (isFWS) {
        symbols = Array(9).fill(-1);
        fwsSymbols.forEach((symbol, idx) => {
            if (symbol === fws) symbols[idx] = fws;
        })

        const maxRand = isaac.random();

        let max = 1;
        if (maxRand > 0.85) max = 2;
        else if (maxRand < 0.3) max = 0;

        for (let i = 0; i < max; i++) {
            const noFwsIdx = symbols
                .map((item, idx) => ({
                    val: item,
                    ind: idx
                }))
                .filter(item => item.val !== fws)
                .map(item => item.ind);

            symbols[noFwsIdx[Math.floor(noFwsIdx.length * isaac.random())]] = fws;
        }
    } else {
        for (let i = 0; i < 3; i++) {
            const reelLength = SYMBOLS[i].length;
            const idx2 = Math.floor(isaac.random() * reelLength);
            for (let j = 0; j < 3; j++) {
                symbols[ 3*i+j ] = SYMBOLS[i][(idx2 + j) % reelLength];
            }
        }
    }

    symbols.forEach((symbol) => {
        symbolDis[symbol]++;
    })

    const fwsResult = Object.entries(symbolDis).filter(([key, value]) => value >= 5);

    return {
        symbols: symbols,
        symbolDis: symbolDis,
        fwsResult: fwsResult,
    }
}

const generateScoreInfoStr = (scoreInfo: any[], benefits: number[]) => {
    const wpInfo: any = {};
    const lwInfo: any = {};
    const rwspInfo: any = {};
    let nullFlag = true;

    if (scoreInfo.length > 0) {
        nullFlag = false;
        scoreInfo.forEach((scoreItem: any, idx: number) => {
            const line = (scoreItem.line).toString();
            wpInfo[line] = GlobalConstants.PAYLINESBYGAME[GAMECODE][scoreItem.line];
            lwInfo[line] = benefits[idx];
            rwspInfo[line] = GlobalConstants.PAYTABLESBYGAME[GAMECODE][scoreItem.symbol][0];
        })
    }

    return {
        wpInfo: nullFlag ? null : wpInfo,
        lwInfo: nullFlag ? null : lwInfo,
        rwspInfo: nullFlag ? null : rwspInfo,
    }
}

export const generateSpinResponse = (spinParams: any) => {
    const betMoney = Math.round(spinParams.betCoin * 100) / 20;
    let itwFlag = true;
    let irsFlag = false;
    let stVal = 1;
    let cwsVal = 0;
    let nstVal = spinParams.isFWS ? 4 : 1;
    let tbVal = betMoney;
    let fstc = null;
    if (spinParams.fwsCnt >= 0) {
        if (!spinParams.newFwsFlag) irsFlag = true;
        if (spinParams.fwsCnt > 0) {
            itwFlag = false;
            stVal = 4;
            tbVal = 0;
            cwsVal = 1;
            fstc = {
                4: spinParams.fwsCnt
            };
        }
    }

    const scoreInfo = generateScoreInfoStr(spinParams.scoreInfo, spinParams.benefits);

    const spin = {
        wc: 17,
        ist: false,
        itw: itwFlag,
        fws: spinParams.fwsVal,
        wp: scoreInfo.wpInfo,
        orl: spinParams.fwsCnt > 0 ? null : spinParams.symbols,
        lw: scoreInfo.lwInfo,
        irs: irsFlag,
        gwt: -1,
        fb: null,
        ctw: Math.round(((spinParams.spinProfit * 5) / 8) * 100) / 100,
        pmt: null,
        cwc: cwsVal,
        fstc: fstc,
        pcwc: cwsVal,
        rwsp: scoreInfo.rwspInfo,
        ml: spinParams.ml,
        cs: spinParams.coin,
        rl: spinParams.symbols,
        st: stVal,
        nst: nstVal,
        pf: spinParams.pf,
        aw: spinParams.spinProfit,
        wid: 0,
        wt: "C",
        wk: spinParams.wk,
        wbn: null,
        wfg: null,
        tb: tbVal,
        tbb: betMoney,
        tw: spinParams.spinProfit,
        np: Math.round(spinParams.spinProfit * 100 - tbVal * 100) / 100,
        ocr: null,
        mr: null,
        ge: [nstVal, 11],
        psid: spinParams.nextId,
        sid: spinParams.nextId,
        blb: Math.round( spinParams.balance*100 + tbVal*100 ) / 100,
        // blab: spinParams.fwsCnt === 0 ? spinParams.balance : Math.round( spinParams.balance*100 + tbVal*100 ) / 100,
        blab: spinParams.balance,
        bl: Math.round( spinParams.balance*100 + spinParams.spinProfit*100 ) / 100
    }
    return spin;
}

/*
{
    "dt": null,
    "err": {
        "cd": "1700",
        "msg": "OERR: Operator return an error. Failed to verify operator player session",
        "tid": "ENZPNN20"
    }
}
*/