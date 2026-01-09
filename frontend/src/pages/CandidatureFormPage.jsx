import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import EsintaxLayout from '../layouts/EsintaxLayout';
import StructureForm from '../components/candidature/StructureForm';
import CategorySelector from '../components/candidature/CategorySelector';
import CreativiteForm from '../components/candidature/CreativiteForm';
import EmergenceExcellenceForm from '../components/candidature/EmergenceExcellenceForm';
import SpeciauxForm from '../components/candidature/SpeciauxForm';
import PiecesJointesForm from '../components/candidature/PiecesJointesForm';
import { candidatureService } from '../services/candidatureService';
import { structureService } from '../services/structureService';
import { fileService } from '../services/fileService';

const CandidatureFormPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [structure, setStructure] = useState(null);
  const [categorie, setCategorie] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [piecesJointes, setPiecesJointes] = useState([]);

  const { handleSubmit, control, watch, setValue } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      // Create structure first if not exists
      let structureId = structure?.id;
      if (!structureId) {
        const structureData = {
          denomination: data.denomination,
          sigle: data.sigle,
          adresse_postale: data.adresse_postale,
          email: data.email,
          identite_responsable: data.identite_responsable,
          contact_responsable: data.contact_responsable,
          site_web: data.site_web && data.site_web.trim() !== '' ? data.site_web.trim() : null,
          type_structure: data.type_structure,
        };

        console.log('=== CRÉATION STRUCTURE ===');
        console.log('Structure data:', structureData);
        console.log('Logo file:', data.logo ? {
          name: data.logo.name,
          size: data.logo.size,
          type: data.logo.type
        } : 'Aucun logo');
        console.log('==========================');

        const structureResult = await structureService.create(
          structureData,
          data.logo
        );
        structureId = structureResult.data.id;
        
        console.log('Structure créée avec ID:', structureId);
        console.log('Structure result:', structureResult);
      }

      // Prepare candidature data
      const candidatureData = {
        structure_id: structureId,
        categorie_prix: categorie,
        sous_categorie_special: data.sous_categorie_special,
        presentation_breve: data.presentation_breve,
        date_projet: data.date_projet,
        date_mise_en_oeuvre: data.date_mise_en_oeuvre,
        diagnostic: data.diagnostic,
        cible: data.cible,
        particularite: data.particularite,
        adequation_secteur: data.adequation_secteur,
        objectifs: data.objectifs || [],
        perspectives: data.perspectives,
      };

      const result = await candidatureService.create(candidatureData);

      if (result.success) {
        const candidatureId = result.data.id;

        // Upload pieces jointes if any
        if (piecesJointes.length > 0) {
          try {
            await Promise.all(
              piecesJointes.map((fileItem) =>
                fileService.uploadPieceJointe(
                  candidatureId,
                  fileItem.file,
                  fileItem.label || 'Contrat'
                )
              )
            );
          } catch (uploadError) {
            console.error('Error uploading files:', uploadError);
            // Don't block the success page, but log the error
          }
        }

        navigate('/candidature/success', { state: { candidatureId } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la soumission');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    /* if (step === 1 && !structure) {
      setError('Veuillez créer ou sélectionner une structure');
      return;
    } */
    if (step === 2 && !categorie) {
      setError('Veuillez sélectionner une catégorie de prix');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
    setError('');
  };

  return (
    <EsintaxLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Formulaire de Candidature
          </h1>
          <p className="text-sm text-gray-600">
            Veuillez remplir toutes les étapes pour soumettre votre candidature
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className={`text-xs ${step >= 1 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
              Structure
            </span>
            <span className={`text-xs ${step >= 2 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
              Catégorie
            </span>
            <span className={`text-xs ${step >= 3 ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
              Détails
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <StructureForm
              setValue={setValue}
              control={control}
              structure={structure}
              setStructure={setStructure}
            />
          )}

          {step === 2 && (
            <CategorySelector
              categorie={categorie}
              setCategorie={setCategorie}
            />
          )}

          {step === 3 && (
            <>
              {categorie === 'Créativité' && (
                <CreativiteForm control={control} watch={watch} setValue={setValue} />
              )}
              {['Émergence', 'Excellence'].includes(categorie) && (
                <EmergenceExcellenceForm
                  control={control}
                  watch={watch}
                  setValue={setValue}
                  categorie={categorie}
                />
              )}
              {categorie === 'Spéciaux' && (
                <SpeciauxForm control={control} watch={watch} setValue={setValue} />
              )}
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <PiecesJointesForm
                  candidatureId={null}
                  onFilesChange={setPiecesJointes}
                  existingFiles={[]}
                />
              </div>
            </>
          )}

          <div className="flex justify-between pt-6 border-t border-gray-200">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Précédent
              </button>
            )}
            <div className={`${step > 1 ? 'ml-auto' : 'ml-auto'}`}>
              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Suivant
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors uppercase font-semibold"
                >
                  {loading ? 'Soumission...' : 'Soumettre la candidature'}
                </button>
              )}
            </div>
          </div>
        </form>
            </div>
          </div>
        </div>
      </div>
    </EsintaxLayout>
  );
};

export default CandidatureFormPage;

