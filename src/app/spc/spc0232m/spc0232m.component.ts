import { Single, ProgressData } from './model';
import { StrUtil } from './../../utils/StrUtil';
import { environment } from './../../../environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ChangeDetectorRef, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';

import { Spc0232mTableDialogComponent } from './spc0232m-table-dialog.component';

import { WrkProcDto } from './model';
import { Spc0232mQueryComponent } from './spc0232m-query.component';
import { Spc0232mService } from './spc0232m.service';
import { flyInout } from '../../core/flyInOut.amimation';
import { DialogUtil } from '../../core/DialogUtils';

import { BrowserBarcodeReader, Result } from '@zxing/library'

// rxjs 6
import { Subject, forkJoin, Observable } from 'rxjs';
import { filter, switchMap, tap, takeUntil, debounceTime, pluck, distinctUntilChanged } from 'rxjs/operators';
import { DecimalPipe } from '@angular/common';
import { Api } from '../../core/api.model';
import Decimal from 'decimal.js';
import { Pair } from '../../core/Pair';

enum CrudMode {
  Create,
  Update,
  Query,
  Normal,
};

enum FormStatus {
  VALID = "VALID",
  INVALID = "INVALID",
  PENDING = "PENDING",
  DISABLED = "DISABLED"
}

@Component({
  selector: 'spc0232m',
  templateUrl: './spc0232m.component.html',
  styleUrls: ['./spc0232m.component.scss'],
  providers: [Spc0232mService],
  animations: [flyInout()]
})
export class Spc0232mComponent extends DialogUtil implements OnInit, AfterViewInit, OnDestroy {
  // for toDP3
  // decPipe = new DecimalPipe("en-Us");

  rowCount = 0;
  rowIndex = -1;

  private myName: string  = "ssss";

  currMode: CrudMode = CrudMode.Normal;

  // used in html, help property, isBtnDisabled
  readonly createMode: CrudMode = CrudMode.Create;
  readonly queryMode: CrudMode = CrudMode.Query;
  readonly updateMode: CrudMode = CrudMode.Update;
  readonly normalMode: CrudMode = CrudMode.Normal;

  ctnKindList: any[] = [];

  // for mat-select 
  currProcNo = null;
  procList: any[] = [];

  dto: WrkProcDto = new WrkProcDto();
  dtoList: WrkProcDto[] = [];

  numRegex = /^[0-9]+(\.[0-9]*){0,1}$/;
  intRegex = /^[0-9]+$/;

  //--------------
  form1: FormGroup;

  jobNoCtrl = new FormControl("", { updateOn: "blur", validators: [Validators.required] });
  luoCodeCtrl = new FormControl("", Validators.required);
  ctnNoCtrl = new FormControl("", Validators.required);
  procNoCtrl = new FormControl("", Validators.required);

  // add 2020-04-10
  procNameCtrl = new FormControl("");

  mchNoCtrl = new FormControl("", Validators.required);
  luoNameCtrl = new FormControl("", Validators.required);
  operatorCtrl = new FormControl("", Validators.required);
  makeWtCtrl = new FormControl("", [Validators.required, Validators.pattern(this.numRegex)]);
  ctnKindCtrl = new FormControl("", { updateOn: "change", validators: [Validators.required] });
  lastCtnCtrl = new FormControl("N", { updateOn: "change", validators: [Validators.required] });
  jobEndCodeCtrl = new FormControl(false, { updateOn: "change", validators: [Validators.required] });
  locationCtrl = new FormControl("", Validators.required);
  stackNotOkCtrl = new FormControl("", { updateOn: "change", validators: [Validators.required] });
  accNetQtyCtrl = new FormControl("");
  netQtyCtrl = new FormControl("");
  pdcSizeCtrl = new FormControl("");

  // --------------------------
  // svg progress
  progressData: ProgressData;
  aggQty: number = 0;    // 累計數量 + 此次完工數量 for 顯示
  headQty: number = 0;   // 成型量
  lowerBound: number = 0;   // 成型量
  donutSingle: Single;

  // --------------------------
  // for Camera barcode
  barcodeReader: BrowserBarcodeReader;  // zxing
  isCameraHidden: boolean = true;
  isGesture: boolean = false;
  beep: HTMLAudioElement;;

  // for ununscribe
  destroy$ = new Subject<any>()

  isLoading = false;  // for spinner


  constructor(
    private spc0232mSvc: Spc0232mService,
    private fb: FormBuilder,
    injector: Injector,
    private cdRef: ChangeDetectorRef) {

    super(injector);
  }

