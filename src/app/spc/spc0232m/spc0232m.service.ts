import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { WrkProcDto } from './model';
import { Api } from '../../core/api.model';

import { Observable } from "rxjs";

@Injectable()
export class Spc0232mService {
  baseUrl = "/api/swpp"

  constructor(private http: HttpClient) {
  }

  // 新增前  check
  // POST
  createCheck(dto: WrkProcDto): Observable<any> {
    const url = `${this.baseUrl}/createCheck`;
    return this.http.post<Api>(url, dto);
  }

  // 新增
  create(dto: WrkProcDto): Observable<any> {
    return this.http.post<Api>(this.baseUrl, dto);
  }


  // 刪除前檢查
  // 刪除
  // POST
  deleteCheck(dto: WrkProcDto): Promise<Api> {
    let url = `${this.baseUrl}/deleteCheck`;
    return this.http.post<Api>(url, dto).toPromise();
  }


  // 刪除
  delete(dto: WrkProcDto): Observable<any> {
    let url = `${this.baseUrl}/${dto.jobNo}/${dto.procNo}/${dto.luoCode}/${dto.ctnNo}`;
    return this.http.delete<Api>(url);
  }

  // 查詢
  query(matrix: string): Observable<any> {
    let url = this.baseUrl + "/query/params" + matrix;
    return this.http.get(url);
  }


  // 讀取 spcWrkProcPad by primary key
  getSpcWrkProcPad(jobNo: string, luoCode: string, ctnNo: number, procNo: string): Observable<any> {
    let url = `${this.baseUrl}/${jobNo}/${luoCode}/${ctnNo}/${procNo}`;
    return this.http.get<Api>(url);
  }

  // 桶別 Pair list
  getCtnKindList(): Observable<any> {
    let url = `${this.baseUrl}/ctnKindList`;
    return this.http.get<Api>(url);
  }

  // 製程 procList Pair list
  getProcList(jobNo: string, luoCode: string): Observable<any> {
    let url = `${this.baseUrl}/getProcList/${jobNo}/${luoCode}`;
    return this.http.get<Api>(url);
  }

  // 批號 檢查
  checkJobNo(jobNo: string): Observable<any> {
    let url = `${this.baseUrl}/check/${jobNo}`;
    return this.http.get<Api>(url);
  }

  // 盧序 luoCode 輸入後檢查
  // ATTN: post, avoid too many arguments
  // POST
  checkLuoCode(dto: WrkProcDto): Observable<any> {
    let url = `${this.baseUrl}/check/luoCode`;
    return this.http.post<Api>(url, dto);
  }

  // 機台 輸入後檢查
  checkMchNo(mchNo: string, procNo: string): Observable<any> {
    let url = `${this.baseUrl}/check/mchNo/${mchNo}/${procNo}`;
    return this.http.get<Api>(url);
  }

  // 製程代號 輸入後檢查 2020-09-15
  checkProcNo(jobNo: string, procNo: string): Observable<Api> {
    let url = `${this.baseUrl}/check/procNo/${jobNo}/${procNo}`;
    return this.http.get<Api>(url);
  }


  // 
  getNextCtnNo(jobNo: string, luoCode: string, procNo: string): Observable<Api> {
    let url = `${this.baseUrl}/getNextCtnNo/${jobNo}/${luoCode}/${procNo}`;
    //alert(url);
    return this.http.get<Api>(url);
  }

  // 1.批號成型製程是否結案
  checkHeadOver(jobNo: string, procNo: string): Promise<any> {
    let url = `${this.baseUrl}/check/headOver/${jobNo}/${procNo}`;
    return this.http.get<Api>(url).toPromise();
  }


  // 批號+爐序 的輾牙累計完工數量 不可以大於 批號+爐序 的成型累計數量的上限
  isThreadNetQtyOverHeadNetQty(jobNo, luoCode, procNo, netQty): Observable<Api> {
    let url = `${this.baseUrl}/isThreadNetQtyOverHeadNetQty/${jobNo}/${luoCode}/${procNo}/${netQty}`;
    return this.http.get<Api>(url);
  }

  // exist check
  isExistedJobNoLuoCodeProcNo(jobNo, luoCode, procNo): Observable<Api> {
    let url = `${this.baseUrl}/isExistedJobNoLuoCodeProcNo/${jobNo}/${luoCode}/${procNo}`;
    return this.http.get<Api>(url);
  }


  // 2.當批號 輾牙生產數量 已到達 成型量下限, 進行批號結案 ，
  //  若 User輸入 N 時，再次詢問 User：可進行批號結案
  // 3.當批號 輾牙數量 尚未到達 成型數量下限 10%，禁止批號結案
  checkOverMakeQtyLB(jobNo: string, luoCode: string, procNo: string, makeWt: number, ctnKind: String): Promise<any> {
    let url = `${this.baseUrl}/check/overMakeQtyLB/${jobNo}/${luoCode}/${procNo}/${makeWt}/${ctnKind}`;
    return this.http.get<Api>(url).toPromise();
  }

  // location
  checkLocation(procNo: string, location: string): Observable<any> {
    let url = `${this.baseUrl}/check/location/${procNo}/${location}`;
    return this.http.get<Api>(url);
  }

  // 本次完工數量 
  getNetQty(jobNo: string, luoCode: string, ctnKind: string, makeWt: number): Observable<any> {
    let url = `${this.baseUrl}/getNetQty/${jobNo}/${luoCode}/${ctnKind}/${makeWt}`;
    return this.http.get<Api>(url);
  }

  // 批成型數量 head_qty of sch_job_orde_m
  // progress bar 用 
  getHeadQty(jobNo: string): Observable<any> {
    let url = `${this.baseUrl}/headQty/${jobNo}`;
    return this.http.get<Api>(url);
  }

  // 新增用 
  // 批累計數量 netQty of spc_wrk_proc
  // progress bar 用 
  getJobNetQty(jobNo: string, procNo: string): Observable<any> {
    let url = `${this.baseUrl}/jobNetQty/${jobNo}/${procNo}`;
    return this.http.get<Api>(url);
  }

  // 查詢用 
  // 批累計數量 netQty of spc_wrk_proc
  // progress bar 用 
  getJobNetQty2CtnNo(jobNo: string, procNo: string, ctnNo: number): Observable<any> {
    let url = `${this.baseUrl}/jobNetQty2CtnNo/${jobNo}/${procNo}/${ctnNo}`;
    return this.http.get<Api>(url);
  }

  // lowerBound 
  // progress bar 用 
  getLowerBound(jobNo: string, procNo: string): Observable<any> {
    let url = `${this.baseUrl}/lowerBound/${jobNo}/${procNo}`;
    return this.http.get<Api>(url);
  }

  //  
  getCodMast(codeNo: string): Observable<any> {
    let url = `${this.baseUrl}/codMast/${codeNo}`;
    return this.http.get<Api>(url);
  }

} // end class()