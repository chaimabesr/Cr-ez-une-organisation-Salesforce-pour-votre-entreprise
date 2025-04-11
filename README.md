# Salesforce projet

P4 – Créez une organisation Salesforce pour votre entreprise

## Prérequis
Avoir un compte Salesforce avec les autorisations nécessaires pour créer et déployer des métadonnées.
Avoir installé le Salesforce CLI (SFDX). (ou faire une mise à jour du CLI existant) : https://developer.salesforce.com/tools/salesforcecli

## Veuillez cloner ce projet puis suivre les étapes ci-dessous

1. Importer les métadonnées avec les commandes sfdx (ou sf pour la nouvelle version) 
Se connecter à votre org avec vscode (ou autre) 

```
sfdx force:auth:login
```

2. Se positionner à la racine du projet puis lancer les différentes commandes :

Cette commande va déployer toutes les métadonnées utiles au projet :

```
sfdx force:source:deploy -p force-app/main/default
```

Cette commande va exécuter du code apex contenu dans la classe - remplacer "testusername@salesforce.org" par le username de votre utilisateur dans votre environnment

```
sf apex run --target-org testusername@salesforce.org --file scripts/apex/DataCreationScript.apex
```

3. Vous pouvez commencer à coder votre projet ! 