import { environment } from './../../../environments/environment';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ChangeDetectorRef, Injector, AfterViewInit, OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { MatSelectChange } from '@angular/material/select';

import { Spc0202mTableDialogComponent } from './spc0202m-table-dialog.component';
import { PadUser } from './../../shared/svc/PadUser';

import { WrkHeadDto, Status, ProgressData, Single, CrudMode } from './model';
import { Spc0202mQueryComponent } from './spc0202m-query.component';
import { Spc0202mService } from './spc0202m.service';
import { flyInout } from '../../core/flyInOut.amimation';
import { DialogUtil } from '../../core/DialogUtils';

import { Decimal } from 'decimal.js';
import { StrUtil } from './../../utils/StrUtil';

import { DecimalPipe } from "@angular/common";

import { Subject } from 'rxjs';
import { filter, switchMap, takeUntil, map } from 'rxjs/operators';

import { BrowserBarcodeReader, Result } from '@zxing/library';

// import Quagga from 'quagga';
// import { configQuagga } from '../barcode-config/quaggaConfig';

//enum CrudMode {
//  Create,
//  Update,
//  Query,
//  Normal,
//};

@Component({
  selector: 'spc0202m',
  templateUrl: './spc0202m.component.html',
  styleUrls: ['./spc0202m.component.scss'],
  providers: [Spc0202mService],
  animations: [flyInout()]
})
export class Spc0202mComponent extends DialogUtil implements OnInit, AfterViewInit, OnDestroy {
  // for toDP3
  decPipe = new DecimalPipe("en-Us");

  rowIndex = -1;
  rowCount = 0;

  currMode: CrudMode = CrudMode.Normal;

  // used in html, help property, isBtnDisabled
  readonly createMode: CrudMode = CrudMode.Create;
  readonly queryMode: CrudMode = CrudMode.Query;
  readonly updateMode: CrudMode = CrudMode.Update;
  readonly normalMode: CrudMode = CrudMode.Normal;

  // 桶別 List
  ctnKindList: any[] = [];

  dto: WrkHeadDto = new WrkHeadDto();
  dtoList: WrkHeadDto[] = [];

  form1: FormGroup;

  openCount = 0;

  numRegex = /^[0-9]+(\.[0-9]*){0,1}$/;
  intRegex = /^[0-9]+$/;

  debug = false;

  // for Camera barcode
  barcodeReader: BrowserBarcodeReader;  // zxing
  isCameraHidden: boolean = true;
  isGesture: boolean = false;
  beep: HTMLAudioElement;

  // helper for easy access 
  jobNoCtrl: FormControl;
  makeWtCtrl: FormControl;
  lastCtnCtrl: FormControl;
  luoNameCtrl: FormControl;
  ctnKindCtrl: FormControl;
  jobEndCodeCtrl: FormControl;

  coilNo1Ctrl: FormControl;
  coilNo2Ctrl: FormControl;
  coilNo3Ctrl: FormControl;

  taskQtyCtrl: FormControl;
  headQtyCtrl: FormControl;
  reqQtyUpperBoundCtrl: FormControl;
  reqQtyLowerBoundCtrl: FormControl;

  myForm: FormGroup;

  // svg progress
  progressData: ProgressData;
  accQty: number = 0;    // 累計數量 + 此次完工數量 for 顯示
  donutSingle: Single;

  // for ununscribe
  destroy$ = new Subject<any>();

  constructor(
    private spc0202mSvc: Spc0202mService,
    private fb: FormBuilder,
    injector: Injector,
    private cdRef: ChangeDetectorRef) {

    super(injector);
  }

  ngOnInit() {
    this.barcodeReader = new BrowserBarcodeReader();
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    this.barcodeReader.reset();
    this.barcodeReader.unbindVideoSrc(document.getElementById("video") as HTMLVideoElement);
  }

  ngAfterViewInit(): void {
    this.doClear();

    // Audio: beep effect
    this.beep = (<HTMLAudioElement>document.getElementById("beep"));

    // 取得 桶別 list
    this.spc0202mSvc.getCtnKindList()
      .subscribe(api => {
        this.ctnKindList = api.data;
      });

    // ATTN
    this.cdRef.detectChanges();

  }

