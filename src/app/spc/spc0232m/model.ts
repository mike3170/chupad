export class WrkProcDto {
	jobNo: string;
	luoCode: string;
	ctnNo: number;

	procNo: string;
	procName: string;
	nextProcNo: string;
	mchNo: string;

	luoName: string;
	operator: string;
	makeWt: number;
	netQty: number;
	ctnKind: string;
	lastCtn: string;
	jobEndCode: string | boolean;
	location: string;
	stackNotOk: string;

	webYn: string;	

	//----------------------
	pdcSize: string;
	pdc1000Wt: number;
	accNetQty: number | string;   // 輾牙累計數量

  constructor() {
  }
}

export interface Status {
  isLastCtn: boolean,
  forceCompleted: boolean,
  canCompleted: boolean,
  notCompleted: boolean;
}


export interface ProgressData {
  lowerBoundQty: number;
  baseQty: number;
  upperBoundQty: number;
  aggQty: number;
}

// object wrapper carry single value
export interface Single {
  value: number;
}