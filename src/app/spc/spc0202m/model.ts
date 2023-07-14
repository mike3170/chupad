export class WrkHeadDto {
  jobNo: string;
	luoCode: string;
  ctnNo: number;
  procNo: string;

  luoName: string;
  
  operator: string;

	makeWt: number;
	ctnKind: string;
	lastCtn: string;
	jobEndCode: string | boolean;

	coilNo1: string;
	coilNo2: string;
	coilNo3: string;

	endCode1: string;
	endCode2: string;
	endCode3: string;	
	webYn: string;	

	pdcSize: string;
	pdc1000Wt: number;
	mchNo: string;
	headQty: number; 
  reqQty: number;
  overRate: number;
  reqQtyUpperBound: number;
  reqQtyLowerBound: number;

  taskQty: number;
  faultWt: number;

  constructor() {
  }
}

export interface Status {
  isLastCtn: boolean,
  forceCompleted: boolean,
  canCompleted: boolean,
  notCompleted: boolean;
}

//export interface ProgressData {
//  lowerBoundQty: number;
//  reqQty: number;
//  upperBoundQty: number;
//  headQty: number;
//}

export interface ProgressData {
  lowerBoundQty: number;
  reqQty: number;
  upperBoundQty: number;
  headQty: number;
}

// object wrapper carry single value
export interface Single {
  value: number;
}

export enum CrudMode {
  Create,
  Update,
  Query,
  Normal,
};