  // reactive form
  buildForm() {
    this.jobNoCtrl = this.fb.control("", Validators.required);

    //this.makeWtCtrl = this.fb.control("", [Validators.required, Validators.pattern(this.numRegex)]);
    this.makeWtCtrl = this.fb.control("", {
      validators: [Validators.required, Validators.pattern(this.numRegex)],
      updateOn: "change"
    });

    this.ctnKindCtrl = this.fb.control("", Validators.required);
    this.taskQtyCtrl = this.fb.control(0);
    this.headQtyCtrl = this.fb.control("");
    this.reqQtyUpperBoundCtrl = this.fb.control("");
    this.reqQtyLowerBoundCtrl = this.fb.control("");

    this.coilNo1Ctrl = this.fb.control("", Validators.required);
    this.coilNo2Ctrl = this.fb.control("");
    this.coilNo3Ctrl = this.fb.control("");

    this.lastCtnCtrl = this.fb.control("N", Validators.required);
    this.luoNameCtrl = this.fb.control("", Validators.required);
    this.jobEndCodeCtrl = this.fb.control(false, Validators.required);


    this.form1 = this.fb.group({
      jobNo: this.jobNoCtrl,
      luoCode: ["", Validators.required],
      ctnNo: [""],
      procNo: ["A1"],  // A1
      mchNo: [""],
      luoName: this.luoNameCtrl,
      operator: [""],

      makeWt: this.makeWtCtrl,
      ctnKind: this.ctnKindCtrl,

      lastCtn: this.lastCtnCtrl,
      jobEndCode: this.jobEndCodeCtrl,

      coilNo1: this.coilNo1Ctrl,
      coilNo2: this.coilNo2Ctrl,
      coilNo3: this.coilNo3Ctrl,

      endCode1: ["N", Validators.required],
      endCode2: [""],
      endCode3: [""],

      headQty: this.headQtyCtrl,
      reqQtyLowerBound: this.reqQtyLowerBoundCtrl,
      reqQtyUpperBound: this.reqQtyUpperBoundCtrl,
      pdcSize: [""],
      taskQty: this.taskQtyCtrl,
      faultWt: []
    });

    // 顯示 小數點 3位
    this.form1.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        // debounceTime(500),
        filter(v => v.jobNo)
      )
      .subscribe(v => {
        let dp3 = "";

        // 完工數量
        if (!StrUtil.isEmpty(v.taskQty)) {
          dp3 = StrUtil.toDP3(v.taskQty);
          this.taskQtyCtrl.patchValue(dp3, { emitEvent: false });
          //console.log(v.taskQty);
        }

        // 需求量下限
        dp3 = StrUtil.toDP3(v.reqQtyLowerBound);
        this.reqQtyLowerBoundCtrl.patchValue(dp3, { emitEvent: false });

        // 需求量上限
        dp3 = StrUtil.toDP3(v.reqQtyUpperBound);
        this.reqQtyUpperBoundCtrl.patchValue(dp3, { emitEvent: false });

        // 累積數量
        dp3 = StrUtil.toDP3(v.headQty);
        this.headQtyCtrl.patchValue(dp3, { emitEvent: false });
      });

  }

  /**
   * tricky for MAT-CHECKBOX, null/undefined -> false, others true 
   * @param jobNo 
   * @param luoCode 
   * @param ctnNo 
   */
  fetch(jobNo, luoCode, ctnNo) {
    this.spc0202mSvc.getSpcWrkHeadPad(jobNo, luoCode, ctnNo)
      .subscribe(api => {
        if (api.data) {
          this.dto = { ...api.data };
          
          this.dto.jobEndCode = (this.dto.jobEndCode === "Y") ? true : false;
          this.form1.patchValue(this.dto);

          // SVG 圖
          this.prepareProgressDate(this.dto, 0, true);

        } else {
          this.doClear();
          const msg = `${jobNo} ${luoCode} ${ctnNo} 資料已不存在,請重新查詢!`;
          this.error(msg);
        }
      });
  }

  // taskQty: 此次完工數量
  private async prepareProgressDate(dto: WrkHeadDto, taskQty: number, isQuery: boolean) {
    // 甜甜圈 - donut 
    //const _headQty = new Decimal(this.dto.headQty).toNumber();

    let accQty: number = null;

    // 查詢
    if (isQuery) {
      const netQty2CtnNo =
        await this.spc0202mSvc.getJobNetQty2CtnNo(dto)
          .pipe(
            map(api => api.data)
          )
          .toPromise();

      accQty = new Decimal(netQty2CtnNo).toDP(3).toNumber();
    } else {
      const netQty
        = await this.spc0202mSvc.getJobNetQty(dto)
          .pipe(
            map(api => api.data)
          ).toPromise();

      accQty = new Decimal(netQty + taskQty).toDP(3).toNumber();
    }


    this.accQty = accQty;  // for donut

    let donutValue = (accQty / this.dto.reqQty) * 100;
    if (donutValue > 100) {
      donutValue = 100;
    }

    this.donutSingle = { value: new Decimal(donutValue).toDP(0).toNumber() };

    // console.log("headQty: " + _headQty);
    // console.log("taskQty: " + _taskQty);
    // console.log("mia: " + this.donutSingle.value);

    // 進度橫條圖 - progress bar

    this.progressData = {
      lowerBoundQty: dto.reqQtyLowerBound,
      reqQty: dto.reqQty,
      upperBoundQty: dto.reqQtyUpperBound,
      headQty: new Decimal(accQty).toDP(0).toNumber(),
    };
  }

  /**
   * 新增  
   */
  doCreate() {

    if (this.form1.invalid) {
      Object.values(this.form1.controls)
        .filter(ctrl => ctrl.invalid)
        .forEach(ctrl => {
          ctrl.markAsDirty();
        });

      this.error("必要欄位或資料有錯誤,請先更正!");
      return;
    }

    // > 0 檢查
    const makeWt: number = parseFloat(this.makeWtCtrl.value) || 0.00;
    if (makeWt <= 0) {
      this.showSnackbar("請輸入毛重!", "通知", 3000);
      return false;
    }

    //michaelsun 2022/05/27
    else if(makeWt > 1200) {
      //this.showSnackbar("毛重不可大於 1200!", "通知", 3000);
      this.makeWtCtrl.markAsDirty();
      this.makeWtCtrl.setErrors({ error: true });
      this.error("毛重不可大於 1200!");
      return false;
    }

    // > 0 檢查 //檢查完工數量是否為零 michaelsun
    const taskQty: number = parseFloat(this.taskQtyCtrl.value) || 0.00;
    if (taskQty <= 0) {
      this.showSnackbar("完工數量不得為0!", "通知", 3000);
      return false;
    }
    //---------------------------------------------------------------------
   
    this.dto = {
      ...this.dto,
      ...this.form1.value,
      jobEndCode: this.jobEndCodeCtrl.value ? "Y" : "N"
    };

    this.spc0202mSvc.create(this.dto)
      .subscribe(api => {
        if (api.data) {
          this.dto = { ...api.data };
          const msg = `${this.dto.jobNo}-${this.dto.luoCode}-${this.dto.ctnNo} 新增成功.`;

          this.info(msg)
            .afterClosed()
            .subscribe(ignore => {
              this.doClear();
            });
        } else {
          this.error("新增資料失敗-" + api.error.desc);
        }
      });

  }

  /**
   * 刪除 
   */
  doDelete() {
    const dialogRef = this.confirm("確定刪除此筆資料?");

    dialogRef.afterClosed()
      .pipe(
        filter(yn => yn && (yn === "Y")),
        switchMap(yn => this.spc0202mSvc.delete(this.dto))
      )
      .subscribe(api => {
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
            const { jobNo, luoCode, ctnNo } = this.dtoList[this.rowIndex];
            this.fetch(jobNo, luoCode, ctnNo);
          }

        } else {
          this.error("刪除失敗-" + api.error.desc);
        }

      });
  }

  // call after allowed
  openQuery() {
    const dialogRef = this.dialog.open(Spc0202mQueryComponent, this.dialogConfig);

    dialogRef.afterClosed()
      .subscribe(api => {
        if (api.data) {
          this.currMode = CrudMode.Normal;

          this.dtoList = [...api.data];
          this.rowCount = this.dtoList.length;
          this.showSnackbar(this.rowCount + " 筆資料", "查詢", 3000);

          if (this.rowCount > 0) {
            this.rowIndex = 0;

            const { jobNo, luoCode, ctnNo } = this.dtoList[this.rowIndex];
            this.fetch(jobNo, luoCode, ctnNo);

          } else {                  // not found 
            this.rowIndex = -1;
            this.doClear();
            this.currMode = CrudMode.Normal;
          }

          this.form1.disable();   // simulate readonly
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
  // 同時進入  新增
  doClear() {
    // reset value
    this.dto = new WrkHeadDto();
    this.dto.webYn = "Y";
    this.dto.procNo = "A1";
    this.dto.lastCtn = "N";
    this.dto.ctnKind = "S";  // default
    this.dto.luoCode = "";

    this.dto.jobEndCode = false;   // checkbox, null, undefined --> false
    this.dto.endCode1 = "N";

    this.currMode = CrudMode.Create;

    this.dtoList = [];
    this.rowCount = 0;
    this.rowIndex = -1;

    this.form1.reset(this.dto, { emitEvent: false });

    this.form1.enable();
  }

  // 表格
  doTable() {
    const config = { ...this.dialogConfig, position: { top: "0px" } };

    const dialogRef = this.dialog.open(Spc0202mTableDialogComponent, config);
    dialogRef.componentInstance.wrkHeadPadList = this.dtoList;

    dialogRef.afterClosed()
      .pipe(
        filter(ret => ret instanceof Object)
      )
      .subscribe(dto => {
        this.rowIndex = this.dtoList.findIndex(e =>
          e.jobNo === dto.jobNo &&
          e.luoCode === dto.luoCode &&
          e.ctnNo === dto.ctnNo
        );

        this.fetch(dto.jobNo, dto.luoCode, dto.ctnNo);

      });
  }

  /**
   * 批號 barcode scan
   */
  scanJobNo() {
    this.scanBarcode()
      .then(barcode => {
        this.jobNoCtrl.setValue(barcode);
        this.checkJobNo();
      });
  }

  /**
   * 檢查 jobNo 存在否?  when enter or blur
   * louCode 由後端 db function 決定
   */
  checkJobNo() {
    const jobNo = this.jobNoCtrl.value;

    if (StrUtil.isEmpty(jobNo)) {
      return;
    }

    if (this.openCount !== 0) return;

    this.spc0202mSvc.checkJobNo(jobNo)
      .subscribe(api => {
        if (api.data) {
          const { makeWt, ctnKind } = this.form1.value;  // backup 舊值

          this.dto = { ...api.data, makeWt, ctnKind };
          this.dto.jobEndCode = (this.dto.jobEndCode === "Y") ? true : false;

          this.form1.patchValue(this.dto);
          

          // for SVG
          this.prepareProgressDate({ ...this.dto }, 0, false);

        } else {
          const jobNo = this.jobNoCtrl.value;
          this.doClear();

          this.jobNoCtrl.setValue(jobNo);
          this.jobNoCtrl.markAsDirty();
          this.jobNoCtrl.setErrors({ error: true });

          // 避免 dialog 開啟2次,  enter with err, show dialog and blur fire...
          if (this.openCount === 0) {
            this.openCount++;
            const msg = jobNo + " " + api.error.desc;

            this.error(msg).afterClosed()
              .subscribe(x => this.openCount = 0);
          }
        }
      });

  }

  // barcode
  scanCoilNo1() {
    this.scanBarcode()
      .then(barcode => {
        this.coilNo1Ctrl.setValue(barcode);
        this.getHeaDrwStok(this.coilNo1Ctrl.value, "coilNo1");
      });

  }

  // barcode
  scanCoilNo2() {
    this.scanBarcode()
      .then(barcode => {
        this.coilNo2Ctrl.setValue(barcode);
        this.getHeaDrwStok(this.coilNo2Ctrl.value, "coilNo2");
      });
  }

  // barcode
  scanCoilNo3() {
    this.scanBarcode()
      .then(barcode => {
        this.coilNo3Ctrl.setValue(barcode);
        this.getHeaDrwStok(this.coilNo3Ctrl.value, "coilNo3");
      });
  }


  // 線材卷號 
  // coilNo2, coilNo3,  not required
  getHeaDrwStok(coilNo: string, ctrlName: string) {
    if (ctrlName === "coilNo1") {
      if (StrUtil.isEmpty(coilNo)) {
        this.showSnackbar("線材卷號未輸入!", "", 3000);
        this.coilNo1Ctrl.markAsDirty();
        this.coilNo1Ctrl.setErrors({ error: true });
        return;
      }
    }

    // for coilNo2 when empty
    if (StrUtil.isEmpty(coilNo)) {
      return;
    }

    this.spc0202mSvc.getHeaDrwStok(coilNo)
      .subscribe(api => {
        if (api.data) {
          const heaWrkStok = { ...api.data };
          this.dto.luoName = heaWrkStok.luoNo;   // ATTN
          this.luoNameCtrl.setValue(this.dto.luoName);
        } else {
          this.dto.luoName = "";
          this.luoNameCtrl.setValue(this.dto.luoName);

          const ctrl = (ctrlName === "coilNo1") ? this.coilNo1Ctrl : this.coilNo2Ctrl;
          ctrl.markAsDirty();
          ctrl.setErrors({ error: true });

          this.showSnackbar("線材卷號: " + coilNo + " 不存在!", "", 3000);
        }
      });
  }

  // 計算桶數量前檢查
  // ** 毛重, 尾桶, 桶別  改變時需要檢查 **
  preCheck(): boolean {
    console.log("preCheck...");

    if (this.jobNoCtrl.invalid) {
      this.showSnackbar("批號不存在!", "通知", 3000);
      return false;
    }

    if (this.ctnKindCtrl.invalid) {
      this.showSnackbar("請選擇桶別, 以計算完工數量!", "通知", 3000);
      return false;
    }

    if (this.makeWtCtrl.invalid) {
      this.showSnackbar("請輸入毛重!", "通知", 3000);
      return false;
    }

    const makeWt: number = parseFloat(this.makeWtCtrl.value) || 0.00;
    if (makeWt <= 0) {
      this.showSnackbar("請輸入毛重!", "通知", 3000);
      return false;
    }

    //michaelsun 2022/05/27
    else if(makeWt > 1200) {
      //this.showSnackbar("毛重不可大於 1200!", "通知", 3000);
      this.makeWtCtrl.markAsDirty();
      this.makeWtCtrl.setErrors({ error: true });
      this.error("毛重不可大於 1200!");
      return false;
    }

    return true;

  }

  /**
   * 毛重輸入 | 桶別改變 -> 影響 本次完工數量
   */
  checkMakeWt() {
    console.log("checkMakeWt");

    if (!this.preCheck()) return;

    this.dto = { ...this.dto, ...this.form1.value };

    // 本次完工數量
    this.spc0202mSvc.getTaskQty$(this.dto)
      .subscribe(taskQty => {
        this.dto.taskQty = taskQty
        this.taskQtyCtrl.setValue(taskQty);

        // SVG, 本次完工數量改變, 加入累計數量 for 圖形顯示, 畫面不動.
        this.prepareProgressDate(this.dto, taskQty, false);
      });


    // 取得各種狀況
    this.spc0202mSvc.getStatus$(this.dto)
      .subscribe(status => {
        // 是否尾桶 ?
        this.dto.lastCtn = status.isLastCtn ? "Y" : "N";
        this.lastCtnCtrl.setValue(this.dto.lastCtn, { emitEvent: false });

        // 不可結案, notice
        if (status.notCompleted && this.dto.jobEndCode) {
          this.dto.jobEndCode = false;
          this.jobEndCodeCtrl.setValue(this.dto.jobEndCode);
          this.error("不可結案.");
          return;
        }

        // force 結案
        if (status.forceCompleted) {
          this.dto.jobEndCode = true;
          this.dto.lastCtn = "Y";

          this.jobEndCodeCtrl.setValue(this.dto.jobEndCode);
          this.lastCtnCtrl.setValue(this.dto.lastCtn);
          return;
        }

        // 可結案, 詢問
        if (status.canCompleted) {
          this.confirm("可以進行批號結案, 確定結案?").afterClosed()
            .subscribe(yn => {
              if (yn == "Y") {
                this.dto.jobEndCode = true;
                this.dto.lastCtn = "Y";
              } else {
                this.dto.jobEndCode = false;
                this.dto.lastCtn = "N";
              }
              this.jobEndCodeCtrl.setValue(this.dto.jobEndCode);
              this.lastCtnCtrl.setValue(this.dto.lastCtn);
            })
        }

      }); // subscribe

  } // function

  // 桶別改變
  onCtnKindChange(evt: MatSelectChange) {
    if (!this.preCheck()) return;
    this.checkMakeWt();
  }

  /**
   * 尾桶改變 
   * @param evt 
   * todo
   */
  onLastCtnChange(evt: MatRadioChange) {
    if (!this.preCheck()) return;

    const lastCtn: string = evt.value;
    const jobEndCode: boolean = this.jobEndCodeCtrl.value;

    if (lastCtn === "N" && jobEndCode) {
      this.error("批號已完工, 必須是尾桶!")
        .afterClosed()
        .subscribe(x => {
          this.dto.lastCtn = "Y";
          this.lastCtnCtrl.setValue(this.dto.lastCtn);
        });
    }

  }

  /**
   * 批號完工改變
   * 1. 批號累計總生產量 未達需求量, 已到達需求量下限, 而User輸入N 時， 再次詢問User：可進行批號結案
   * 2. 當批號累計總生產量 未達需求量, 未到達需求量下限，禁止做批號結案
   * 
   * @param evt 
   */
  onJobEndCodeChange(evt: MatCheckboxChange) {
    if (!this.preCheck()) return;

    this.dto = { ...this.dto, ...this.form1.value };

    const status$ = this.spc0202mSvc.getStatus$(this.dto);

    if (evt.checked) {  // 勾選-完工, 但尚不可結案
      status$
        .pipe(
          filter(status => status.notCompleted),
          switchMap(x => this.error("尚不可結案, 累計數量未達需求量下限!").afterClosed())
        )
        .subscribe(x => {
          this.dto.jobEndCode = false;
          this.jobEndCodeCtrl.setValue(this.dto.jobEndCode);
        });

    } else {  // 沒勾選-未完工
      status$
        .subscribe(status => {
          // 強迫結案
          if (status.forceCompleted) {
            this.dto.jobEndCode = true;
            this.dto.lastCtn = "Y"

            this.jobEndCodeCtrl.setValue(this.dto.jobEndCode);
            this.lastCtnCtrl.setValue(this.dto.lastCtn);

            this.info("累計數量已達需求量上限, 強制結案!");
            return;
          }

          // 可結案,詢問
          if (status.canCompleted) {
            this.confirm("可以進行批號結案, 確定結案?").afterClosed()
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
          }

        });

    } // if 

  } // function


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

    const { jobNo, luoCode, ctnNo } = this.dtoList[this.rowIndex];
    this.fetch(jobNo, luoCode, ctnNo);
  }

  // 下一筆
  doNext() {
    this.rowIndex++;
    if (this.rowIndex > (this.dtoList.length - 1)) {
      this.rowIndex = this.dtoList.length - 1;
      this.showSnackbar("最後筆", "", 3000);
      return;
    }

    const { jobNo, luoCode, ctnNo } = this.dtoList[this.rowIndex];
    this.fetch(jobNo, luoCode, ctnNo);
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
        break;

      case CrudMode.Query:      // 查詢
        if (this.isQuery || this.isNormal) {
          return false;
        } else {
          return true;
        }
        break;

      case CrudMode.Update:     // 修改
        if ((this.isUpdate || this.isNormal)) {
          return false;
        } else {
          return true;
        }
        break;

      case CrudMode.Normal:
        if (this.rowCount > 0 && this.isNormal) {
          return false;
        } else {
          return true;
        }
        break;

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
    console.log(this.form1.value);
  }

  sayHello() {
    alert("hello");
  }

} // class
