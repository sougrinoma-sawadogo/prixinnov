# Guide : Afficher un logo avec docxtemplater

## Vue d'ensemble

Pour afficher un logo dans un template Word avec docxtemplater, vous devez utiliser le module `docxtemplater-image-module`. Voici comment procéder étape par étape.

## 1. Installation des dépendances

Assurez-vous d'avoir installé les packages nécessaires :

```bash
npm install docxtemplater docxtemplater-image-module pizzip
```

## 2. Configuration dans le code (Backend)

### Étape 1 : Importer les modules

```javascript
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module';
import PizZip from 'pizzip';
import fs from 'fs';
import path from 'path';
```

### Étape 2 : Préparer le chemin de l'image

```javascript
// Exemple : récupérer le chemin du logo depuis la base de données
let logoPath = null;
if (structure?.logo_path) {
  const fullLogoPath = path.join(__dirname, '..', structure.logo_path);
  if (fs.existsSync(fullLogoPath)) {
    logoPath = fullLogoPath;
  }
}
```

### Étape 3 : Configurer le module ImageModule

```javascript
const imageModule = new ImageModule({
  fileType: 'docx',           // Type de fichier (docx ou pptx)
  centered: false,            // Centrer l'image (true/false)
  
  // Fonction qui retourne le buffer de l'image
  getImage: (tagValue, tagName) => {
    // tagName = nom du tag dans le template (ex: "structure_logo")
    // tagValue = valeur passée dans templateData (peut être null)
    
    if (tagName === 'structure_logo' && logoPath) {
      // Retourner le buffer de l'image
      return fs.readFileSync(logoPath);
    }
    return null; // Retourner null si l'image n'existe pas
  },
  
  // Fonction qui définit la taille de l'image
  getSize: (img, tagValue, tagName) => {
    // img = buffer de l'image
    // tagValue = valeur passée dans templateData
    // tagName = nom du tag
    
    // Retourner [largeur, hauteur] en pixels
    // Exemple : [200, 200] = 200px × 200px
    return [200, 200];
  },
});
```

### Étape 4 : Créer l'instance Docxtemplater avec le module

```javascript
// Lire le template Word
const content = fs.readFileSync(templatePath, 'binary');
const zip = new PizZip(content);

// Créer Docxtemplater avec le module image
const doc = new Docxtemplater(zip, {
  modules: [imageModule],  // Ajouter le module image
  paragraphLoop: true,
  linebreaks: true,
});
```

### Étape 5 : Préparer les données du template

```javascript
const templateData = {
  // Autres données...
  structure_logo: logoPath ? true : null, // true si le logo existe, null sinon
  // Note : La valeur n'est pas utilisée directement, c'est juste pour les conditions
};
```

### Étape 6 : Rendre le document

```javascript
doc.render(templateData);

// Générer le buffer
const buf = doc.getZip().generate({
  type: 'nodebuffer',
  compression: 'DEFLATE',
});
```

## 3. Utilisation dans le template Word

### Syntaxe de base

Dans votre fichier Word (`template-candidature.docx`), placez simplement :

```
{structure_logo}
```

**⚠️ IMPORTANT** : Utilisez uniquement `{structure_logo}`. Ne pas utiliser de syntaxe avec paramètres comme `{structure_logo: {width: 300, height: 300}}` car cela causera une erreur.

### Afficher le logo conditionnellement

Si vous voulez afficher le logo uniquement s'il existe :

```
{#structure_logo}
Logo de la structure :
{structure_logo}
{/structure_logo}
```

### Positionnement

Le logo sera inséré exactement à l'endroit où vous placez le placeholder `{structure_logo}` dans le document Word.

## 4. Personnaliser la taille du logo

Pour modifier la taille du logo, éditez la fonction `getSize` dans votre code :

```javascript
getSize: (img, tagValue, tagName) => {
  // Taille personnalisée : 300px × 300px
  return [300, 300];
  
  // Ou taille rectangulaire : 400px × 200px
  // return [400, 200];
  
  // Ou calculer dynamiquement selon le tag
  if (tagName === 'structure_logo') {
    return [250, 250];
  }
  return [200, 200]; // Taille par défaut
},
```

## 5. Exemple complet

Voici un exemple complet de code :

```javascript
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module';
import PizZip from 'pizzip';
import fs from 'fs';
import path from 'path';

export const generateDocumentWithLogo = async (req, res) => {
  try {
    // 1. Préparer le chemin du logo
    const logoPath = path.join(__dirname, '../uploads/logo.png');
    
    // 2. Lire le template
    const templatePath = path.join(__dirname, '../assets/template.docx');
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    
    // 3. Configurer le module image
    const imageModule = new ImageModule({
      fileType: 'docx',
      centered: false,
      getImage: (tagValue, tagName) => {
        if (tagName === 'structure_logo' && fs.existsSync(logoPath)) {
          return fs.readFileSync(logoPath);
        }
        return null;
      },
      getSize: (img, tagValue, tagName) => {
        return [200, 200]; // 200px × 200px
      },
    });
    
    // 4. Créer Docxtemplater
    const doc = new Docxtemplater(zip, {
      modules: [imageModule],
      paragraphLoop: true,
      linebreaks: true,
    });
    
    // 5. Préparer les données
    const templateData = {
      structure_logo: fs.existsSync(logoPath) ? true : null,
      // Autres données...
    };
    
    // 6. Rendre le document
    doc.render(templateData);
    
    // 7. Générer le buffer
    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });
    
    // 8. Envoyer la réponse
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="document.docx"');
    res.send(buf);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};
```

## 6. Formats d'image supportés

Le module `docxtemplater-image-module` supporte les formats suivants :
- PNG
- JPG / JPEG
- GIF
- BMP

## 7. Dépannage

### Le logo ne s'affiche pas

1. **Vérifiez que le chemin du logo est correct** :
   ```javascript
   console.log('Logo path:', logoPath);
   console.log('Logo exists:', fs.existsSync(logoPath));
   ```

2. **Vérifiez que le tag dans le template est correct** :
   - Doit être exactement `{structure_logo}` (sans espaces)
   - Sensible à la casse

3. **Vérifiez que la fonction `getImage` retourne bien le buffer** :
   ```javascript
   getImage: (tagValue, tagName) => {
     if (tagName === 'structure_logo' && logoPath) {
       const buffer = fs.readFileSync(logoPath);
       console.log('Image buffer size:', buffer.length);
       return buffer;
     }
     return null;
   },
   ```

### Erreur "Unclosed tag" ou "Duplicate close tag"

Cela signifie que le template contient une syntaxe invalide. Vérifiez que vous utilisez uniquement `{structure_logo}` et non `{structure_logo: {...}}`.

### L'image est trop grande/petite

Modifiez la fonction `getSize` pour ajuster les dimensions en pixels.

## 8. Bonnes pratiques

1. **Toujours vérifier l'existence du fichier** avant de le lire
2. **Utiliser des chemins absolus** pour éviter les problèmes de chemin relatif
3. **Gérer les erreurs** si l'image n'existe pas
4. **Optimiser la taille des images** avant de les utiliser (compression)
5. **Utiliser des conditions** dans le template pour afficher le logo uniquement s'il existe

## Références

- Documentation docxtemplater : https://docxtemplater.com/
- Documentation image-module : https://github.com/open-xml-templating/docxtemplater-image-module

