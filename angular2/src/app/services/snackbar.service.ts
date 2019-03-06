import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {Observable} from 'rxjs';
import { SnackBarMessage } from './snackBarMessage';
import { IPIM_OPTIONS } from '../modelerConfig.service';

@Injectable()
export class SnackBarService {
  private snackBarMessages: Subject<SnackBarMessage[]> = new Subject<SnackBarMessage[]>();
  private snackBarMessageArray: SnackBarMessage[] = [];
  public snackBarMessages$: Observable<SnackBarMessage[]> = this.snackBarMessages.asObservable();

  public newSnackBarMessage(text: string, color: string) {
    //get snackbar HTML element
    const snackBarHTML = document.getElementById('snackbarPage');
    if (snackBarHTML) {
        this.snackBarMessageArray.push(new SnackBarMessage(text, color));
        this.snackBarMessages.next(this.snackBarMessageArray);

        //show it for some seconds
        snackBarHTML.className = 'show';
        setTimeout(() => {
            //delete first element after timer
            this.snackBarMessageArray.shift();
            //if there is nothing to show anymore then hide snackbar
            if (this.snackBarMessageArray.length <= 0) {
                const snackBarHTMLdel = document.getElementById('snackbarPage');
                if (snackBarHTMLdel) {snackBarHTMLdel.className = snackBarHTMLdel.className.replace('show', ''); }
            }
        }, IPIM_OPTIONS.TIMEOUT_SNACKBAR);
    }
  }

  public error(text: string) {
      this.newSnackBarMessage(text, 'red');
  }

  public success(text: string) {
      this.newSnackBarMessage(text, 'limegreen');
  }
}