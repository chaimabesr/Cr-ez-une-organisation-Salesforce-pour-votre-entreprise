@isTest
private class UserProfileControllerTest {
    @testSetup
    static void setupTestData() {
        // Création d'un profil de test 
        Profile testProfile = [SELECT Id FROM Profile WHERE Name = 'Standard User' LIMIT 1];

        // Création d'un utilisateur de test avec le profil récupéré
        User testUser = new User(
            FirstName = 'Test',
            LastName = 'User',
            Alias = 'tuser',
            Email = 'testuser@example.com',
            Username = 'testuserprofile@example.com' ,
            ProfileId = testProfile.Id,
            LanguageLocaleKey = 'en_US',
            EmailEncodingKey = 'UTF-8',
            LocaleSidKey = 'en_US',
            TimeZoneSidKey = 'Europe/Paris'

        );
        insert testUser;
    }

    @isTest
    static void testGetUserProfile() {
        // Récupération de l'utilisateur de test
        User testUser = [SELECT Id, ProfileId FROM User WHERE Email = 'testuser@example.com' LIMIT 1];

        // Exécution du test en tant qu'utilisateur de test
        Test.startTest();
        System.runAs(testUser) {
            String profileName = UserProfileController.getUserProfile();
        Test.stopTest(); 
        
            // Vérification que le profil récupéré correspond au profil attendu
            Profile expectedProfile = [SELECT Name FROM Profile WHERE Id = :testUser.ProfileId LIMIT 1];
            System.assertEquals(expectedProfile.Name, profileName, 'Le nom du profil ne correspond pas');//areEqual
        }
    }
}
