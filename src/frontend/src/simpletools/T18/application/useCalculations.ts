export function convertLLR(LLR: number) {
  return LLR / 10000 * 365; // convert kg/ha/d to kg/m2/y
}

export function convertQ(Q: number) {
  return Q * 1000000; // convert Mega to standard
}

export function convertC(C: number) {
  return C / 1000; // convert mg/l to kg/m3
}

function calcHLR(IR: number, AF: number) {
  return IR * AF;
}

function calcLR(HLR: number, C: number, OD: number) {
  return HLR * C * 365 / OD;
}

function calcA(C: number, Q: number, LLR: number) {
  return C * Q / LLR;
}


export function isCtoHigh(C: number, IR: number, AF: number, OD: number, LLR: number) {
  const HLR = calcHLR(IR, AF);
  const LR = calcLR(HLR, C, OD);
  return LR > LLR;
}

function calcC(C: number, IR: number, AF: number, OD: number, LLR: number) {
  if (isCtoHigh(C, IR, AF, OD, LLR)) {
    const HLR = calcHLR(IR, AF);
    return LLR * OD / HLR / 365;
  }

  return C;
}

export function calcAH(Q: number, IR: number, AF: number) {
  return calcA(
    1,
    convertQ(Q),
    calcHLR(IR, AF),
  );
}

export function calcAN(Cn: number, IR: number, AF: number, OD: number, LLRN: number, Q: number) {
  return calcA(
    calcC(
      convertC(Cn),
      IR,
      AF,
      OD,
      convertLLR(LLRN),
    ),
    convertQ(Q),
    convertLLR(LLRN),
  );
}

export function calcAO(Co: number, IR: number, AF: number, OD: number, LLRO: number, Q: number) {
  return calcA(
    calcC(
      convertC(Co),
      IR,
      AF,
      OD,
      convertLLR(LLRO),
    ),
    convertQ(Q),
    convertLLR(LLRO),
  );
}

export function calculateDiagramData(LLRN: number, LLRO: number, AF: number, Q: number, IR: number, OD: number, Cn: number, Co: number) {
  return [{
    name: 'AH',
    value: calcAH(Q, IR, AF),
    fill: '#4C4C4C',
  }, {
    name: 'AN',
    value: calcAN(Cn, IR, AF, OD, LLRN, Q),
    fill: '#1EB1ED',
  }, {
    name: 'AO',
    value: calcAO(Co, IR, AF, OD, LLRO, Q),
    fill: '#ED8D05',
  }];
}
