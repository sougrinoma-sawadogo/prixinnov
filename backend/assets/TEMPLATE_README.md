# Template Word pour la génération de PDF

## Fichier template requis

Placez votre template Word dans le dossier `backend/assets/` avec le nom suivant :
- **Nom du fichier** : `template-candidature.docx`
- **Format** : Document Word (.docx)

## Placeholders disponibles

Utilisez la syntaxe `{nom_du_placeholder}` dans votre document Word pour insérer les données de la candidature.

### Informations de la structure

- `{structure_denomination}` - Dénomination de la structure
- `{structure_sigle}` - Sigle de la structure
- `{structure_email}` - Email de la structure
- `{structure_type}` - Type de structure (voir valeurs possibles ci-dessous)
- `{structure_adresse}` - Adresse postale
- `{structure_responsable}` - Identité du responsable
- `{structure_contact}` - Contact du responsable
- `{structure_site_web}` - Site web (si disponible)
- `{structure_logo}` - **Logo de la structure** (voir section spéciale ci-dessous)

### Type de structure - Valeurs possibles

La variable `{structure_type}` peut contenir l'une des valeurs suivantes :
- `Structure de mission`
- `Direction générale`
- `Structure rattachée`
- `Projet/Programme de développement`
- `Autre`

**Note:** Ces valeurs correspondent exactement aux options disponibles dans le formulaire de candidature.

### Informations de la candidature

- `{categorie_prix}` - Catégorie du prix (Créativité, Émergence, Excellence, Spéciaux)
- `{sous_categorie}` - Sous-catégorie (pour les Prix Spéciaux)
- `{date_projet}` - Date du projet (formaté en français)
- `{date_mise_en_oeuvre}` - Date de mise en œuvre (formaté en français, si disponible)
- `{date_soumission}` - Date de soumission de la candidature
- `{numero_candidature}` - Numéro de la candidature

### Détails de la candidature

- `{presentation_breve}` - Présentation brève
- `{diagnostic}` - Diagnostic
- `{cible}` - Cible impactée
- `{particularite}` - Particularité
- `{adequation_secteur}` - Adéquation avec le secteur

### Objectifs (liste)

Pour afficher les objectifs, utilisez une boucle dans docxtemplater :

```
{#objectifs}
{numero}. {libelle}
{#resultat}
   Résultat: {resultat}
{/resultat}

{/objectifs}
```

- `{has_objectifs}` - Booléen pour vérifier s'il y a des objectifs

### Perspectives

- `{perspectives_objectifs}` - Objectifs à 3 ans
- `{perspectives_besoins}` - Besoins à 3 ans
- `{has_perspectives}` - Booléen pour vérifier s'il y a des perspectives

## Exemple de template

Voici un exemple de structure de template :

```
MINISTERE DE L'ECONOMIE ET DES FINANCES
CABINET
COMITE DE COORDINATION DU PRIX DE L'INNOVATION

Fiche de candidature
CATEGORIE PRIX "{categorie_prix}"

INFORMATIONS DE LA STRUCTURE
{#structure_logo}
Logo: {structure_logo}
{/structure_logo}

Dénomination: {structure_denomination}
Sigle: {structure_sigle}
Email: {structure_email}
Type: {structure_type}

DÉTAILS DE LA CANDIDATURE
Catégorie de prix: {categorie_prix}
{#sous_categorie}
Sous-catégorie: {sous_categorie}
{/sous_categorie}
Date du projet: {date_projet}
{#date_mise_en_oeuvre}
Date de mise en œuvre: {date_mise_en_oeuvre}
{/date_mise_en_oeuvre}

Présentation brève:
{presentation_breve}

Diagnostic:
{diagnostic}

Cible impactée:
{cible}

Particularité:
{particularite}

Adéquation avec le secteur:
{adequation_secteur}

{#has_objectifs}
OBJECTIFS
{#objectifs}
{numero}. {libelle}
{#resultat}
   Résultat: {resultat}
{/resultat}

{/objectifs}
{/has_objectifs}

{#has_perspectives}
PERSPECTIVES À 3 ANS
Objectifs:
{perspectives_objectifs}

Besoins:
{perspectives_besoins}
{/has_perspectives}
```

## Insertion du logo de la structure

Pour insérer le logo de la structure dans votre template Word :

1. **Placez le placeholder dans votre document Word** :
   ```
   {structure_logo}
   ```

2. **Taille par défaut** : Le logo sera inséré avec une taille de 200x200 pixels par défaut.

3. **Taille personnalisée** : La taille par défaut est 200x200 pixels. Pour modifier la taille, vous devez modifier le code dans `backend/controllers/pdfController.js` dans la fonction `getSize` de l'image module.
   
   **IMPORTANT** : Ne pas utiliser `{structure_logo: {width: 300, height: 300}}` dans le template. Cette syntaxe est invalide et causera une erreur. Utilisez uniquement `{structure_logo}`.

4. **Condition pour afficher le logo uniquement s'il existe** :
   ```
   {#structure_logo}
   Logo de la structure:
   {structure_logo}
   {/structure_logo}
   ```

5. **Note importante** : 
   - Le logo doit être au format image (PNG, JPG, JPEG)
   - Si la structure n'a pas de logo, le placeholder sera ignoré
   - Le logo est inséré à l'endroit exact où vous placez le placeholder dans le document

## Conditions et boucles

Docxtemplater supporte les conditions et boucles :

- `{#condition}...{/condition}` - Affiche le contenu si la condition est vraie
- `{#liste}...{/liste}` - Boucle sur une liste
- `{^condition}...{/condition}` - Affiche le contenu si la condition est fausse

## Installation de LibreOffice (pour la conversion PDF)

Pour convertir le Word en PDF, LibreOffice doit être installé sur le serveur :

### Windows
```bash
# Télécharger depuis https://www.libreoffice.org/download/
# Installer LibreOffice
# Ajouter au PATH ou utiliser le chemin complet
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install libreoffice
```

### macOS
```bash
brew install --cask libreoffice
```

### Docker
Si vous utilisez Docker, ajoutez LibreOffice dans votre Dockerfile :
```dockerfile
RUN apt-get update && apt-get install -y libreoffice
```

## Utilisation

### Route avec template
```
GET /api/pdf/candidatures/:id/template
```

### Route classique (fallback)
```
GET /api/pdf/candidatures/:id
```

Le système utilisera automatiquement le template si disponible, sinon il utilisera la génération PDFKit classique.

## Notes importantes

1. Le template doit être au format `.docx` (Word 2007+)
2. Les placeholders sont sensibles à la casse
3. Les sauts de ligne dans les champs texte longs seront préservés
4. Les fichiers temporaires sont automatiquement supprimés après génération
5. Si LibreOffice n'est pas disponible, le système retournera le fichier Word au lieu du PDF