  // guard
  canDeactivate(): boolean {
    return (this.isCreate && this.form1.dirty) ? false : true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.barcodeReader.reset();
    this.barcodeReader.unbindVideoSrc(document.getElementById("video") as HTMLVideoElement)
  }

  ngOnInit() {
    this.buildForm();
    //console.log(this.constructor.name);
    
  }

  ngAfterViewInit() {
    this.barcodeReader = new BrowserBarcodeReader();
    this.beep = (<HTMLAudioElement>document.getElementById("beep"));

    this.doClear(true);

    // 桶別 list
    this.spc0232mSvc.getCtnKindList()
      .subscribe(api => {
        this.ctnKindList = api.data;
      });

    // ATTN
    this.cdRef.detectChanges();
  }

  // reactive form
  buildForm() {
    this.form1 = this.fb.group({
      jobNo: this.jobNoCtrl,
      luoCode: this.luoCodeCtrl,
      ctnNo: this.ctnNoCtrl,
      procNo: this.procNoCtrl,
      procName: this.procNameCtrl,
      mchNo: this.mchNoCtrl,
      luoName: this.luoNameCtrl,
      operator: this.operatorCtrl,
      makeWt: this.makeWtCtrl,
      ctnKind: this.ctnKindCtrl,
      lastCtn: this.lastCtnCtrl,
      jobEndCode: this.jobEndCodeCtrl,
      location: this.locationCtrl,
      stackNotOk: this.stackNotOkCtrl,

      accNetQty: this.accNetQtyCtrl,
      netQty: this.netQtyCtrl,
      pdcSize: this.pdcSizeCtrl
    },
      { updateOn: "blur" }
    );

    // ------------------------------------
    // 批號 jobNo
    this.jobNoCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(jobNo => !StrUtil.isEmpty(jobNo)),
        // distinctUntilChanged(),
        // debounceTime(1100)
      )
      .subscribe(jobNo => {
        this.dto.jobNo = jobNo;
        this.checkJobNo();   // delegate
      });

