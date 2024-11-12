public with sharing class UserController {

    @AuraEnabled(cacheable=true)
    public static List<User> getUsers() {
        try {
            // Fetch active users and select necessary fields
            return [SELECT Id, Name FROM User WHERE IsActive = true ORDER BY Name];
        } catch (Exception e) {
            // Handle any exceptions and throw an AuraHandledException to pass the error message back to LWC
            throw new AuraHandledException('An error occurred while retrieving users: ' + e.getMessage());
        }
    }

    public UserController() {

    }
}