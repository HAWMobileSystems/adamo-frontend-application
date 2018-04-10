// import { Component } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';

// import { StoreService } from './builder/store.service';

// @Component({
//   selector: 'app-footer',
//   templateUrl: './footer.template.html',
//   providers: [StoreService]
// })

// export class AppFooterComponents {
//   private _route: ActivatedRoute;
//   private _todoStore: StoreService;
//   private currentStatus: string;

//   constructor(todoStore: StoreService, route: ActivatedRoute) {
//     this._todoStore = todoStore;
//     this._route = route;
//     this.currentStatus = '';
//   }

//   public ngOnInit() {
//     this._route.params
//       .map(params => params.status)
//       .subscribe((status) => {
//         this.currentStatus = status || '';
//       });
//   }

//   public removeCompleted() {
//     this._todoStore.removeCompleted();
//   }

//   public getCount() {
//     return this._todoStore.todos.length;
//   }

//   public getRemainingCount() {
//     return this._todoStore.getRemaining().length;
//   }

//   public hasCompleted() {
//     return this._todoStore.getCompleted().length > 0;
//   }
// }
