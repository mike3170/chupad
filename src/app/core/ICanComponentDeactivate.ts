/**
 * any component must implements this
 * if needs unsaveguard 
 */
export interface ICanComponentDeactivate {
  canDeactivate: () => any;
}