import { LightningElement } from 'lwc';

export default class DataBindingQuerySelector extends LightningElement {
    greeting = 'ABC';
    firstName = '';
    lastName = '';
    handleClick(event)
    {
        this.greeting = this.template.querySelector("lightning-input").value;
    }

    handleClickTest(event)
    {
        var input = this.template.querySelector("lightning-input").value;

        input.array.forEach(element => {
            if(element.name === 'fname')
            {
                this.firstName = element.value;
            }
            else
            if(element.name === 'lname')
                {
                    this.lastName = element.value;
                }
        });
    }greeting = 'ABC';
    firstName = '';
    lastName = '';

    handleClick(event) {
        // Update greeting based on the first lightning-input
        this.greeting = this.template.querySelector("lightning-input").value;
    }

    handleClickTest(event) {
        // Select all lightning-input elements and iterate over them
        const inputs = this.template.querySelectorAll("lightning-input");

        inputs.forEach(element => {
            if (element.name === 'fname') {
                this.firstName = element.value;
            } else if (element.name === 'lname') {
                this.lastName = element.value;
            }
        });
    }
}