export const getSymbols = (  ) => {
    let symbols = [ 2, 0, 1, 2, 0, 6, 3, 0, 2 ];
    return symbols;
}

export const generateSpinResponse = ( params:any ) => {
    const resp = {
        wp: null,
        lw: null,
        twbm: 0,
        fs: null,
        imw: false,
        rv: [
            0.25,
            0,
            0.05,
            2,
            0,
            15,
            0.5,
            0,
            0.25
        ],
        orl: null,
        orv: null,
        rsrl: null,
        rsrv: null,
        nfp: null,
        gwt: -1,
        ctw: 0,
        pmt: null,
        cwc: 0,
        fstc: null,
        pcwc: 0,
        rwsp: null,
        hashr: null,
        fb: null,
        ab: null,
        ml: 1,
        cs: 0.05,
        rl: params.symbols,
        sid: "1923082602965763072",
        psid: "1923082602965763072",
        st: 1,
        nst: 1,
        pf: 1,
        aw: 0,
        wid: 0,
        wt: "C",
        wk: "0_C",
        wbn: null,
        wfg: null,
        blb: 18.12,
        blab: 17.62,
        bl: 17.62,
        tb: 0.5,
        tbb: 0.5,
        tw: 0,
        np: -0.5,
        ocr: null,
        mr: null,
        ge: [
            1, 11
        ]
    }
    return resp
}