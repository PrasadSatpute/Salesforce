import getEmailTemplates from '@salesforce/apex/ContactEmailHandler.getEmailTemplates';
import getRelatedContacts from '@salesforce/apex/ContactEmailHandler.getRelatedContacts';
import { LightningElement, api, wire } from 'lwc';
import sendEmail from '@salesforce/apex/ContactEmailHandler.sendEmail';

export default class ContactList extends LightningElement {
    @api recordId; // Account Id
    contacts = [];
    @api selectedContacts = [];
    emailTemplates = [];
    columns = [
        { label: 'Name', fieldName: 'FirstName' },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Phone', fieldName: 'Phone' },
        { type: 'checkbox', fieldName: 'selected', label: 'Select' }
    ];
    @api isModalOpen = false;

    // Fetch Related Contacts
    @wire(getRelatedContacts, { accountId: '$recordId' })
    wiredContacts({ data, error }) {
        if (data) {
            this.contacts = data.map(contact => ({ ...contact, selected: false }));
        } else if (error) {
            console.error('Error fetching contacts: ', error);
        }
    }

    // Fetch Email Templates
    @wire(getEmailTemplates)
    wiredTemplates({ data, error }) {
        if (data) {
            this.emailTemplates = data;
        } else if (error) {
            console.error('Error fetching email templates: ', error);
        }
    }

    handleRowAction(event) {
        
        const selectedRows = event.detail.selectedRows;
        // this.selectedContacts = selectedRows.map(row => ({id: row.Id}));

        console.log(selectedRows);

        if (selectedRows.length > 0) {
            
            this.selectedContacts = selectedRows[0].Id;
            
        } else {
            console.log('No rows selected.');
        }
    }
    

    // Fetch available email templates
    @wire(getEmailTemplates)
    wiredEmailTemplates({ error, data }) {
        if (data) {
            this.templateOptions = data.map(template => ({
                label: template.Name,
                value: template.Id
            }));
        } else if (error) {
            console.error('Error fetching email templates', error);
        }
    }

    // Handle changes in the email template selection
    handleTemplateChange(event) {
        this.selectedTemplate = event.target.value;
    }


    // Handle NEXT Button Click
    handleNextClick() {
        if (this.selectedContacts.length > 0) {

            this.isModalOpen = true;
        } else {
            alert('Please select at least one contact.');
        }
        
    }

    // Handle Popup Close
    handleClosePopup() {
        this.isModalOpen = false;
    }

    handleSubmit() {
        console.log('List All Selected Contact'+this.selectedContacts);
        try {
            console.log(this.selectedContacts,this.selectedTemplate);
            // Attempt to send the email
            sendEmail({ 
                contactIds: this.selectedContacts, 
                templateId: this.selectedTemplate 
            })
            .then(() => {
                alert('Emails sent successfully!');
                this.isModalOpen = false;
            })
            .catch(error => {
                // Handle any errors that occur within the promise chain
                console.error('Error sending emails: ', error);
                alert('Error sending emails.');
            });
        } catch (error) {
            // Handle any synchronous errors
            console.error('Unexpected error: ', error);
            alert('An unexpected error occurred.');
        }
    }
}