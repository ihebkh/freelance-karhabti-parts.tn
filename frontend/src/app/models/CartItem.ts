import { CarPart } from "./CarPart";
import { AccPart } from "./AccPart";

export interface CartItem {
  part: CarPart | AccPart;
  quantity: number;
}
