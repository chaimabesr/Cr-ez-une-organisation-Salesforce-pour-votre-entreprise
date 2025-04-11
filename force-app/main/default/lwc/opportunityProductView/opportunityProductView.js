import { LightningElement, api, wire, track } from 'lwc';
import getOpportunitiesProduct from '@salesforce/apex/OpportunitiesproductController.getOpportunitiesProduct';
import { NavigationMixin } from 'lightning/navigation';
import deleteOpportunityLineItem from '@salesforce/apex/OpportunitiesproductController.deleteOpportunityLineItem';
import getUserProfile from '@salesforce/apex/UserProfileController.getUserProfile';
import Quantity from '@salesforce/label/c.Quantity';
import Message_Error_Quantity from '@salesforce/label/c.Message_Error_Quantity';
import NO_PRODUCT_MESSAGE from '@salesforce/label/c.NO_PRODUCT_MESSAGE'
import Product_Name from '@salesforce/label/c.Product_Name';
import Unit_Price from '@salesforce/label/c.Unit_Price';
import Total_Price from '@salesforce/label/c.Total_Price';
import Quantity_in_Stock from '@salesforce/label/c.Quantity_in_Stock';
import See_product from '@salesforce/label/c.See_product';
import Delete from '@salesforce/label/c.Delete';

export default class OpportunityProductView extends NavigationMixin(LightningElement) {
    @api recordId;
    @track OpportunityLineItem = [];
    @track Message = '';
    @track warningMessage = ''; // Message d'avertissement pour l'utilisateur
    isCommercial = false;
    wiredResult;

    columns = [
        { label: Product_Name, fieldName: 'Name', type: 'text' },
        { 
            label: Quantity, 
            fieldName: 'Quantity', 
            type: 'number',
            cellAttributes: { class: { fieldName: 'quantityClass' } } // Classe pour colorer seulement la valeur
        },
        { label: Unit_Price, fieldName: 'UnitPrice', type: 'currency' },
        { label: Total_Price, fieldName: 'TotalPrice', type: 'currency' },
        { label: Quantity_in_Stock, fieldName: 'Quantity_in_Stock__c', type: 'number' },
        { label: See_product, type: 'button' },
        { label: Delete, type: 'button' }
       
    ];

    @wire(getUserProfile)
    wiredUserProfile({ error, data }) {
        if (data) {
            console.log('Profil utilisateur récupéré:', data);
            this.isCommercial = (data === 'Custom: Sales Profile');
            console.log('isCommercial:', this.isCommercial);
            this.updateColumns();
        } else if (error) {
            console.error('Erreur lors de la récupération du profil utilisateur :', error);
        }
    }

    updateColumns() {
        let updatedColumns = [
            { label: Product_Name, fieldName: 'Name', type: 'text' },
            { 
                label: Quantity, 
                fieldName: 'Quantity', 
                type: 'number',
                cellAttributes: { class: { fieldName: 'quantityClass' } } // Coloration conditionnelle
            },
            { label: Unit_Price , fieldName: 'UnitPrice', type: 'currency' },
            { label: Total_Price, fieldName: 'TotalPrice', type: 'currency' },
            { label: Quantity_in_Stock, fieldName: 'Quantity_in_Stock__c', type: 'number' },
        ];

        if (!this.isCommercial) {
            updatedColumns.push({
                label: See_product,  //  Titre de la colonne
                fieldName: 'viewAction', 
                type: 'button',
                fixedWidth: 150,
                typeAttributes: {
                    label: See_product,
                    fieldName: 'viewAction', 
                    title: 'Voir le produit',
                    iconName: 'utility:preview',
                    variant: 'brand',
                    alternativeText: 'Voir Produit',
                    name: 'view',
                }
            });
        }

        updatedColumns.push({
        label: Delete, // Titre de la colonne
        fieldName: 'deleteAction', 
            type: 'button',
            fieldName: 'deleteAction', 
            fixedWidth: 150,
            typeAttributes: {
                label: Delete,
                iconName: 'utility:delete',
                title: 'Supprimer',
                variant: 'destructive-text',
                alternativeText: 'Supprimer',
                name: 'delete',
            }
            
        });

        this.columns = updatedColumns;
        console.log('Colonnes mises à jour:', JSON.stringify(this.columns));
    }

    @wire(getOpportunitiesProduct, { opportunityId: '$recordId' })
    wiredOpportunities(result) {
        this.wiredResult = result;
        const { error, data } = result;
            
            console.log(JSON.stringify(data))
        if (data) {
            let hasQuantityIssue = false;

            this.OpportunityLineItem = data.map(item => {
                let quantityInStock = item.Product2?.Quantity_In_Stock__c || 0;
                let quantity = item.Quantity || 0;
                let isStockNegative = (quantityInStock - quantity) < 0;

                if (isStockNegative) {
                    hasQuantityIssue = true;
                }
             
                    console.log('-------  '+ item.Product2Id)
            
                return {
                    Id: item.Id,
                    Product2Id: item.Product2Id,
                    Name: item.Product2?.Name || 'Produit inconnu',
                    Quantity: quantity,
                    UnitPrice: item.UnitPrice || 0,
                    TotalPrice: item.TotalPrice || 0,
                    Quantity_in_Stock__c: quantityInStock,
                    isDisabled: this.isCommercial,
                    quantityClass: isStockNegative ? 'slds-text-color_error slds-text-title_bold' : '' // Mise en rouge du texte si stock insuffisant
                };
            });

            // Vérification du problème de quantité
            this.warningMessage = hasQuantityIssue ? Message_Error_Quantity: '';

            this.Message = this.OpportunityLineItem.length === 0 ? NO_PRODUCT_MESSAGE : '';
        } else if (error) {
            this.OpportunityLineItem = [];
            this.Message = 'Une erreur est survenue lors du chargement des produits.';
            console.error('Erreur lors du chargement des produits :', error);
        }
    }

    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        console.log('---' +JSON.stringify(event))
        console.log('33' + JSON.stringify(event.detail))
        console.log(event.detail.row)

        switch (actionName) {
            case 'view':
                this.handleView(row);
                break;
            case 'delete':
                this.handleDelete(row);
                break;
            default:
                break;
        }
    }

    handleDelete(row) {
        deleteOpportunityLineItem({ opportunityLineId: row.Id })
            .then(() => {
                this.OpportunityLineItem = this.OpportunityLineItem.filter(item => item.Id !== row.Id);
                
                // Vérifier s'il reste des lignes avec un problème de quantité
                const hasRemainingIssues = this.OpportunityLineItem.some(item => 
                    item.Quantity > item.Quantity_in_Stock__c
                );

                this.warningMessage = hasRemainingIssues ? 
                Message_Error_Quantity: '';

                this.Message = 'Ligne de produit supprimée avec succès.';
            })
            .catch((error) => {
                this.Message = 'Une erreur est survenue lors de la suppression du produit.';
                console.error('Erreur lors de la suppression du produit :', error);
            });
    }

    handleView(row) {
        const productId = row.Product2Id;
        console.log(JSON.stringify(row))
        console.log(row.Product2Id)
        if (productId) {
            this[NavigationMixin.Navigate]({
                type: 'standard__recordPage',
                attributes: {
                    recordId: productId,
                    objectApiName: 'Product2',
                    actionName: 'view',
                },
            });
        } else {
            alert('Aucun produit associé à cette ligne d\'opportunité.');
        }
    }
}
