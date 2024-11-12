public with sharing class contactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> getContactsByAccountId(String accountId){
        try {
            return [SELECT Id, FirstName, Email, Phone FROM Contact WHERE AccountId =: accountId WITH SECURITY_ENFORCED];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public contactController() {

    }
}