public with sharing class OpportunitiesproductController {
    // Methode pour récupérer les lignes d'opportunité
    @AuraEnabled(cacheable=true)
    public static List<OpportunityLineItem> getOpportunitiesProduct(Id opportunityId) {
        List<OpportunityLineItem> lineItems = [
            SELECT Id,  
                   Product2.Name, 
                   Product2.Quantity_in_Stock__c, 
                   Quantity, 
                   UnitPrice, 
                   TotalPrice
            FROM OpportunityLineItem
            WHERE OpportunityId = :opportunityId
        ];
        return lineItems;
    }
    // Methode pour supprimer une ligne d'opportunité
    @AuraEnabled
    public static void deleteOpportunityLineItem(Id opportunityLineId) {
        try {
            // Récupérer la ligne d'opportunité par son Id
            OpportunityLineItem oli = [SELECT Id FROM OpportunityLineItem WHERE Id = :opportunityLineId LIMIT 1];

            if (oli != null) {
                delete oli;  // Supprimer l'objet
            } else {
                throw new AuraHandledException('La ligne d\'opportunité n\'a pas été trouvée.');
            }
        } catch (AuraHandledException e) {
            // Vous pouvez également ajouter des logs spécifiques pour une erreur capturée
            throw new AuraHandledException('Erreur lors de la suppression de la ligne : ' + e.getMessage());
        } 
    }
}