    // 盧序 luoCode. pass dto and return dto, 填補一些欄位
    // tap for side effect
    this.luoCodeCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(luoCode => !StrUtil.isEmpty(luoCode)),
        tap(luoCode => {
          this.isLoading = true;
          this.dto.luoCode = luoCode;
          this.dto.jobEndCode = this.jobEndCodeCtrl.value ? "Y" : "N";
        }),
        switchMap(luoCode => this.spc0232mSvc.checkLuoCode(this.dto))
      )
      .subscribe(api => {
        if (api.data) {
          this.dto = {...this.dto, ...api.data };
          this.dto.jobEndCode = api.data["jobEndCode"] == "Y" ? true : false;

          this.form1.patchValue(this.dto, { emitEvent: false });

          const jobNo = this.jobNoCtrl.value;
          const luoCode = this.luoCodeCtrl.value;

          // 重新取得 procList 
          
          this.spc0232mSvc.getProcList(jobNo, luoCode)
            .subscribe(api => {
              this.procList = api.data;
            });

          this.procList = api.data;

          this.currProcNo = this.dto.procNo;//michaelsun
          
          //this.isThreadNetQtyOverHeadNetQty(this.dto.jobNo, this.dto.luoCode, this.dto.procNo);

        } else {
          this.luoCodeCtrl.setErrors({ invalid: true });
          this.luoCodeCtrl.markAsDirty();
          this.error(api.error.desc)
            .afterClosed()
            .subscribe();
        }

        this.isLoading = false;
      });

    //-----------------------------------
    // 2020-09-22 使用 mat-select 取代
    //-----------------------------------
    // 製程代號檢查 2020-09-15, 修改為可輸入
    // SP_CHK_THRE_PROC_PDA
    // 需修改統號 如果 procNo changes
    //this.procNoCtrl.valueChanges
    //  .pipe(
    //    takeUntil(this.destroy$),
    //    filter(procNo => ! StrUtil.isEmpty(procNo)),
    //    switchMap(procNo => {
    //      const jobNo = this.jobNoCtrl.value;
    //      return this.spc0232mSvc.checkProcNo(jobNo, procNo);
    //    })
    //  ).subscribe(api => {
    //    if (api.status == "ERROR" ) {
    //      //this.locationCtrl.patchValue(location, { emitEvent: false })
    //      this.procNameCtrl.patchValue("", {emitEvent: false})
    //      this.error(api.error.desc)
    //    } else {
    //        const procName = api.data;
    //        this.procNameCtrl.patchValue(procName, {emitEvent: false})
    //        const jobNo = this.jobNoCtrl.value;
    //        const luoCode = this.luoCodeCtrl.value;
    //        const procNo = this.currProcNo;

    //        // re-get ctnNo
    //        this.spc0232mSvc.getNextCtnNo(jobNo, luoCode, procNo)
    //          .subscribe(api => {
    //            if (api.status == "OK") {
    //              const ctnNo= api.data;
    //              this.ctnNoCtrl.patchValue(ctnNo, {emitEvent: false});
    //              alert(this.ctnNoCtrl.value);
    //            } else {
     //             this.error(api.error.desc);
    //            }
    //          })

    //    }
    //  });


    // 毛重 makeWt
    this.makeWtCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(makeWt => !StrUtil.isEmpty(makeWt)),
      )
      .subscribe(makeWt => {
        this.checkMakeWt();   // delegate
      });

    // 機台 mchNo
    this.mchNoCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(mchNo => !StrUtil.isEmpty(mchNo)),
        switchMap((mchNo: string) => {
          const procNo = this.procNoCtrl.value;
          return this.spc0232mSvc.checkMchNo(mchNo, procNo);
        })
      )
      .subscribe(api => {
        if (api.data) {
          const location: string = api.data;
          this.dto.mchNo = this.mchNoCtrl.value;
          this.dto.location = location;
          this.locationCtrl.patchValue(location, { emitEvent: false })
        } else {
          this.mchNoCtrl.setErrors({ invalid: true });
          this.locationCtrl.reset("", { emitEvent: false });
          this.error(api.error.desc)
            .afterClosed()
            .subscribe();
        }
      });

    // 儲位 location
    this.locationCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        filter(location => !StrUtil.isEmpty(location)),
        switchMap(location => this.spc0232mSvc.checkLocation(this.dto.procNo, location))
      )
      .subscribe(api => {
        if (api.error.code == -1) {
          this.locationCtrl.setErrors({ invalid: true });
          this.error(api.error.desc)
            .afterClosed()
            .subscribe();
        }
      });

  }

  /**
   * tricky for MAT-CHECKBOX, null/undefined -> false, others true 
   * @param jobNo 
   * @param procNo 
   * @param luoCode 
   * @param ctnNo 
   */
  fetch(jobNo, procNo, luoCode, ctnNo) {
    this.spc0232mSvc.getSpcWrkProcPad(jobNo, procNo, luoCode, ctnNo)
      .subscribe(api => {
        // console.log(api);
        if (api.data) {
          this.dto = { ...api.data };
          this.dto.jobEndCode = (this.dto.jobEndCode === "Y") ? true : false;
          this.dto.accNetQty = StrUtil.toDP3(this.dto.accNetQty);

          this.form1.patchValue(this.dto, { onlySelf: true, emitEvent: false });

          //console.log(this.dto);


          // SVG 圖
          this.prepareProgressDate(this.dto, 0, true);

        } else {
          this.doClear(true);
          const msg = `${jobNo} ${luoCode} ${ctnNo} 資料已不存在,請重新查詢!`;
          this.error(msg);
        }
      });
  }

  // netQty: 此次完工數量
  // 甜甜圈 - donut 
  async prepareProgressDate({ jobNo, procNo, ctnNo }, netQty: number, isQuery: boolean) {
    let jobNetQty$: Observable<any>  = null;

    // 批成型量 (分母)
    const headQty$ = this.spc0232mSvc.getHeadQty(jobNo).pipe(pluck("data"));

    // 批累計數量 (分子)
    if (isQuery) {
      jobNetQty$ = this.spc0232mSvc.getJobNetQty2CtnNo(jobNo, procNo, ctnNo).pipe(pluck("data"));
    } else {
      jobNetQty$ = this.spc0232mSvc.getJobNetQty(jobNo, procNo).pipe(pluck("data"));
    }

    // 下限
    const lowerBound$ = this.spc0232mSvc.getLowerBound(jobNo, procNo).pipe(pluck("data"));

    const [headQty, aggQty, lowerBound] = await forkJoin(headQty$, jobNetQty$, lowerBound$).toPromise();
    // console.log("headQty:" + headQty);
    // console.log("aggQty:" + aggQty);
    // console.log("lowerBound:" + lowerBound);

    this.headQty = headQty;
    this.lowerBound = lowerBound;

    // 批累計輾牙量 (分子) + 完工數量
    this.aggQty = aggQty + netQty;

    let donutValue = Decimal.div(this.aggQty, this.headQty).times(100).toDP(3).toNumber();
    if (donutValue > 100) {
      donutValue = 100;
    }

    this.donutSingle = { value: new Decimal(donutValue).toDP(0).toNumber() };

    // 進度橫條圖 - progress bar
    this.progressData = {
      lowerBoundQty: this.lowerBound,
      upperBoundQty: null,
      baseQty: this.headQty,
      aggQty: new Decimal(this.aggQty).toDP(1).toNumber()
    };

  }

  /**
   * 新增  
   */
  async doCreate() {
    // 2019-09-24
    //if (this.form1.invalid) {
    //  Object.values(this.form1.controls)
    //    .forEach(ctrl => {
    //      if (ctrl.invalid) {
    //        ctrl.markAsDirty();
    //      }
    //    });

    //  this.error("紅色欄位資料有錯誤,請先更正!");
    //  return;
    //}

    if (this.form1.invalid) {
      const mesgArr = [];
      Object.keys(this.form1.controls)
        .forEach(f => {
          const ctrl = this.form1.controls[f];
          if (ctrl.invalid) {
            ctrl.markAsDirty();
            mesgArr.push(f);
          }
        });

      const mesg = mesgArr.join("\n");

      this.error("紅色欄位資料有錯誤,請先更正:\n" + mesg);
      return;
    }

    // > 0 檢查 //檢查完工數量是否為零 michaelsun
    const netQty: number = parseFloat(this.netQtyCtrl.value) || 0.00;
    if (netQty <= 0) {
      this.showSnackbar("完工數量不得為0!", "通知", 3000);
      return false;
    }

    //檢查完工數量是否為零且不可大於1200 michaelsun
    const makeWt: number = parseFloat(this.makeWtCtrl.value) || 0.00;
    if (makeWt <= 0) {
      this.showSnackbar("請輸入毛重!", "通知", 3000);
      return false;
    }
    else if(makeWt > 1200) {
      //this.showSnackbar("毛重不可大於 1200!", "通知", 3000);
      this.error("毛重不可大於 1200!");
      return false;
    }
    //---------------------------------------------------------------------

    const dto = {
      ...this.dto,
      ...this.form1.value,
      jobEndCode: this.dto.jobEndCode ? "Y" : "N",
    };

    // 新增前 - check
    this.isLoading = true;

    const api: Api = await this.spc0232mSvc.createCheck(dto).toPromise();
    if (api.status == "ERROR") {
      this.progressData = null;
      this.error(api.error.desc)
        .afterClosed()
        .subscribe();

      this.isLoading = false;
      return;
    }

    // -----------------------
    this.spc0232mSvc.create(dto)
      .subscribe(api => {
        if (api.data) {
          this.dto = { ...api.data };
          this.dto.jobEndCode = (this.dto.jobEndCode === "Y") ? true : false;
          this.error("新增資料成功.").afterClosed()
            .subscribe(x => {
              this.doClear(true);
              this.form1.reset(this.dto, { emitEvent: false });
            });
        } else {
          this.error("新增資料失敗-" + api.error.desc);
        }

        this.progressData = null;
        this.isLoading = false;
      });

  }

  /**
   * 刪除 
   */
  async doDelete() {
    const dialogRef = this.confirm("確定刪除此筆資料?");
    const yn = await dialogRef.afterClosed().toPromise();
    if (yn == undefined || yn == "N") {
      return;
    }

    // pre delete check
    let api: Api = await this.spc0232mSvc.deleteCheck(this.dto);
    if (api.status == "ERROR") {
      this.error(api.error.desc);
      return;
    }

    // delete
    api = await this.spc0232mSvc.delete(this.dto).toPromise();
    if (api.status === "OK") {
      this.showSnackbar("刪除成功", "", 3000);

      this.dtoList = this.dtoList.filter(e =>
        !(e.jobNo === this.dto.jobNo &&
          e.luoCode === this.dto.luoCode &&
          e.ctnNo === this.dto.ctnNo)
      );

      this.rowCount = this.dtoList.length;
      if (this.rowCount === 0) {
        this.doClear();
      } else {
        this.rowIndex = Math.min(this.rowIndex, this.rowCount - 1);
        let {jobNo, procNo, luoCode, ctnNo} = this.dtoList[this.rowIndex];
        this.fetch(jobNo, procNo, luoCode, ctnNo);
      }

    } else {
      this.error("刪除失敗-" + api.error.desc);
    }
  }

  // call after allowed
  openQuery() {
    const dialogRef = this.dialog.open(Spc0232mQueryComponent, this.dialogConfig);

    dialogRef.afterClosed()
      .subscribe(rs => {
        // undefined when press Escape or backdrop to close the dialog.
        if (!rs) {
          return;
        }

        let api: Api = rs as Api;
        if (api.data) {
          this.currMode = CrudMode.Normal;
          this.dtoList = [...api.data];

          this.rowCount = this.dtoList.length;
          this.showSnackbar(this.rowCount + " 筆資料", "查詢", 3000);

          //console.log(this.dtoList);

          if (this.rowCount > 0) {
            this.rowIndex = 0;

            let { jobNo, procNo, luoCode, ctnNo } = this.dtoList[this.rowIndex];
            this.fetch(jobNo, procNo, luoCode, ctnNo);

          } else {                  // not found 
            this.rowIndex = -1;
            this.doClear(true);
            this.currMode = CrudMode.Normal;
            this.showSnackbar("0 筆資料", "查詢", 3000);
          }

          this.form1.disable({ emitEvent: false });
        }

      });

  }

  /**
   * 視窗查詢, if OK then openQuery
   */
  doQuery(): void {
    if (this.isCreate && this.form1.dirty) {
      this.unsave().afterClosed()
        .pipe(
          filter(yn => yn == "Y")
        )
        .subscribe(yn => this.openQuery());
    } else {
      this.openQuery();
    }
  }

  // 清畫面
  // 同時進入  新增 mode
  doClear(isPristine: boolean = true) {
    this.progressData = null;

    this.dto = new WrkProcDto();

    this.dto.jobEndCode = false;   // checkbox, null, undefined --> false

    this.dto.stackNotOk = "N";
    this.dto.lastCtn = "N";
    this.dto.ctnKind = "S";   // default

    this.currMode = CrudMode.Create;

    this.dtoList = [];
    this.rowCount = 0;
    this.rowIndex = -1;

    // ATTN
    if (isPristine) {
      this.form1.markAsPristine();
      this.form1.markAsUntouched();
    }

    this.form1.reset(this.dto, { emitEvent: false });
    this.form1.enable({ emitEvent: false });

  }

  // 表格
  doTable() {
    let config = { ...this.dialogConfig, position: { top: "0px" } };

    let dialogRef = this.dialog.open(Spc0232mTableDialogComponent, config);
    dialogRef.componentInstance.wrkHeadPadList = this.dtoList;

    dialogRef.afterClosed().pipe(
      filter(ret => ret instanceof Object)
    ).subscribe(dto => {
      this.rowIndex = this.dtoList.findIndex(e =>
        e.jobNo === dto.jobNo &&
        e.luoCode === dto.luoCode &&
        e.ctnNo === dto.ctnNo &&
        e.procNo === dto.procNo
      );

      this.fetch(dto.jobNo, dto.procNo, dto.luoCode, dto.ctnNo);

    });
  }

  /**
   * 批號 barcode scan
   */
  scanJobNo() {
    this.scanBarcode()
      .then(barcode => {
        this.jobNoCtrl.setValue(barcode);  // valueChange will fire.
        this.checkJobNo();
      });

  }

  /**
   * 檢查 jobNo 存在否?  blur
   */
  async checkJobNo() {

    if (StrUtil.isEmpty(this.dto.jobNo)) {
      this.dto.jobNo = null;
      this.progressData = null;
      return;
    }

    this.isLoading = true;
    const { status, data, error } = await this.spc0232mSvc.checkJobNo(this.dto.jobNo).toPromise();
    
    if (status == "OK") {
      this.dto = { ...data };
      this.dto.jobEndCode = (this.dto.jobEndCode === "Y") ? true : false;

      // default S
      this.dto.ctnKind = "S";
      this.dto.stackNotOk = "N";
      this.dto.accNetQty = StrUtil.toDP3(this.dto.accNetQty);

      this.form1.patchValue(this.dto, { emitEvent: false });

      // 2020-09-18
      this.currProcNo = this.dto.procNo;

      const jobNo = this.jobNoCtrl.value;
      const luoCode = this.luoCodeCtrl.value;

      // 讀取 procList for mat-select
      const api: Api = await this.spc0232mSvc.getProcList(jobNo, luoCode).toPromise();
      this.procList = api.data;

      this.prepareProgressDate(this.dto, 0, false);

    } else {
      let jobNo = this.dto.jobNo;         // 舊值; object de-constructor
      this.doClear(false);
      this.dto = { ...this.dto, jobNo };  // object spread
      this.form1.reset({ emitEvent: false });
      this.form1.patchValue(this.dto, { emitEvent: false });

      this.jobNoCtrl.markAsDirty();
      this.jobNoCtrl.setErrors({ error: true });

      let msg = error.desc;
      this.error(msg).afterClosed().subscribe();
      this.progressData = null;
      this.isLoading = false;

      return;
    }

    this.isLoading = false;
  }

  async isThreadNetQtyOverHeadNetQty(jobNo: string, luoCode: string, procNo: string, netQty: number): Promise<any> {
    const resp 
      = await this.spc0232mSvc.isThreadNetQtyOverHeadNetQty(jobNo, luoCode, procNo, netQty).toPromise();
    
    const {key: isOver, value: mesg} = resp.data;

    if (isOver) {
      this.error("批號+爐序的輾牙累計完工數量 不可以大於\n 批號+爐序 的成型累計數量的上限 \n" + mesg);
      this.makeWtCtrl.setErrors({error: true});
      this.makeWtCtrl.markAsDirty();
    } else {
      this.makeWtCtrl.setErrors(null);
      this.makeWtCtrl.markAsPristine();

    }

    return isOver;
  }

  /**
   * 毛重輸入後檢查
   * 毛重改變 => 完工數量改變 => 結案 
   * 
   * 1. 當批號成型製程尚未結案，不能輸入 Y
   *    head_over
   * 
   * 3. 當批號輾牙生產數量已到達成型下限, 進行批號結案 ，
   *    若 User 輸入 N時，再次詢問 User：可結案
   * 4. 當批號輾牙數量尚未到達成型下限， 不可結案
   */
  async checkMakeWt() {
    let api: Api = null;
    let jobEndCode: boolean = false;

    // pre check
    if (this.jobNoCtrl.invalid) {
      this.showSnackbar("批號不存在!", "通知", 3000);
      this.jobEndCodeCtrl.setValue(false, { emitEvent: false });

      return;
    }

    if (this.makeWtCtrl.invalid) {
      this.showSnackbar("毛重資料未輸入!", "通知", 3000);
      this.jobEndCodeCtrl.setValue(false, { emitEvent: false });
      return;
    }

    //-------------
    const makeWt: number = this.makeWtCtrl.value;
    if (makeWt < 0) {
      this.showSnackbar("毛重必須大於 0", "", 3000);
      this.makeWtCtrl.setValue(null, { emitEvent: false });
      this.jobEndCodeCtrl.setValue(false, { emitEvent: false });

      return;
    }

    if (makeWt > 1200) {
      //this.showSnackbar("毛重不可大於 1200!", "", 3000);
      this.error("毛重不可大於 1200!");
      this.makeWtCtrl.setValue(null, { emitEvent: false });
      this.jobEndCodeCtrl.setValue(false, { emitEvent: false });

      return;
    }

    // view to model
    this.isLoading = true;

    this.dto.makeWt = this.makeWtCtrl.value;
    this.dto.ctnKind = this.ctnKindCtrl.value;
    this.dto.ctnNo = this.ctnNoCtrl.value;//michaelsun
    this.dto.procNo = this.procNoCtrl.value;//michaelsun

    // existing check
    const {jobNo, luoCode, procNo}  = this.dto;
    const {data: isExisted } =  await this.spc0232mSvc.isExistedJobNoLuoCodeProcNo(jobNo, luoCode, procNo).toPromise();
    if (!isExisted) {
      const mesg = "批號+爐序+制程 不存在\n" +
                   "批號: " + jobNo + "\n" +
                   "爐序: " + luoCode + "\n" +
                   "制程: " + procNo;
      this.error(mesg)
        .afterClosed()
        .subscribe(x => {
          this.luoCodeCtrl.setErrors({error: true});
          this.luoCodeCtrl.markAsDirty();

          this.isLoading = false;
          return;
        });
    } else {
        this.luoCodeCtrl.setErrors(null);
        this.luoCodeCtrl.markAsPristine();
    }

    // netQty 完工數量 
    api = await this.spc0232mSvc
      .getNetQty(this.dto.jobNo, this.dto.luoCode, this.dto.ctnKind, this.dto.makeWt).toPromise();


      // 2019-09-24 update, check using pl/sql
    this.dto.netQty = api.data;
    this.netQtyCtrl.setValue(StrUtil.toDP3(this.dto.netQty));

    // 完工進度 update SVG
    this.prepareProgressDate(this.dto, this.dto.netQty, false);

    // 2019-09-24 update, check using pl/sql
    // --------------------------------------
    //批號+爐序的輾牙累計完工數量 不可以大於 批號+爐序 的成型累計數量的上限
    //const isOver = 
    //    await this.isThreadNetQtyOverHeadNetQty(this.dto.jobNo, this.dto.luoCode, this.dto.procNo, this.dto.netQty);
    
    //if (isOver) {
    //  this.isLoading = false;
    //  return; 
    //}

    jobEndCode = this.jobEndCodeCtrl.value;
    console.log("jobEndCode:" + jobEndCode);

    //-----------------------------------
    // 1.批號 成型製程 是否已結案?
    api = await this.spc0232mSvc.checkHeadOver(this.dto.jobNo, this.dto.procNo);

    // nextProcNo, 前製程不存在
    if (api.status == "ERROR") {
      this.error(api.error.desc);
      this.isLoading = false;
      return;
    }

    const isHeadOver: boolean = api.data;
    console.log("isHeadOver:" + isHeadOver);


    // todo, uncomment after test
    if (!isHeadOver && jobEndCode) {
      this.error("批號成型製程尚未結案 !\n" + "此製程不可批號結案 !")
        .afterClosed()
        .subscribe(x => {
          this.dto.jobEndCode = false;
          this.dto.lastCtn = "N";
          this.jobEndCodeCtrl.setValue(this.dto.jobEndCode, { emitEvent: false });
          this.lastCtnCtrl.setValue(this.dto.lastCtn, { emitEvent: false });
        });

      this.isLoading = false;
      return;
    }

    //-----------------------------
    // 2. 當批號輾牙生產數量已到達成型下限, 進行批號結案 ，
    //    若 User 輸入 N時，再次詢問 User：可進行批號結案
    api =
      await this.spc0232mSvc.checkOverMakeQtyLB(
        this.dto.jobNo,
        this.dto.luoCode,
        this.dto.procNo,
        this.dto.makeWt,
        this.dto.ctnKind);

    const isOverLB: boolean = api.data;
    console.log("isOverLB:" + isOverLB);

    //-----------

    if (!isOverLB && jobEndCode) {
      this.error("輾牙數量尚未到達成型下限\n 禁止批號結案!")
        .afterClosed()
        .subscribe(x => {
          this.dto.jobEndCode = false;
          this.dto.lastCtn = "N";
          this.jobEndCodeCtrl.setValue(this.dto.jobEndCode, { emitEvent: false });
          this.lastCtnCtrl.setValue(this.dto.lastCtn, { emitEvent: false });
        });

      this.isLoading = false;
      return;
    }

    if (isOverLB && (!jobEndCode)) {
      this.confirm("已達下限可以進行批號結案, 是否要結案?").afterClosed()
        .subscribe(yn => {
          if (yn == "Y") {
            this.dto.jobEndCode = true;
            this.dto.lastCtn = "Y"
          } else {
            this.dto.jobEndCode = false;
            this.dto.lastCtn = "N"
          }
          this.jobEndCodeCtrl.setValue(this.dto.jobEndCode);
          this.lastCtnCtrl.setValue(this.dto.lastCtn);
        });

      this.isLoading = false;
      return;
    }

    // 進行批號結案, force 
    //if (isOverLB) {
    //  this.dto.lastCtn = "Y";
    //  this.dto.jobEndCode = true;
    //  this.jobEndCodeCtrl.setValue(this.dto.jobEndCode, { emitEvent: false });
    //  this.lastCtnCtrl.setValue(this.dto.lastCtn, { emitEvent: false });
    //  this.showSnackbar("輾牙數量尚已達成型下限,結案", "", 3000);

    //  this.isLoading = false;
    //  return;
    //}

    this.isLoading = false;
  }

  // 桶別改變
  onCtnKindChange(evt: MatSelectChange) {
    this.checkMakeWt();
  }

  // 2020-10-
  // 製程代號改變
  onProcNoChange(evt: MatSelectChange) {
    this.currProcNo = evt.value;
    
    this.procNoCtrl.patchValue(this.currProcNo, {emitEvent: false});

    const jobNo = this.jobNoCtrl.value;
    const luoCode = this.luoCodeCtrl.value;
    const procNo = this.procNoCtrl.value; 

    const pair = this.procList.find(x => x.key == procNo);
    this.procNoCtrl.patchValue(pair.key, {emitEvent: false});
    this.procNameCtrl.setValue(pair.value, {emitEvent: false});

    // alert(`${jobNo} - ${luoCode} - ${procNo}`);

    this.dto.procNo = this.procNoCtrl.value;//michaelsun

    this.spc0232mSvc.getNextCtnNo(jobNo, luoCode, procNo)
      .subscribe(api => {
        this.ctnNoCtrl.patchValue(api.data, {emitEvent: false});  // 統號更改
        //alert(JSON.stringify(this.form1.value));
      });
  }

  /**
   * 尾桶改變 
   * @param e 
   * todo
   */
  onLastCtnChange(e: MatRadioChange) {
    const jobEndCode = this.jobEndCodeCtrl.value;

    if (jobEndCode && e.value == "N") {
      this.error("批號已完工, 必須是尾桶!")
        .afterClosed()
        .subscribe(x => {
          this.dto.lastCtn = "Y";
          this.lastCtnCtrl.setValue("Y", { emitEvent: false });
        });
    }

  }

  // 結案
  onJobEndCodeChange(evt: MatCheckboxChange) {
    this.checkMakeWt();
  }

  /**
    * ZXing scan 
    * async await
    */
  async scanBarcode(): Promise<string> {
    this.resetCamera(false);
    let barcode = "";

    await this.barcodeReader.decodeFromInputVideoDevice(undefined, "video")
      .then((result: Result) => {
        barcode = result.getText();
        this.beep.play();
        this.resetCamera(true);
      })
      .catch(err => {
        alert(err);
        return Promise.reject("zxing scan err");
      });

    return Promise.resolve(barcode);
  }

  // 網頁攝影機(webCamera): Click/Tap 停止掃描且隱藏 
  resetCamera(hideCamera?: boolean) {
    this.barcodeReader.reset();

    if (hideCamera == undefined) {
      this.isCameraHidden = true;
    } else {
      this.isCameraHidden = hideCamera;

    }
  }

  // 上一筆
  doPrev() {
    this.rowIndex--;
    if (this.rowIndex < 0) {
      this.rowIndex = 0;
      this.showSnackbar("第一筆", "", 3000);
      return;
    }

    let { jobNo, procNo, luoCode, ctnNo } = this.dtoList[this.rowIndex];
    this.fetch(jobNo, procNo, luoCode, ctnNo);
  }

  // 下一筆
  doNext() {
    this.rowIndex++;
    if (this.rowIndex > (this.dtoList.length - 1)) {
      this.rowIndex = this.dtoList.length - 1;
      this.showSnackbar("最後筆", "", 3000);
      return;
    }

    let { jobNo, procNo, luoCode, ctnNo} = this.dtoList[this.rowIndex];
    this.fetch(jobNo, procNo, luoCode, ctnNo);
  }

  /**
   * @param crudMode 
   */
  isBtnDisabled(state: CrudMode): boolean {
    switch (state) {
      case CrudMode.Create:     // 新增      
        if (this.isCreate) {
          return false;
        } else {
          return true;
        }

      case CrudMode.Query:      // 查詢
        if (this.isQuery || this.isNormal) {
          return false;
        } else {
          return true;
        }

      case CrudMode.Update:     // 修改
        if ((this.isUpdate || this.isNormal)) {
          return false;
        } else {
          return true;
        }

      case CrudMode.Normal:
        if (this.rowCount > 0 && this.isNormal) {
          return false;
        } else {
          return true;
        }

      default: {
        alert("isBtnDisabled(mode): " + state + " 請通知統管理員!");
      }
    }
  }

  get isNormal(): boolean {
    return this.currMode === CrudMode.Normal;
  }

  get isCreate(): boolean {
    return this.currMode === CrudMode.Create;
  }

  get isUpdate(): boolean {
    return this.currMode === CrudMode.Update;
  }

  get isQuery(): boolean {
    return this.currMode === CrudMode.Query;
  }

  test() {
    const rs = Object.keys(this.dto)
      .reduce((acc, k) => {
        acc.push(k + " : " + this.dto[k]);
        return acc;
      }, []);

    return rs;
  }

  hello() {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);

  }

  progress() {
    // 進度橫條圖 - progress bar
    this.progressData = {
      lowerBoundQty: 114,
      upperBoundQty: null,
      baseQty: 120,
      aggQty: 80
    };

    console.log(JSON.stringify(this.progressData));

  }

  private ddd(): Pair<string, string> {
    return null;

  }

} // class