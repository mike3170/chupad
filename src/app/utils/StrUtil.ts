import Decimal from "decimal.js";
import { DecimalPipe } from "@angular/common";

export class StrUtil {
  private static decPipe = new DecimalPipe("en-Us");

  static isEmpty(v: string | number): boolean {
    if (v == undefined || v == null) {
      return true;
    }

    if (typeof v == "string") {
      return (v.replace(/\s/g, "").length > 0 ? false : true);
    } else {
      return isNaN(v) ? true : false;
    }

  }

  // return String ex. 123.320
  static toDP3(input: string | number): string {
    let num: number = 0.000;

    if (typeof input === "string") {
      const noComma = input.replace(/,/g, "");
      num = parseFloat(noComma);
    } else {
      num = input;
    }

    return this.decPipe.transform(num, "1.3-3");
  }

} // end class



