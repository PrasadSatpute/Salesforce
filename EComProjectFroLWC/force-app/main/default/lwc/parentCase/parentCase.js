import { LightningElement, api, track, wire } from 'lwc';
import getUsers from '@salesforce/apex/UserController.getUsers';
import createCaseRecord from '@salesforce/apex/CaseController.createCaseRecord';
import updateCaseRecord from '@salesforce/apex/CaseController.updateCaseRecord';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class ParentCase extends LightningElement {
    @track userOptions = [];
    @track selectedUserId;
    @track isModalOpen = false;

    @track caseSubject = '';
    @track caseDescription = '';
    @track casePriority = 'Medium';

    @track webEmail = '';
    @track webName = '';
    @track webPhone = '';

    @track caseList = []; // List of created cases

    @api recordId; // Account Id to associate case with

    @track updatedCaseData = {}; // Temporarily stores updated data from child


    // Priority options for combobox
    priorityOptions = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
    ];

    // Fetch users from the UserController Apex class
    @wire(getUsers)
    wiredUsers({ error, data }) {
        if (data) {
            // Map the user data to a format compatible with lightning-combobox options
            this.userOptions = data.map(user => {
                return { label: user.Name, value: user.Id };
            });
        } else if (error) {
            console.error('Error retrieving users:', error);
        }
    }

    // Handle user selection from the dropdown
    handleUserSelection(event) {
        this.selectedUserId = event.detail.value;
    }

    openModal() {
        // if (this.selectedUserId) {
        //     console.log('Selected ID Is Getting : '+this.selectedUserId);
        //     // this.isModalOpen = true;
        // } else {
        //     alert('Please select a user first.');
        // }
    }

    closeModal() {
        this.isModalOpen = false;
    }

    handleInputChange(event) {
        const field = event.target.dataset.id;
        if (field === 'subject') {
            this.caseSubject = event.target.value;
        } else if (field === 'description') {
            this.caseDescription = event.target.value;
        } else if (field === 'priority') {
            this.casePriority = event.target.value;
        }else if (field === 'WebEmail') {
            this.caseDescription = event.target.value;
        } else if (field === 'WebName') {
            this.casePriority = event.target.value;
        }else if (field === 'WebPhone') {
            this.caseDescription = event.target.value;
        }
    }

    handleSaveCase() {
        // Call Apex method to create a case with the selected user as owner and link to Account
        createCaseRecord({
            subject: 'Test New',
            description: 'From Background',
            priority: 'High',
            ownerId: this.selectedUserId,
            accountId: this.recordId,
            webEmail: this.updatedCaseData.WebEmail,
            webName: this.updatedCaseData.WebName,
            webPhone: this.updatedCaseData.WebPhone
        })
        .then((result) => {
            this.closeModal();
            this.caseSubject = '';
            this.caseDescription = '';
            this.casePriority = 'Medium';
            this.caseList.push(result);
            // Display success message or update UI
            // alert('Case created successfully');
            const event = new ShowToastEvent({
                title: 'Case Created',
                message: 'Case Created',
                variant: 'success',
                mode: 'dismissable'
            });
            this.dispatchEvent(event);
        })
        .catch(error => {
            console.error('Error creating case:', error);
            const evt = new ShowToastEvent({
                title: 'Toast Error',
                message: 'Some unexpected error',
                variant: 'error',
                mode: 'dismissable'
            });
            this.dispatchEvent(evt);
        });
    }

    handleSaveUpdatedCase() {
        if (this.updatedCaseData.Id) {
            console.log('Updating case with Id:', this.updatedCaseData.Id); // Debug log
            updateCaseRecord({
                caseId: this.updatedCaseData.Id,
                subject: this.updatedCaseData.Subject,
                description: this.updatedCaseData.Description,
                priority: this.updatedCaseData.Priority,
                webEmail: this.updatedCaseData.WebEmail,
                webName: this.updatedCaseData.WebName,
                webPhone: this.updatedCaseData.WebPhone
            })
            .then(result => {
                console.log('Case update successful:', result); // Success log
                const index = this.caseList.findIndex(caseItem => caseItem.Id === result.Id);
                if (index !== -1) {
                    this.caseList[index] = result;
                }
                this.caseList = [...this.caseList];
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Case Updated',
                    message: 'Case was updated successfully',
                    variant: 'success'
                }));

                // Dispatch an event to signal the child component to exit edit mode
                this.template.querySelector('c-child-case').exitEditMode();
            })
            .catch(error => {
                console.error('Error updating case:', error);
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'An error occurred while updating the case',
                    variant: 'error'
                }));
            });
        } else {
            console.warn('No case ID found. Cannot update case.');
        }
    }
    

    resetCaseFields() {
        this.caseSubject = '';
        this.caseDescription = '';
        this.casePriority = 'Medium';
        this.webEmail = '';
        this.webName = '';
        this.webPhone = '';
    }
    

    handleCaseUpdate(event) { 

        // Store the updated case data received from child
        this.updatedCaseData = event.detail;
        
        const updatedCase = event.detail;

        // Iterate over caseList to find and update the case
        this.caseList.forEach((caseItem, index) => {
            if (caseItem.Id === updatedCase.Id) {
                // Replace the case in the list with the updated case details
                this.caseList[index] = updatedCase;
            }
        });

        // Notify LWC that caseList has been updated
        this.caseList = [...this.caseList];
    }   

    // Initiate case creation (placeholder function for now)
    handleInitiateCase() {
        // Logic to create a case with the selected user as owner will go here
        console.log('Initiate Case with User ID:', this.selectedUserId);
    }

    showToast() {
        const event = new ShowToastEvent({
            title: 'Case Created',
            message: 'Case Created',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(event);
    }
}