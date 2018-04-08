import { Controller } from "stimulus";

export default class extends Controller {

  connect() {
    console.log("Hello, Stimulus!", this.element)
  }

  get value() {
    return this.inputTarget.value;
  }
}
