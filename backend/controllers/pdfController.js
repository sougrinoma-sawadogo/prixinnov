import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module';
import PizZip from 'pizzip';
import { Candidature, Structure, ObjectifResultat, PerspectiveSuivi } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const execAsync = promisify(exec);

export const generateCandidaturePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const candidature = await Candidature.findByPk(id, {
      include: [
        { model: Structure, as: 'structure' },
        { model: ObjectifResultat, as: 'objectifs', order: [['ordre', 'ASC']] },
        { model: PerspectiveSuivi, as: 'perspectives' },
      ],
    });

    if (!candidature) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée',
      });
    }

    // Create PDF with reduced top margin for header
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="candidature-${id}.pdf"`);

    doc.pipe(res);

    // Header Section
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const margin = 50;
    const headerHeight = 120;
    
    // Left side - Ministry information
    const leftX = margin + 10;
    let currentY = margin + 10;
    
    doc.fontSize(12).font('Helvetica-Bold');
    doc.text('MINISTERE DE L\'ECONOMIE', leftX, currentY);
    currentY += 15;
    doc.text('ET DES FINANCES', leftX, currentY);
    currentY += 10;
    
    // Draw line instead of Unicode characters
    doc.fontSize(10).font('Helvetica');
    doc.moveTo(leftX, currentY).lineTo(leftX + 200, currentY).stroke();
    currentY += 12;
    
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('CABINET', leftX, currentY);
    currentY += 10;
    
    // Draw line instead of Unicode characters
    doc.fontSize(10).font('Helvetica');
    doc.moveTo(leftX, currentY).lineTo(leftX + 200, currentY).stroke();
    currentY += 12;
    
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('COMITE DE COORDINATION', leftX, currentY);
    currentY += 12;
    doc.text('DU PRIX DE L\'INNOVATION', leftX, currentY);
    currentY += 10;
    
    // Draw dashed line
    doc.fontSize(9).font('Helvetica');
    doc.moveTo(leftX, currentY).lineTo(leftX + 200, currentY).stroke();
    
    // Right side - Coat of Arms
    const rightX = pageWidth - margin - 100;
    const rightY = margin + 10;
    const imageSize = 80;
    
    // Try to load coat of arms image
    const coatOfArmsPath = path.join(__dirname, '../assets/armoiries.png');
    if (fs.existsSync(coatOfArmsPath)) {
      doc.image(coatOfArmsPath, rightX, rightY, { width: imageSize, height: imageSize });
    } else {
      // Placeholder if image not found
      doc.rect(rightX, rightY, imageSize, imageSize).stroke();
      doc.fontSize(8).font('Helvetica');
      doc.text('Armoiries', rightX + 15, rightY + 35, { width: imageSize, align: 'center' });
    }
    
    // Below coat of arms
    const textBelowImageY = rightY + imageSize + 5;
    doc.fontSize(10).font('Helvetica-Bold');
    const burkinaText = 'BURKINA FASO';
    const burkinaTextWidth = doc.widthOfString(burkinaText);
    doc.text(burkinaText, rightX + (imageSize - burkinaTextWidth) / 2, textBelowImageY);
    
    const mottoY = textBelowImageY + 12;
    doc.fontSize(8).font('Helvetica-Oblique');
    const mottoText = 'La Patrie ou la Mort, nous Vaincrons';
    const mottoTextWidth = doc.widthOfString(mottoText);
    doc.text(mottoText, rightX + (imageSize - mottoTextWidth) / 2, mottoY);
    
    // Title section at bottom of header
    const titleY = margin + headerHeight - 30;
    doc.fontSize(16).font('Helvetica-Bold');
    doc.fillColor('#1e40af'); // Blue color
    const titleText = 'Fiche de candidature';
    const titleTextWidth = doc.widthOfString(titleText);
    doc.text(titleText, (pageWidth - titleTextWidth) / 2, titleY);
    
    const categoryY = titleY + 20;
    // Use simple quotes instead of guillemets for better compatibility
    const categoryText = `CATEGORIE PRIX "${candidature.categorie_prix.toUpperCase()}"`;
    doc.fontSize(13).font('Helvetica-Bold');
    doc.fillColor('#1e40af'); // Blue color
    const categoryTextWidth = doc.widthOfString(categoryText);
    doc.text(categoryText, (pageWidth - categoryTextWidth) / 2, categoryY);
    
    // Reset color to black
    doc.fillColor('black');
    
    // Move down after header
    doc.y = margin + headerHeight + 20;

    // Structure information
    doc.fontSize(14).font('Helvetica-Bold');
    doc.fillColor('black');
    doc.text('INFORMATIONS DE LA STRUCTURE', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Dénomination: ${candidature.structure?.denomination || 'N/A'}`);
    doc.moveDown(0.3);
    doc.text(`Sigle: ${candidature.structure?.sigle || 'N/A'}`);
    doc.moveDown(0.3);
    doc.text(`Email: ${candidature.structure?.email || 'N/A'}`);
    doc.moveDown(0.3);
    doc.text(`Type: ${candidature.structure?.type_structure || 'N/A'}`);
    doc.moveDown();

    // Candidature details
    doc.fontSize(14).font('Helvetica-Bold');
    doc.text('DÉTAILS DE LA CANDIDATURE', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).font('Helvetica');
    doc.text(`Catégorie de prix: ${candidature.categorie_prix}`);
    doc.moveDown(0.3);
    if (candidature.sous_categorie_special) {
      doc.text(`Sous-catégorie: ${candidature.sous_categorie_special}`);
      doc.moveDown(0.3);
    }
    // Format date properly
    const dateProjet = candidature.date_projet ? new Date(candidature.date_projet).toLocaleDateString('fr-FR') : 'N/A';
    doc.text(`Date du projet: ${dateProjet}`);
    doc.moveDown(0.3);
    if (candidature.date_mise_en_oeuvre) {
      const dateMiseEnOeuvre = new Date(candidature.date_mise_en_oeuvre).toLocaleDateString('fr-FR');
      doc.text(`Date de mise en œuvre: ${dateMiseEnOeuvre}`);
      doc.moveDown(0.3);
    }
    doc.moveDown();

    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Présentation brève:', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica');
    // Handle long text with word wrapping
    doc.text(candidature.presentation_breve || 'N/A', {
      width: pageWidth - 2 * margin,
      align: 'left'
    });
    doc.moveDown();

    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Diagnostic:', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica');
    doc.text(candidature.diagnostic || 'N/A', {
      width: pageWidth - 2 * margin,
      align: 'left'
    });
    doc.moveDown();

    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Cible impactée:', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica');
    doc.text(candidature.cible || 'N/A', {
      width: pageWidth - 2 * margin,
      align: 'left'
    });
    doc.moveDown();

    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Particularité:', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica');
    doc.text(candidature.particularite || 'N/A', {
      width: pageWidth - 2 * margin,
      align: 'left'
    });
    doc.moveDown();

    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('Adéquation avec le secteur:', { underline: true });
    doc.moveDown(0.3);
    doc.fontSize(10).font('Helvetica');
    doc.text(candidature.adequation_secteur || 'N/A', {
      width: pageWidth - 2 * margin,
      align: 'left'
    });
    doc.moveDown();

    // Objectifs
    if (candidature.objectifs && candidature.objectifs.length > 0) {
      doc.fontSize(14).font('Helvetica-Bold');
      doc.text('OBJECTIFS', { underline: true });
      doc.moveDown(0.5);
      candidature.objectifs.forEach((obj, index) => {
        doc.fontSize(11).font('Helvetica-Bold');
        doc.text(`${index + 1}. ${obj.libelle_objectif}`, {
          width: pageWidth - 2 * margin,
          align: 'left'
        });
        if (obj.resultat_atteint) {
          doc.moveDown(0.2);
          doc.fontSize(10).font('Helvetica');
          doc.text(`Résultat: ${obj.resultat_atteint}`, {
            indent: 20,
            width: pageWidth - 2 * margin - 20,
            align: 'left'
          });
        }
        doc.moveDown(0.5);
      });
    }

    // Perspectives
    if (candidature.perspectives) {
      doc.addPage();
      doc.fontSize(14).font('Helvetica-Bold');
      doc.text('PERSPECTIVES À 3 ANS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text('Objectifs:', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica');
      doc.text(candidature.perspectives.objectifs_3_ans || 'N/A', {
        width: pageWidth - 2 * margin,
        align: 'left'
      });
      doc.moveDown();
      doc.fontSize(11).font('Helvetica-Bold');
      doc.text('Besoins:', { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(10).font('Helvetica');
      doc.text(candidature.perspectives.besoins_3_ans || 'N/A', {
        width: pageWidth - 2 * margin,
        align: 'left'
      });
    }

    doc.end();
  } catch (error) {
    console.error('Generate PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du PDF',
      error: error.message,
    });
  }
};

