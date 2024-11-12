public with sharing class CaseController {

    @AuraEnabled
    public static Case createCaseRecord(String subject, String description, String priority, Id ownerId, Id accountId) {
        Case newCase = new Case(
            Subject = subject,
            Description = description,
            Priority = priority,
            OwnerId = ownerId,
            AccountId = accountId
        );
        insert newCase;
        return newCase;
    }
    
    @AuraEnabled
    public static void updateCase(Case updatedCase) {
        // Logic to update the case record
    }

    public CaseController() {

    }
}