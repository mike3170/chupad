export class Api {
  status: string;
  data?: any;
  error?: { code: number, desc: string }
  constructor(status: string, data: any, error?: { code: number, desc: string }) {
    this.status = status;;
    this.data = data;
    this.error = error;
  }
}