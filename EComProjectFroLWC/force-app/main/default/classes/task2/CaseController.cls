public with sharing class CaseController {

    @AuraEnabled(cacheable=true)
    public static List<Case> getAllCase(String Id) {
        try {
            // Fetch active users and select necessary fields
            return [SELECT Id FROM Case WHERE IsActive = true ORDER BY Name];
        } catch (Exception e) {
            // Handle any exceptions and throw an AuraHandledException to pass the error message back to LWC
            throw new AuraHandledException('An error occurred while retrieving users: ' + e.getMessage());
        }
    }

    @AuraEnabled
    public static Case createCaseRecord(String subject, String description, String priority, Id ownerId, Id accountId, String webEmail, String webName, String webPhone) {
        Case newCase = new Case(
            Subject = subject,
            Description = description,
            Priority = priority,
            OwnerId = ownerId,
            AccountId = accountId,
            SuppliedEmail = webEmail,
            SuppliedName = webName,
            SuppliedPhone = webPhone
        );
        insert newCase;
        return newCase;
    }
    
    @AuraEnabled
    public static Case updateCaseRecord(Id caseId, String subject, String description, String priority, String webEmail, String webName, String webPhone) {
        try {
            Case updatedCase = [SELECT Id, Subject, Description, Priority, SuppliedEmail, SuppliedName, SuppliedPhone FROM Case WHERE Id = :caseId LIMIT 1];
            updatedCase.Subject = subject;
            updatedCase.Description = description;
            updatedCase.Priority = priority;
            updatedCase.SuppliedEmail = webEmail;
            updatedCase.SuppliedName = webName;
            updatedCase.SuppliedPhone = webPhone;
            update updatedCase;
            return updatedCase;
        } catch (Exception e) {
            System.debug('Error updating case: ' + e.getMessage()); // Log the error message
            throw new AuraHandledException('Failed to update case. ' + e.getMessage());
        }
    }


    public CaseController() {

    }
}