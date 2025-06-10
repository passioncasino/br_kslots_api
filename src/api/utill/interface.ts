import { ObjectId } from "mongodb"

export interface LauncherType {
    ip : string
    game : string
    mode : string
    lang : string
    user : string,
    lobby : string
    token : string
    cashier : string
    currency : string
    rtp : number
    minBet : number
    maxBet : number
}

export interface HistoryType {
    roundid: string
    user : string
    currency : string
    stake : number
    profit : number
    balance : number
    response : object | string
    isSequence : boolean
    gameCode : string
}

export interface HistoryItemType extends HistoryType {
    response: any[],
    _id: ObjectId,
    rid: number,
    created: number
}

export interface SequenceHistoryType {
    gameCode : string
    lastId : string
    profit : number
    response : object | string
}

export interface IPayVal {
    symbol: number
    profit: number
    line : number
    sameCount: number
}
/**
 * Types for PG SOFT
 */

export interface IPGSpinParamType {
    symbols: number[]
    actionData: PGActionType
    scoreInfo: any[]
    prizes: number[]
    cptw: number
    stake: number
    ctw: number
    spinProfit: number
    nextId: string
    isFs: boolean
    fsCnt: number
    fsProfit: number
    balance: number
}

export interface PGActionType {
    cs : number
    ml : number
    pf : number
    id : string
    wk : string
    btt : number
    atk : string
    fb : number
    traceId : string
}

export interface PGScoreProps {
    gameCode : string
    symbols: number[]
    stake: number
    wild: number
}

export interface SpinType {
    ml: number
    pf: number
    wk: string
    coin: number
    spinCycleWin: number
    betCoin: number
    balance: number
    gameInfo: any
    cwcVal: number
    isFWS: boolean
    fwsCnt: number
    fsWinMoney: number
}

export interface IPGwinning {
    scoreInfo: any[]
    stake: number
    gameCode: string
}

export interface CpfType {
    [key: number]: { 
        p: number, 
        bv: number, 
        m: number
    }
}

export interface IPGv1BetItem {
    tid: string
    tba: number
    twla: number
    bl: number
    bt: number
    gd: object
}