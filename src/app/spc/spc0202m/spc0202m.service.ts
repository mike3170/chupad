import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import Decimal from 'decimal.js';

import { WrkHeadDto, Status } from './model';
import { Api } from '../../core/api.model';

import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class Spc0202mService {
  private baseUrl = "/api/swhp"

  constructor(private http: HttpClient) { }

  // 新增
  create(dto: WrkHeadDto): Observable<any> {
    return this.http.post<Api>(this.baseUrl, dto);
  }

  // 刪除
  delete(dto: WrkHeadDto): Observable<any> {
    const url = `${this.baseUrl}/${dto.jobNo}/${dto.luoCode}/${dto.ctnNo}`;
    return this.http.delete<Api>(url);
  }

  // 查詢
  query(matrix: string): Observable<any> {
    const url = this.baseUrl + "/query/params" + matrix;
    return this.http.get(url);
  }

  // 讀取 spcWrkHeadPad by primary key
  getSpcWrkHeadPad(jobNo: string, luoCode: string, ctnNo: number): Observable<any> {
    const url = `${this.baseUrl}/${jobNo}/${luoCode}/${ctnNo}`;
    return this.http.get<Api>(url);
  }

  // 桶別 Pair list
  getCtnKindList(): Observable<any> {
    const url = `${this.baseUrl}/ctnKindList`;
    return this.http.get<Api>(url);
  }

  // 批號 檢查
  checkJobNo(jobNo: string): Observable<any> {
    const url = `${this.baseUrl}/check/${jobNo}`;
    return this.http.get<Api>(url);
  }

  // 線材卷號
  getHeaDrwStok(coilNo: string): Observable<any> {
    const url = `${this.baseUrl}/heaDrwStok/${coilNo}`;
    return this.http.get<Api>(url);
  }

  // 代碼  
  getCodMast(codeNo: string): Observable<any> {
    const url = `${this.baseUrl}/codMast/${codeNo}`;
    return this.http.get<Api>(url);
  }

  /**
   * 完工數量
   * ctnKind    - 桶別 
   * makeWt     - 毛重 
   * headQty    - 累積數量 
   * pdc1000Wt  - 千支重 
   */
  getTaskQty$({ ctnKind, makeWt, pdc1000Wt }): Observable<number> {
    return this.getCodMast(ctnKind)
      .pipe(
        map(api => api.data.qty),
        map(qty => {
          const ctnWt = new Decimal(qty).toNumber(); // string to number, 桶重

          const netWt = makeWt - ctnWt;  // 淨重

          const taskQty: number = Decimal.div(netWt, pdc1000Wt).toDP(3).toNumber(); // 完工數量

          //console.log("taskQty ----------------------");
          //console.log("桶重:" + ctnWt);
          //console.log("毛重:" + makeWt);
          //console.log("淨重:" + netWt);
          //console.log("千支重:" + pdc1000Wt);
          //console.log("完工數量 :" + taskQty);

          return taskQty;
        })
      );

  }

  /**
   * 查詢用
   * 累計數量 <= ctn_no 
   */
  getJobNetQty2CtnNo({ jobNo, procNo, ctnNo }): Observable<Api> {
    const url = `${this.baseUrl}/jobNetQty2CtnNo/${jobNo}/${procNo}/${ctnNo}`;
    return this.http.get<Api>(url);
  }

  /**
   * 新增用
   * 累計數量 
   */
  getJobNetQty({ jobNo, procNo }): Observable<Api> {
    const url = `${this.baseUrl}/jobNetQty/${jobNo}/${procNo}`;
    return this.http.get<Api>(url);
  }

  /**
   * 累計數量 aggQty 
   * @param ctnKind 桶別 
   */
  getAggQty$({ ctnKind, makeWt, pdc1000Wt, headQty }): Observable<number> {
    return this.getTaskQty$({ ctnKind, makeWt, pdc1000Wt })
      .pipe(
        map(taskQty => {
          const _headQty = new Decimal(headQty).toNumber();
          const _taskQty = new Decimal(taskQty).toNumber();

          let aggQty: number = _headQty + _taskQty; // 目前達到數量 

          aggQty = new Decimal(aggQty).toDP(3).toNumber();

          //console.log("aggQty ----------------");
          //console.log(typeof _headQty);
          //console.log(typeof _taskQty);

          //console.log("agg 量  :" + aggQty);

          return aggQty;
        })
      );

  } // function

  /**
   * 取得 4種狀態
   * 1. isLastCtn       是否尾桶?
   * 2. forceCompleted  強迫結案 
   * 3. canCompleted    可結案 
   * 4. notCompleted    不可結案
   * @param dto 
   */
  getStatus$(dto: WrkHeadDto): Observable<Status> {
    return this.getAggQty$(dto)
      .pipe(
        map(aggQty => {
          const reqQty = dto.reqQty;
          const reqQtyUpperBound = dto.reqQtyUpperBound;
          const reqQtyLowerBound = dto.reqQtyLowerBound;

          // console.log("getStatus -----------------------------");
          // console.log(typeof reqQty);
          // console.log(typeof reqQtyLowerBound);
          // console.log(typeof reqQtyUpperBound);

          // 尾桶 Y|N
          const isLastCtn = (aggQty >= reqQtyUpperBound) ? true : false;

          // 強迫結案: 累計數量 >= 需求量
          //const forceCompleted = aggQty >= reqQty;
          // 2019-07-30
          const forceCompleted = aggQty >= reqQtyUpperBound;

          // 可結案: 累計數量< 需求量 and 累計數量 >= 下限 
          const canCompleted = (aggQty < reqQty) && (aggQty >= reqQtyLowerBound);

          // 不可結案: 累計數量 < 上限 and 累計數量 <  下限 
          const notCompleted = (aggQty < reqQtyUpperBound) && (aggQty < reqQtyLowerBound);

          const status: Status = {
            isLastCtn,
            forceCompleted,
            canCompleted,
            notCompleted
          };

          return status;
        })
      );
  }


} // end class()