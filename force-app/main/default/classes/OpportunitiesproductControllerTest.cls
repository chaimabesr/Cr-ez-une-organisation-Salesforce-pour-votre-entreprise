
@isTest
private class OpportunitiesproductControllerTest {

        @isTest
        static void testGetOpportunitiesProduct() {
            // Créer une opportunité et des lignes d'opportunité fictives pour le test
            Opportunity opp = new Opportunity(Name='Test Opportunity', StageName='Prospecting', CloseDate=Date.today());
            insert opp;
    
            Product2 product = new Product2(Name='Test Product');
            insert product;
    
            PricebookEntry pricebookEntry = new PricebookEntry(Product2Id=product.Id, Pricebook2Id=Test.getStandardPricebookId(), UnitPrice=100, IsActive=true);
            insert pricebookEntry;
    
            OpportunityLineItem oli = new OpportunityLineItem(OpportunityId=opp.Id, Quantity=5, UnitPrice=100, PricebookEntryId=pricebookEntry.Id);
            insert oli;
    
            Test.startTest();
            List<OpportunityLineItem> result = OpportunitiesproductController.getOpportunitiesProduct(opp.Id);
            Test.stopTest();
    
            System.assertEquals(1, result.size(), 'Il devrait y avoir 1 ligne d\'opportunité.');
        }
    // Test de push depuis le bon dossier

        @isTest
        static void testDeleteOpportunityLineItem() {
            // Créer une opportunité
            Opportunity opp = new Opportunity(Name='Test Opportunity', StageName='Prospecting', CloseDate=Date.today());
            insert opp;
        
            // Créer un produit
            Product2 product = new Product2(Name='Test Product');
            insert product;
        
            // Créer un PricebookEntry pour ce produit
            PricebookEntry pricebookEntry = new PricebookEntry(Product2Id=product.Id, Pricebook2Id=Test.getStandardPricebookId(), UnitPrice=100, IsActive=true);
            insert pricebookEntry;
        
            // Créer une ligne d'opportunité
            OpportunityLineItem oli = new OpportunityLineItem(OpportunityId=opp.Id, Quantity=5, UnitPrice=100, PricebookEntryId=pricebookEntry.Id);
            insert oli;
        
            // Supprimer la ligne d'opportunité
            Test.startTest();
            OpportunitiesproductController.deleteOpportunityLineItem(oli.Id);
            Test.stopTest();
        
        
           // Vérifier que la ligne a bien été supprimée
          
        
        Integer remainingLines = [SELECT COUNT() FROM OpportunityLineItem WHERE Id = :oli.Id];
        
        // Si la ligne a bien été supprimée, le compteur devrait être 0
        System.assertEquals(0, remainingLines, 'La ligne d\'opportunité devrait avoir été supprimée.');
    
        }
        

    }
    