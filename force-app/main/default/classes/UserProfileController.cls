public with sharing class UserProfileController {
    @AuraEnabled(cacheable=true)
    public static String getUserProfile() {
        Id profileId = UserInfo.getProfileId();
        // Récupérer le nom du profil en utilisant ProfileId
        Profile userProfile =  UserProfileSelector.getUserProfileById(profileId);

        return userProfile.Name; // Retourner le nom du profil
    }

}

