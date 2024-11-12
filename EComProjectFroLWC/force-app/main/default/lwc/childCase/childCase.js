import { LightningElement, api, track } from 'lwc';

export default class ChildCase extends LightningElement {
    @api cases = []; // List of cases passed from parent
    @track isEditModalOpen = false;
    @track caseToEdit = {}; // Case currently being edited

    @api caseId; // Public property to receive data from Parent
    @track caseFields = {}; // Track case data here

    priorityOptions = [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' }
    ];

    handleViewCase(event) {
        const caseId = event.target.dataset.id;
        this.caseToEdit = this.cases.find(caseRecord => caseRecord.Id === caseId);
        this.isEditModalOpen = true;
    }

    handleFieldChange(event) {
        const field = event.target.dataset.id;
        this.caseToEdit = { ...this.caseToEdit, [field]: event.target.value };
    }

    closeEditModal() {
        this.isEditModalOpen = false;
    }

    handleSave() {
        // this.isEditModalOpen = false;
        this.dispatchEvent(new CustomEvent('updatecase', { detail: this.caseToEdit }));
        // Close the modal after saving
        this.closeEditModal();
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
}