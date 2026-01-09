# Instructions pour corriger le template Word

## Problème

Le template contient une syntaxe invalide pour le logo :
- **Syntaxe incorrecte** : `{structure_logo: {width: 300, height: 300}}`
- **Syntaxe correcte** : `{structure_logo}`

## Solution 1 : Correction automatique (recommandée)

1. **Fermez le fichier template-candidature.docx** s'il est ouvert dans Word
2. Exécutez le script de correction :
   ```bash
   cd backend
   node scripts/fix-template.js
   ```

Le script va :
- Créer une sauvegarde du template original
- Corriger automatiquement les tags invalides
- Sauvegarder le template corrigé

## Solution 2 : Correction manuelle

Si le script ne fonctionne pas ou si vous préférez corriger manuellement :

1. **Ouvrez le fichier** `backend/assets/template-candidature.docx` dans Word
2. **Utilisez la fonction Rechercher/Remplacer** (Ctrl+H) :
   - **Rechercher** : `{structure_logo: {width: 300, height: 300}}`
   - **Remplacer par** : `{structure_logo}`
   - Cliquez sur "Remplacer tout"
3. **Vérifiez** s'il y a d'autres variantes :
   - `{structure_logo: {width: 200, height: 200}}`
   - `{structure_logo: {width: 100, height: 100}}`
   - Toute autre variante avec des nombres différents
4. **Remplacez toutes les variantes** par `{structure_logo}`
5. **Sauvegardez** le document

## Vérification

Après correction, le template ne doit contenir que :
- `{structure_logo}` (sans aucun paramètre)

## Notes importantes

- La taille du logo est contrôlée par le code dans `pdfController.js` (200x200 pixels par défaut)
- Pour modifier la taille, éditez la fonction `getSize` dans `pdfController.js`
- Ne jamais utiliser de syntaxe avec paramètres dans le template Word

