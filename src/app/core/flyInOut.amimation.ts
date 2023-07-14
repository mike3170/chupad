import { trigger, state, transition, animate, style } from "@angular/animations";


export function flyInout() {
  return trigger("flyInOut", [
    state("in", style({ transform: "translateX(0)" })),
    transition("void => *", [
      style({ transform: "translateX(-100%)" }),
      //animate("500ms cubic-bezier(0.25, 0.8, 0.25, 1)")
      animate("500ms ease-in")
    ]),
    transition("* => void", [
      style({ transform: "translateX(200%)" }),
      animate("500ms ease-out")
    ]),
  ]);

}
