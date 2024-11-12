import { api, LightningElement } from 'lwc';

export default class Child extends LightningElement {
    
    // uppercaseItemName = '';

    // @api
    // get itemName() {
    //     return this.uppercaseItemName;
    // }
    
    // set itemName(value) {
    //     this.uppercaseItemName = value.toUpperCase(); // Call toUpperCase as a method
    // }

    // ---------------------------------------

    // Private property becouse it not annoted with @api
    // firstName = '';

    // ---------------------------------------
    
    // Public property becouse it annoted with @api decoreator
    @api firstName = '';
}