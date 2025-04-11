public with sharing class UserProfileSelector {
    
    public static Profile getUserProfileById(Id profileId) {
        // Exécuter la requête SOQL et retourner le profil
        return [SELECT Name FROM Profile WHERE Id = :profileId LIMIT 1];
    }
}
