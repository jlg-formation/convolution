# Composant PaddedGrid

## Description

Le composant `PaddedGrid` étend le composant `Grid` existant pour afficher
visuellement le padding autour de la matrice d'entrée lors des opérations de
convolution.

## Fonctionnalités

- **Affichage du padding** : Montre les cellules de padding (valeur 0) avec une
  apparence visuelle distincte
- **Distinction visuelle** : Les cellules de padding ont un fond gris clair et
  des bordures pointillées
- **Coordonnées automatiques** : Convertit automatiquement les coordonnées de
  highlight de la matrice originale vers la matrice paddée
- **Edition sélective** : Seules les cellules de la matrice originale sont
  éditables, pas les cellules de padding
- **Compatibilité** : Maintient la même interface que le composant `Grid` pour
  les highlights

## Utilisation

Le composant est automatiquement utilisé dans `AnimationDemo` lorsque
`padding > 0` :

```tsx
{
  padding > 0 ? (
    <PaddedGrid
      matrix={input}
      setMatrix={setInput}
      padding={padding}
      highlightCurrent={getCurrentCellHighlight()}
      highlightKernel={getKernelCoverage(currentPos)}
    />
  ) : (
    <Grid
      matrix={input}
      setMatrix={setInput}
      highlightCurrent={getCurrentCellHighlight()}
      highlightKernel={getKernelCoverage(currentPos)}
    />
  );
}
```

## Props

- `matrix`: La matrice d'entrée originale (sans padding)
- `setMatrix`: Fonction pour modifier la matrice d'entrée
- `padding`: Nombre de cellules de padding à ajouter de chaque côté
- `highlightCurrent`: Coordonnées à surligner en jaune (dans la matrice
  originale)
- `highlightKernel`: Coordonnées à surligner en vert (dans la matrice originale)

## Algorithme

1. **Création de la matrice paddée** : Ajoute des cellules avec la valeur 0
   autour de la matrice originale
2. **Conversion des coordonnées** : Translate les coordonnées de highlight vers
   la matrice paddée
3. **Rendu conditionnel** : Affiche les cellules de padding en lecture seule
   avec un style distinct
4. **Edition conditionnelle** : Permet l'édition uniquement des cellules de la
   matrice originale

## Styles visuels

- **Cellules normales** : Fond blanc, bordures pleines
- **Cellules de padding** : Fond gris clair (`bg-gray-100`), bordures
  pointillées (`border-dashed`), texte gris atténué
- **Highlights** : Conservent la priorité sur les styles de base (jaune pour
  current, vert pour kernel)

## Intégration

Le composant s'intègre parfaitement dans l'écosystème existant :

- Utilise le store Zustand pour accéder au padding
- Maintient la compatibilité avec les fonctions de highlight existantes
- Respecte les conventions de style Tailwind CSS du projet
