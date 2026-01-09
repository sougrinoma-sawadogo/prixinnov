import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import PizZip from 'pizzip';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Script to fix invalid docxtemplater tags in the Word template
 * Fixes: {structure_logo: {width: 300, height: 300}} -> {structure_logo}
 */
const fixTemplate = () => {
  const templatePath = path.join(__dirname, '../assets/template-candidature.docx');
  
  if (!fs.existsSync(templatePath)) {
    console.error('Template file not found:', templatePath);
    process.exit(1);
  }

  console.log('Reading template file...');
  const content = fs.readFileSync(templatePath, 'binary');
  const zip = new PizZip(content);
  
  // Get the document.xml file
  const documentXml = zip.files['word/document.xml'];
  if (!documentXml) {
    console.error('Could not find word/document.xml in template');
    process.exit(1);
  }

  let xmlContent = documentXml.asText();
  const originalXml = xmlContent;
  
  console.log('Fixing invalid tags...');
  
  // Fix pattern: {structure_logo: {width: 300, height: 300}}
  // This pattern might be split across XML tags, so we need to handle it carefully
  // Pattern 1: {structure_logo: {width: NUMBER, height: NUMBER}}
  xmlContent = xmlContent.replace(
    /\{structure_logo:\s*\{width:\s*\d+,\s*height:\s*\d+\}\}/g,
    '{structure_logo}'
  );
  
  // Pattern 2: {structure_logo: {width: NUMBER, height: NUMBER}} (with spaces)
  xmlContent = xmlContent.replace(
    /\{structure_logo:\s*\{width:\s*\d+\s*,\s*height:\s*\d+\s*\}\}/g,
    '{structure_logo}'
  );
  
  // Pattern 3: Handle cases where it might be split: {structure_logo: {width: 300}} -> {structure_logo}
  xmlContent = xmlContent.replace(
    /\{structure_logo:\s*\{[^}]*\}\}/g,
    '{structure_logo}'
  );
  
  // Pattern 4: Handle unclosed tags: {structure_logo: -> {structure_logo}
  xmlContent = xmlContent.replace(
    /\{structure_logo:\s*\{/g,
    '{structure_logo}'
  );
  
  // Pattern 5: Handle duplicate closing braces: }} -> }
  // But be careful not to break valid nested tags
  // Only fix if it's after a number (like "300}}")
  xmlContent = xmlContent.replace(/(\d+)\}\}/g, '$1}');
  
  if (xmlContent !== originalXml) {
    console.log('Changes detected. Updating template...');
    zip.file('word/document.xml', xmlContent);
    
    // Create backup
    const backupPath = templatePath + '.backup';
    if (!fs.existsSync(backupPath)) {
      try {
        fs.copyFileSync(templatePath, backupPath);
        console.log('Backup created:', backupPath);
      } catch (err) {
        console.warn('Could not create backup:', err.message);
      }
    }
    
    // Write fixed template
    try {
      const buffer = zip.generate({ type: 'nodebuffer', compression: 'DEFLATE' });
      fs.writeFileSync(templatePath, buffer);
      console.log('Template fixed successfully!');
      console.log('Fixed file:', templatePath);
    } catch (err) {
      if (err.code === 'EBUSY') {
        console.error('\n❌ ERROR: Template file is locked or open in another program.');
        console.error('Please close the template file in Word or any other program and try again.');
        console.error('\nAlternatively, you can fix it manually:');
        console.error('1. Open template-candidature.docx in Word');
        console.error('2. Find and replace: {structure_logo: {width: 300, height: 300}}');
        console.error('3. Replace with: {structure_logo}');
        console.error('4. Save the file');
        process.exit(1);
      } else {
        throw err;
      }
    }
  } else {
    console.log('No changes needed. Template appears to be correct.');
  }
};

fixTemplate();

