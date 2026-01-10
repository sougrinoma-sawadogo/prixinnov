import { useMemo } from 'react';
import './HtmlContent.css';

/**
 * Composant pour afficher du contenu HTML de manière sécurisée
 * Nettoie le HTML pour éviter les attaques XSS tout en préservant le formatage
 */
const HtmlContent = ({ content, className = '' }) => {
  const sanitizedContent = useMemo(() => {
    if (!content) return '';
    
    // Si le contenu n'est pas du HTML, retourner tel quel
    if (!content.includes('<')) return content;
    
    // Créer un élément temporaire pour nettoyer le HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Liste des tags autorisés
    const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'h1', 'h2', 'h3', 'ul', 'ol', 'li', 'a', 'div', 'span'];
    const allowedAttributes = ['href', 'target', 'rel'];
    
    // Fonction récursive pour nettoyer les nœuds
    const cleanNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node;
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();
        
        // Si le tag n'est pas autorisé, le remplacer par son contenu texte
        if (!allowedTags.includes(tagName)) {
          const textNode = document.createTextNode(node.textContent);
          return textNode;
        }
        
        // Créer un nouvel élément avec le tag autorisé
        const cleanElement = document.createElement(tagName);
        
        // Copier les attributs autorisés
        Array.from(node.attributes).forEach(attr => {
          if (allowedAttributes.includes(attr.name)) {
            cleanElement.setAttribute(attr.name, attr.value);
          }
        });
        
        // Nettoyer récursivement les enfants
        Array.from(node.childNodes).forEach(child => {
          const cleanedChild = cleanNode(child);
          if (cleanedChild) {
            cleanElement.appendChild(cleanedChild);
          }
        });
        
        return cleanElement;
      }
      
      return null;
    };
    
    // Nettoyer tous les nœuds
    const fragment = document.createDocumentFragment();
    Array.from(tempDiv.childNodes).forEach(node => {
      const cleaned = cleanNode(node);
      if (cleaned) {
        fragment.appendChild(cleaned);
      }
    });
    
    // Créer un nouveau div pour contenir le contenu nettoyé
    const cleanDiv = document.createElement('div');
    cleanDiv.appendChild(fragment);
    
    return cleanDiv.innerHTML;
  }, [content]);
  
  if (!content) return null;
  
  return (
    <div 
      className={`html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default HtmlContent;