/**
 * Generate PDF from Word template using docxtemplater
 * Template should be placed at: backend/assets/template-candidature.docx
 * Placeholders in template should use format: {placeholder_name}
 */
export const generateCandidaturePDFFromTemplate = async (req, res) => {
  let tempWordPath = null;
  let tempPdfPath = null;

  try {
    const { id } = req.params;

    // Fetch candidature with all relations
    const candidature = await Candidature.findByPk(id, {
      include: [
        { model: Structure, as: 'structure' },
        { model: ObjectifResultat, as: 'objectifs', order: [['ordre', 'ASC']] },
        { model: PerspectiveSuivi, as: 'perspectives' },
      ],
    });

    if (!candidature) {
      return res.status(404).json({
        success: false,
        message: 'Candidature non trouvée',
      });
    }

    // Path to template
    const templatePath = path.join(__dirname, '../assets/template-candidature.docx');
    
    if (!fs.existsSync(templatePath)) {
      return res.status(404).json({
        success: false,
        message: 'Template Word non trouvé. Veuillez placer le fichier template-candidature.docx dans le dossier backend/assets/',
      });
    }

    // Read template file
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    
    // Prepare logo path and buffer if exists
    let logoPath = null;
    let logoBuffer = null;
    if (candidature.structure?.logo_path) {
      const fullLogoPath = path.join(__dirname, '..', candidature.structure.logo_path);
      if (fs.existsSync(fullLogoPath)) {
        logoPath = fullLogoPath;
        try {
          logoBuffer = fs.readFileSync(fullLogoPath);
          console.log('Logo found at:', logoPath, 'Size:', logoBuffer.length, 'bytes');
        } catch (error) {
          console.error('Error reading logo file:', error);
        }
      } else {
        console.warn('Logo path specified but file not found:', fullLogoPath);
      }
    } else {
      console.log('No logo path in structure');
    }
    
    // Configure image module for logo insertion
    const imageModule = new ImageModule({
      fileType: 'docx',
      centered: false,
      getImage: (tagValue, tagName) => {
        console.log('getImage called with tagName:', tagName, 'tagValue type:', typeof tagValue);
        // If tag is structure_logo, return the image buffer
        if (tagName === 'structure_logo') {
          // If tagValue is already a buffer, return it
          if (Buffer.isBuffer(tagValue)) {
            console.log('Using buffer from tagValue, size:', tagValue.length, 'bytes');
            return tagValue;
          }
          // Otherwise use logoBuffer from closure
          if (logoBuffer) {
            console.log('Using logoBuffer from closure, size:', logoBuffer.length, 'bytes');
            return logoBuffer;
          }
          console.warn('No logo buffer available');
          return null;
        }
        return null;
      },
      getSize: (img, tagValue, tagName) => {
        // Return size in pixels (width, height)
        // Default size: 200x200 pixels
        // Note: The template should only use {structure_logo}, not {structure_logo: {width: 300, height: 300}}
        // Size customization should be done here in the code if needed
        if (tagName === 'structure_logo') {
          return [200, 200];
        }
        return [200, 200];
      },
    });
    
    const doc = new Docxtemplater(zip, {
      modules: [imageModule],
      paragraphLoop: true,
      linebreaks: true,
    });

    // Prepare data for template
    const dateProjet = candidature.date_projet 
      ? new Date(candidature.date_projet).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'N/A';

    const dateMiseEnOeuvre = candidature.date_mise_en_oeuvre
      ? new Date(candidature.date_mise_en_oeuvre).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : null;

    const dateSoumission = candidature.created_at
      ? new Date(candidature.created_at).toLocaleDateString('fr-FR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      : new Date().toLocaleDateString('fr-FR');

    // Format objectifs as list
    const objectifsList = candidature.objectifs && candidature.objectifs.length > 0
      ? candidature.objectifs.map((obj, index) => ({
          numero: index + 1,
          libelle: obj.libelle_objectif,
          resultat: obj.resultat_atteint || null,
        }))
      : [];

    // Prepare template data
    const templateData = {
      // Structure info
      structure_denomination: candidature.structure?.denomination || 'N/A',
      structure_sigle: candidature.structure?.sigle || 'N/A',
      structure_email: candidature.structure?.email || 'N/A',
      structure_type: candidature.structure?.type_structure || 'N/A',
      structure_adresse: candidature.structure?.adresse_postale || 'N/A',
      structure_responsable: candidature.structure?.identite_responsable || 'N/A',
      structure_contact: candidature.structure?.contact_responsable || 'N/A',
      structure_site_web: candidature.structure?.site_web || 'N/A',
      // Logo: will be inserted by image module if logo_path exists
      // Use {structure_logo} in template to insert the logo
      // IMPORTANT: Template must use {structure_logo} only, not {structure_logo: {width: 300, height: 300}}
      // Pass the buffer directly so the module can use it
      ...(logoBuffer ? { structure_logo: logoBuffer } : {}),
      
      // Candidature info
      categorie_prix: candidature.categorie_prix || 'N/A',
      sous_categorie: candidature.sous_categorie_special || '',
      date_projet: dateProjet,
      date_mise_en_oeuvre: dateMiseEnOeuvre || '',
      date_soumission: dateSoumission,
      numero_candidature: candidature.id,
      
      // Candidature details
      presentation_breve: candidature.presentation_breve || 'N/A',
      diagnostic: candidature.diagnostic || 'N/A',
      cible: candidature.cible || 'N/A',
      particularite: candidature.particularite || 'N/A',
      adequation_secteur: candidature.adequation_secteur || 'N/A',
      
      // Objectifs
      objectifs: objectifsList,
      has_objectifs: objectifsList.length > 0,
      
      // Perspectives
      perspectives_objectifs: candidature.perspectives?.objectifs_3_ans || '',
      perspectives_besoins: candidature.perspectives?.besoins_3_ans || '',
      has_perspectives: !!candidature.perspectives,
    };

    // Render document (replace placeholders)
    try {
      doc.render(templateData);
    } catch (renderError) {
      // Better error handling for template errors
      if (renderError.properties && renderError.properties.errors) {
        const errors = renderError.properties.errors;
        console.error('Template rendering errors:', JSON.stringify(errors, null, 2));
        return res.status(400).json({
          success: false,
          message: 'Erreur dans le template Word',
          error: 'Le template contient des erreurs de syntaxe',
          details: errors.map(err => ({
            message: err.message,
            explanation: err.properties?.explanation,
            context: err.properties?.context,
            file: err.properties?.file,
          })),
        });
      }
      throw renderError;
    }

    // Generate buffer from document
    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    });

    // Create temp directory if it doesn't exist
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Save temporary Word file
    tempWordPath = path.join(tempDir, `candidature-${id}-${Date.now()}.docx`);
    fs.writeFileSync(tempWordPath, buf);

    // Convert Word to PDF using LibreOffice
    // LibreOffice command: libreoffice --headless --convert-to pdf --outdir <output_dir> <input_file>
    tempPdfPath = tempWordPath.replace('.docx', '.pdf');
    const outputDir = path.dirname(tempWordPath);

    try {
      // Try to convert using LibreOffice
      await execAsync(
        `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${tempWordPath}"`
      );

      // Check if PDF was created
      if (!fs.existsSync(tempPdfPath)) {
        throw new Error('La conversion en PDF a échoué. LibreOffice n\'a pas généré le fichier PDF.');
      }

      // Read PDF file
      const pdfBuffer = fs.readFileSync(tempPdfPath);

      // Set response headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="candidature-${id}.pdf"`);

      // Send PDF
      res.send(pdfBuffer);

    } catch (conversionError) {
      console.error('LibreOffice conversion error:', conversionError);
      
      // Fallback: return Word file if LibreOffice is not available
      if (conversionError.message.includes('libreoffice') || conversionError.code === 'ENOENT') {
        console.warn('LibreOffice non disponible, retour du fichier Word');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', `attachment; filename="candidature-${id}.docx"`);
        res.send(buf);
      } else {
        throw conversionError;
      }
    }

  } catch (error) {
    console.error('Generate PDF from template error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la génération du PDF depuis le template',
      error: error.message,
    });
  } finally {
    // Cleanup temporary files
    try {
      if (tempWordPath && fs.existsSync(tempWordPath)) {
        fs.unlinkSync(tempWordPath);
      }
      if (tempPdfPath && fs.existsSync(tempPdfPath)) {
        fs.unlinkSync(tempPdfPath);
      }
    } catch (cleanupError) {
      console.error('Error cleaning up temp files:', cleanupError);
    }
  }
};

