public with sharing class OpportunityproductSelector {
    public static List<OpportunityLineItem> getOpportunitiesProductByOpportunityId(Id OpportunityId) {
        return [
            SELECT Id, Quantity, UnitPrice, TotalPrice, OpportunityId, PricebookEntry.Product2.Name 
            FROM OpportunityLineItem 
            WHERE OpportunityId = :OpportunityId
        ];
    }
}
