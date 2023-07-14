import { ProgressData } from './../spc/spc0232m/model';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatRadioChange } from '@angular/material/radio';
import { HttpClient } from '@angular/common/http';
import { Api } from '../core/api.model';

import { map, pluck } from 'rxjs/operators';
import { combineLatest, forkJoin } from 'rxjs';

@Component({
  selector: 'app-foo',
  templateUrl: './foo.component.html',
  styleUrls: ['./foo.component.scss']
})
export class FooComponent implements OnInit {
  foo = true;
  form1: FormGroup;

  nameCtrl = new FormControl("Google", Validators.required);
  ageCtrl = new FormControl(18, Validators.required);
  lastCtnCtrl = new FormControl("", {updateOn: "change", validators: [Validators.required]});
  jobEndCodeCtrl = new FormControl("", {updateOn: "change", validators: [Validators.required]});


  constructor(private http: HttpClient , private fb: FormBuilder) {
  }

  ngOnInit() {
    this.form1 = this.fb.group({
      name: this.nameCtrl,
      age: this.ageCtrl,
      lastCtn: this.lastCtnCtrl,
      jobEndCode: this.jobEndCodeCtrl
    }, { updateOn: "blur" });

    //------------------------------------
    const arr: any[] = ["oracle", "google", "apple"];

    const [foo, bar] = arr;
    //console.log(foo);
    //console.log(bar);

    //this.mia(arr);

    const obj = {
      foo: "AAA",
      bar: "VVV",
      mia: "CCC",
    };
    this.dav(obj);

  }

  dav({foo, bar}) {
    console.log(foo);
    console.log(bar);
    

  }

  mia([foo, bar]: string[]) {
    console.log("----------------------");
    
    console.log(foo);
    console.log(bar);

  }

  onLastCtnChange(evt: MatRadioChange) {
    console.log("lastCtn:" + evt.value );
  }

  onJobEndCodeChange(evt: MatCheckboxChange) {
    console.log("jobEndCode:" + evt.checked );
  }

  blur(value) {
    console.log("blur:" + value);
  }

  reset() {
    this.form1.reset();
  }

  disable() {
    this.form1.disable();
  }
  enable() {
    this.form1.enable();
  }

  combine() {
    const foo$ = this.http.get<Api>("http://localhost:8080/api/codmast/T")
      .pipe(
        map(api => api.data["codeName"])
      );

    const bar$ = this.http.get<Api>("http://localhost:8080/api/codmast/S")
      .pipe(
        map(api => api.data["codeName"])
      );

      combineLatest(foo$, bar$)
        .subscribe( ([x, y])=> {
          console.log(x);
          console.log(y);
          
      });
        
  }


  async forkjoin() {
    const foo$ = this.http.get<Api>("http://localhost:8080/api/codmast/T")
      .pipe(
        pluck("data", "codeName")
      );

    const bar$ = this.http.get<Api>("http://localhost:8080/api/codmast/S")
      .pipe(
        map(api => api.data["codeName"])
      );


    const [x, y] = await forkJoin(foo$, bar$).toPromise();
    console.log(x);
    console.log(y);
    

  }






}  // end class
