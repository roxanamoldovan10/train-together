import Vue from 'vue';
import { Component } from 'vue-property-decorator';

@Component({
  template: './find-partner.html',
  components: {},
})
export default class FindPartner extends Vue {
  // Data property
  public myDataProperty?: string;
}
