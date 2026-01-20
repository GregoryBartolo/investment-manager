# Investment Manager

Application web locale de gestion d'investissements personnels avec stockage 100% local en Excel.

## Fonctionnalites

- **Tableau de bord** : Vue d'ensemble du patrimoine, performance globale, graphiques
- **Gestion des comptes** : PEA, Assurance vie, CTO, Livrets, PER, SCPI, Crypto
- **Mise a jour mensuelle** : Interface rapide pour actualiser les valorisations
- **Export Excel** : Donnees accessibles dans `data/investments.xlsx`

## Installation

```bash
git clone <repo>
cd investment-manager
npm install
```

## Utilisation

```bash
npm start
```

Ouvre automatiquement http://localhost:5173

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express |
| Excel | ExcelJS |
| UI | shadcn/ui + Tailwind CSS |
| Charts | Recharts |
| State | Zustand |

## Structure du fichier Excel

Le fichier `data/investments.xlsx` contient 4 feuilles :

1. **Comptes** : id, type, nom, plateforme, dateOuverture, notes
2. **Transactions** : id, compteId, date, type, montant, frequence, description
3. **Valorisations** : id, compteId, date, valeur, notes
4. **Configuration** : cle, valeur

## Confidentialite

- Aucune donnee envoyee sur Internet
- Aucun compte utilisateur requis
- Donnees stockees localement dans un fichier Excel
- Code open-source transparent

## Licence

MIT
