export class Pair<K, V> {
  private _key: K;
  private _value: V;

  constructor(key: K, value: V) {
    this._key = key;
    this._value = value;
  }

  get key(): K {
    return this._key;
  }
  set key(key: K) {
    this._key = key;
  }

  get value(): V {
    return this._value;
  }
  set value(value: V) {
    this._value = value;
  }

  toString(): string {
    return this._key + " : " + this._value;
  }
}