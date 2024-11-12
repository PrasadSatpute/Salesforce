import { LightningElement, api, track, wire } from 'lwc';
import getUsers from '@salesforce/apex/UserController.getUsers';
import createCaseRecord from '@salesforce/apex/CaseController.createCaseRecord';

export default class ParentCase extends LightningElement {
    @track userOptions = [];
    @track selectedUserId;
    @track isModalOpen = false;

    @track caseSubject = '';
    @track caseDescription = '';
    @track casePriority = 'Medium';

    @track caseList = []; // List of created cases

    @api recordId; // Account Id to associate case with

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
        if (this.selectedUserId) {
            console.log('Selected ID Is Getting : '+this.selectedUserId);
            this.isModalOpen = true;
        } else {
            alert('Please select a user first.');
        }
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
        }
    }

    handleSaveCase() {
        // Call Apex method to create a case with the selected user as owner and link to Account
        createCaseRecord({
            subject: this.caseSubject,
            description: this.caseDescription,
            priority: this.casePriority,
            ownerId: this.selectedUserId,
            accountId: this.recordId
        })
        .then((result) => {
            this.closeModal();
            this.caseSubject = '';
            this.caseDescription = '';
            this.casePriority = 'Medium';
            this.caseList.push(result);
            // Display success message or update UI
            alert('Case created successfully');
        })
        .catch(error => {
            console.error('Error creating case:', error);
        });
    }

    handleCaseUpdate(event) {
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
}