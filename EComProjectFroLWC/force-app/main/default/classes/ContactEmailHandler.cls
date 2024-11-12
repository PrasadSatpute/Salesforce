public with sharing class ContactEmailHandler {

    // Fetch Related Contacts for an Account
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRelatedContacts(Id accountId) {
        return [SELECT Id, FirstName, Email, Phone FROM Contact WHERE AccountId = :accountId];
    }

    // Fetch Available Email Templates
    @AuraEnabled(cacheable=true)
    public static List<EmailTemplate> getEmailTemplates() {
        return [SELECT Id, Name FROM EmailTemplate WHERE DeveloperName != NULL];
    }

    // Send Emails to Selected Contacts
    @AuraEnabled
    public static void sendEmail(Id contactIds, Id templateId) {

        List<Contact> contacts = [SELECT Id, Email FROM Contact WHERE Id  =:contactIds];
        EmailTemplate emailTemplate = [SELECT Id, DeveloperName FROM EmailTemplate WHERE Id = :templateId LIMIT 1];

        if (contacts.isEmpty()) {
            throw new AuraHandledException('No valid contacts found.');
        }

        List<Messaging.SingleEmailMessage> emailsToSend = new List<Messaging.SingleEmailMessage>();
        for (Contact c : contacts) {
            if (c.Email != null) {
                System.debug(c);
                Messaging.SingleEmailMessage email = new Messaging.SingleEmailMessage();
                email.setTemplateId(emailTemplate.Id);
                email.setTargetObjectId(c.Id);
                email.setSaveAsActivity(false);
                emailsToSend.add(email);
            }
        }
        
        if (!emailsToSend.isEmpty()) {
            Messaging.sendEmail(emailsToSend);
        } else {
            throw new AuraHandledException('No valid email addresses found for the selected contacts.');
        }
    }

    public ContactEmailHandler() {

    }
}