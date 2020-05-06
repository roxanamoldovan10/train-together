import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import { CategoriesGetters } from '../../typings/categories';

const categoriesModule = namespace('categoriesModule');

@Component({
  template: './find-partner.html',
  components: {},
})
export default class FindPartner extends Vue {
  // Data property
  public categories: CategoryObject[] = [];
  public selectedOptions: Array<number> = [];

  @categoriesModule.Getter(CategoriesGetters.GetCategories)
  public getCategories!: CategoryObject[];

  // Lifecycle hook
  mounted() {
    this.categories = this.getCategories;
  }
}
