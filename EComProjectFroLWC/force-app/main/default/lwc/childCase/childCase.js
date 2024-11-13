import { LightningElement, api, track } from 'lwc';

export default class ChildCase extends LightningElement {
    @api cases = []; // List of cases passed from parent
    @track isEditing = false;
    @track caseToEdit = {}; // Case currently being edited

    @api caseId; // Public property to receive data from Parent
    @track caseFields = {}; // Track case data here
    @track selectedCaseId; // To keep track of the currently selected case Id


    priorityOptions = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
    ];

    handleViewCase(event) {
        const caseId = event.target.dataset.id;
        this.selectedCaseId = caseId;
        this.caseToEdit = this.cases.find(caseRecord => caseRecord.Id === caseId);
        // this.isEditModalOpen = true;
        this.isEditing = true;
    }

    handleFieldChange(event) {
        const field = event.target.dataset.id;
        this.caseToEdit = { ...this.caseToEdit, [field]: event.target.value };
        // Dispatch an event with the updated case data
        this.dispatchEvent(new CustomEvent('updatecase', { detail: this.caseToEdit }));
    }

    closeEditModal() {
        // this.isEditModalOpen = false;
    }

    

    cancelEdit() {
        this.isEditing = false;
        this.caseToEdit = {};
        this.selectedCaseId = null;
    }

    // New method to exit edit mode when triggered by the parent component
    @api
    exitEditMode() {
        this.cancelEdit();
    }

    isCaseSelected(caseId) {
        return this.selectedCaseId === caseId;
    }


    handleInputChange(event) {
        // Get the field value and case Id
        const field = event.target.label;
        const value = event.target.value;
        const caseId = event.target.dataset.id;

        // Create an object with updated details
        const updatedCase = {
            Id: caseId,
            [field]: value
        };

        // Fire a custom event to send data back to the parent
        this.dispatchEvent(new CustomEvent('updatecase', {
            detail: updatedCase
        }));
    }

    // handleSave() {
    //     // this.isEditModalOpen = false;
    //     this.dispatchEvent(new CustomEvent('updatecase', { detail: this.caseToEdit }));

    //     // Reset edit state
    //     this.isEditing = false;
    //     this.caseToEdit = {};
    //     this.selectedCaseId = null;

    //     // Close the modal after saving
    //     this.closeEditModal();
    // }
}