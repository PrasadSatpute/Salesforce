import { LightningElement } from 'lwc';

export default class DataBinding extends LightningElement {
    
    firstName = '';
    lastName = '';

    handleChange(event) {
        const field = event.target.name;
        if (field === 'fname') {
            this.firstName = event.target.value;
        } else if (field === 'lname') {
            this.lastName = event.target.value;
        }
    }

    // Getter
    get uppercaseFullName() {
        return `${this.firstName} ${this.lastName}`.toUpperCase();
    }
}