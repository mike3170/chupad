import  Decimal from  "decimal.js";
import { DecimalPipe } from "@angular/common";

export class MathUtil {
  private decPipe = new DecimalPipe("en-Us");

  static round(value, dp): number {
    let num: number;
    try {
       num = new Decimal(value).toDP(dp).toNumber();
    } catch (error) {
      throw error;
    }
    return num;
  }


} // end class



