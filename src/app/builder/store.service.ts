import { Injectable } from '@angular/core';

import { Entry } from './model/entry';

@Injectable()
export class StoreService {
  private entrys : Entry []= [];
  public todos: any;
  private remainingEntries : any ;
  private completedTodos : any;
  constructor() {
    const persistedTodos = JSON.parse(localStorage.getItem('angular2-todos')) || [];

    this.todos = persistedTodos.map((todo : any) => {
      const ret = new Entry(todo.title);
      ret.selected = todo.completed;
      ret.uid = todo.uid;
      return ret;
    });
  }

  public get(state : any) {
    return this.todos.filter((todo : any) => todo.completed === state.completed);
  }

  public allCompleted() {
    return this.todos.length === this.getCompleted().length;
  }

  public setAllTo(completed : boolean) {
    this.todos.forEach((todo : any) => todo.completed = completed);
    this.persist();
  }

  public removeCompleted() {
    this.todos = this.get({ completed: false });
    this.persist();
  }

  public getRemaining() {
    if (!this.remainingEntries) {
      this.remainingEntries = this.get({ completed: false });
    }
    return this.remainingEntries;
  }

  public getCompleted() {
    if (!this.completedTodos) {
      this.completedTodos = this.get({ completed: true });
    }
    return this.completedTodos;
  }

  public toggleCompletion(uid : any) {
    const todo = this._findByUid(uid);

    if (todo) {
      todo.completed = !todo.completed;
      this.persist();
    }
  }

  public remove(uid : any) {
    const todo = this._findByUid(uid);

    if (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
      this.persist();
    }
  }

  public add(title: string) {
    this.todos.push(new Entry(title));
    this.persist();
  }

  public persist() {
    this._clearCache();
    localStorage.setItem('angular2-todos', JSON.stringify(this.todos));
  }

  private _findByUid(uid : any) {
    return this.todos.find((todo: any) => todo.uid === uid);
  }

  private _clearCache() {
    this.completedTodos = null;
    this.remainingEntries = null;
  }
}
