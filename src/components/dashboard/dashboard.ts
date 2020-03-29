import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({
  template: "./dashboard.html",
  components: {}
})
export default class Dashboard extends Vue {
  // Data property
  public myDataProperty?: string;

  // Lifecycle hook
  mounted() {
    console.log("The About component was mounted");
  }
}
