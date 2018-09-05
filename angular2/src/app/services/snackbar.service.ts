import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import { SnackBarMessage } from './snackBarMessage';
import { IPIM_OPTIONS } from '../modelerConfig.service';

@Injectable()
export class SnackBarService {
  private snackBarMessages: Subject<SnackBarMessage[]> = new Subject<SnackBarMessage[]>();
  private snackBarMessageArray: SnackBarMessage[] = [];
  public snackBarMessages$: Observable<SnackBarMessage[]> = this.snackBarMessages.asObservable();

  public newSnackBarMessage(text: string, color: string) {
    this.snackBarMessageArray.push(new SnackBarMessage(text, color));
    this.snackBarMessages.next(this.snackBarMessageArray);
    //get snackbar HTML element
    const x = document.getElementById('snackbarPage');
     x.className = 'show';
    //show it for 3 seconds
    setTimeout(() => {
        //delete first element after timer
        this.snackBarMessageArray.shift();
        //if there is nothing to show anymore then hide snackbar
        if (this.snackBarMessageArray.length <= 0) {
            x.className = x.className.replace('show', '');
        }
    }, IPIM_OPTIONS.TIMEOUT_SNACKBAR);
  }

  public error(text: string) {
      this.newSnackBarMessage(text, 'red');
  }

  public success(text: string) {
      this.newSnackBarMessage(text, 'limegreen');
  }
}