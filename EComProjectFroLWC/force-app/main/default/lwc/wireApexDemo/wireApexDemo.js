import { api, LightningElement, wire } from 'lwc';
import getContactsByAccountId from '@salesforce/apex/contactController.getContactsByAccountId';
import { getRecord } from 'lightning/uiRecordApi';

export default class WireApexDemo extends LightningElement {
    @api recordId;
    // contacts;
    // error;

    @wire(getContactsByAccountId,{accountId: '$recordId'})
    contacts;

    // Function with @wire
    // @wire(getContactsByAccountId,{accountId: '$recordId'})
    // wireContact({error,data})
    // {
    //     if(data)
    //     {
    //         this.contacts = data;
    //         this.error = undefined;
    //     }
    //     else if(error)
    //     {
    //         this.contacts = undefined;
    //         this.error = error;
    //     }
    // }

    @wire(getRecord, {recordId: '$recordId', fields: 'Account.Name'})
    record;

    get name()
    {
        return this.record.data.fields.Name.value;
    }
}