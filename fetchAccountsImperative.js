import { LightningElement, track } from 'lwc';
import fetchAccounts from '@salesforce/apex/fetchAccountsImperative.fetchAccounts';

export default class FetchAccountsImperative extends LightningElement {

   @track accounts;
    @track error;

    // Button click handler
    handleFetch() {
        fetchAccounts()
            .then(result => {
                this.accounts = result;
                this.error = undefined;
            })
            .catch(error => {
                this.error = error.body.message;
                this.accounts = undefined;
            });
    }
}