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

export interface PGActionType {
    cs : number
    ml : number
    pf : number
    id : number
    wk : string
    btt : number
    atk : string
    fb : number
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

export interface CpfType {
    [key: number]: { 
        p: number, 
        bv: number, 
        m: number
    }
}