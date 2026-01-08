import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { Candidature, Structure, ObjectifResultat, PerspectiveSuivi } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    
    doc.fontSize(10).font('Helvetica');
    doc.text('═══════════════════════', leftX, currentY);
    currentY += 12;
    
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('CABINET', leftX, currentY);
    currentY += 10;
    
    doc.fontSize(10).font('Helvetica');
    doc.text('═══════════════════════', leftX, currentY);
    currentY += 12;
    
    doc.fontSize(11).font('Helvetica-Bold');
    doc.text('COMITE DE COORDINATION', leftX, currentY);
    currentY += 12;
    doc.text('DU PRIX DE L\'INNOVATION', leftX, currentY);
    currentY += 10;
    
    doc.fontSize(9).font('Helvetica');
    doc.text('_ _ _ _ _ _ _ _ _ _ _ _ _', leftX, currentY);
    
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
    doc.fontSize(14).font('Helvetica-Bold');
    doc.fillColor('blue');
    const titleText = 'Fiche de candidature';
    const titleTextWidth = doc.widthOfString(titleText);
    doc.text(titleText, (pageWidth - titleTextWidth) / 2, titleY);
    
    const categoryY = titleY + 18;
    const categoryText = `CATEGORIE PRIX « ${candidature.categorie_prix.toUpperCase()} »`;
    doc.fontSize(12).font('Helvetica-Bold');
    doc.fillColor('blue');
    const categoryTextWidth = doc.widthOfString(categoryText);
    doc.text(categoryText, (pageWidth - categoryTextWidth) / 2, categoryY);
    
    // Reset color to black
    doc.fillColor('black');
    
    // Move down after header
    doc.y = margin + headerHeight + 20;

    // Structure information
    doc.fontSize(14).text('INFORMATIONS DE LA STRUCTURE', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Dénomination: ${candidature.structure?.denomination || 'N/A'}`);
    doc.text(`Sigle: ${candidature.structure?.sigle || 'N/A'}`);
    doc.text(`Email: ${candidature.structure?.email || 'N/A'}`);
    doc.text(`Type: ${candidature.structure?.type_structure || 'N/A'}`);
    doc.moveDown();

    // Candidature details
    doc.fontSize(14).text('DÉTAILS DE LA CANDIDATURE', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Catégorie de prix: ${candidature.categorie_prix}`);
    if (candidature.sous_categorie_special) {
      doc.text(`Sous-catégorie: ${candidature.sous_categorie_special}`);
    }
    doc.text(`Date du projet: ${candidature.date_projet}`);
    if (candidature.date_mise_en_oeuvre) {
      doc.text(`Date de mise en œuvre: ${candidature.date_mise_en_oeuvre}`);
    }
    doc.moveDown();

    doc.text('Présentation brève:', { underline: true });
    doc.text(candidature.presentation_breve || 'N/A');
    doc.moveDown();

    doc.text('Diagnostic:', { underline: true });
    doc.text(candidature.diagnostic || 'N/A');
    doc.moveDown();

    doc.text('Cible impactée:', { underline: true });
    doc.text(candidature.cible || 'N/A');
    doc.moveDown();

    doc.text('Particularité:', { underline: true });
    doc.text(candidature.particularite || 'N/A');
    doc.moveDown();

    doc.text('Adéquation avec le secteur:', { underline: true });
    doc.text(candidature.adequation_secteur || 'N/A');
    doc.moveDown();

    // Objectifs
    if (candidature.objectifs && candidature.objectifs.length > 0) {
      doc.fontSize(14).text('OBJECTIFS', { underline: true });
      doc.moveDown(0.5);
      candidature.objectifs.forEach((obj, index) => {
        doc.fontSize(12);
        doc.text(`${index + 1}. ${obj.libelle_objectif}`);
        if (obj.resultat_atteint) {
          doc.text(`   Résultat: ${obj.resultat_atteint}`, { indent: 20 });
        }
        doc.moveDown(0.3);
      });
    }

    // Perspectives
    if (candidature.perspectives) {
      doc.addPage();
      doc.fontSize(14).text('PERSPECTIVES À 3 ANS', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(12);
      doc.text('Objectifs:', { underline: true });
      doc.text(candidature.perspectives.objectifs_3_ans || 'N/A');
      doc.moveDown();
      doc.text('Besoins:', { underline: true });
      doc.text(candidature.perspectives.besoins_3_ans || 'N/A');
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

