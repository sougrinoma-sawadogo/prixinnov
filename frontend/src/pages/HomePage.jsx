import { Link } from 'react-router-dom';
import EsintaxLayout from '../layouts/EsintaxLayout';

const HomePage = () => {
  return (
    <EsintaxLayout>
      <div 
        className="min-h-screen py-16 relative"
        style={{
          backgroundImage: 'url(https://esintax.bf/img/home/fond-home.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              PRINNOV/MEF 2026
            </h1>
            <h2 className="text-3xl font-semibold text-white mb-8 drop-shadow-lg">
              Ministère de l'Économie et des Finances - Burkina Faso
            </h2>
            <p className="text-xl text-white mb-12 max-w-3xl mx-auto drop-shadow-lg">
              Soumettez votre projet innovant en ligne et participez à la reconnaissance
              de l'excellence dans l'administration publique.
            </p>
            <Link
              to="/candidature"
              className="inline-block bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg uppercase"
            >
              Soumettre une candidature
            </Link>
          </div>

          {/* Section descriptive */}
          <div className="mt-16 mb-20">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                À propos du PRIXINNOV/MEF 2026
              </h3>
              <div className="prose prose-lg mx-auto text-gray-700 leading-relaxed">
                <p className="text-justify mb-4">
                Le Prix de l'Innovation du Ministère de l'Economie et des Finances (PRINNOV/MEF) s’adresse à toutes les directions, services et entités du Ministère de l’Économie et des Finances. Les candidatures peuvent être individuelles ou collectives.
                </p>
                <p className="text-justify mb-4">
                  Cette plateforme propose les <strong>formulaires officiels d'inscription</strong> pour le concours d'innovation organisés par le <strong>Ministère de l'Économie et des Finances du Burkina Faso</strong>. Les candidats peuvent postuler à <strong>quatre catégories distinctes</strong> : la <span className="text-red-700 font-semibold">Créativité</span>, l'<span className="text-yellow-700 font-semibold">Émergence</span>, l'<span className="text-green-700 font-semibold">Excellence</span>, ainsi que des <span className="text-amber-700 font-semibold">Prix Spéciaux</span> axés sur la souveraineté économique et l'engagement citoyen.
                </p>
                <p className="text-justify mb-4">
                  Chaque fiche exige des <strong>informations détaillées</strong> sur l'identité de la structure candidate et une <strong>présentation technique du projet novateur</strong> proposé. Les postulants doivent y justifier la pertinence de leur solution, définir les populations cibles et démontrer l'alignement de leur initiative avec les objectifs stratégiques du secteur financier.
                </p>
                <p className="text-justify">
                  Ces sources servent ainsi de <strong>cadre administratif</strong> pour évaluer et récompenser les progrès technologiques et sociaux au sein de l'administration publique burkinabè.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-lg">
              Catégories de Prix
            </h3>
          </div>

          <div className="mt-8 grid md:grid-cols-4 gap-8">
            <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border-l-4 border-red-600">
              <h3 className="text-xl font-semibold mb-2 text-red-700">Créativité</h3>
              <p className="text-gray-700">
                Pour les innovations au stade d'idée
              </p>
            </div>
            <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
              <h3 className="text-xl font-semibold mb-2 text-yellow-700">Émergence</h3>
              <p className="text-gray-700">
                Pour les projets en cours de mise en œuvre
              </p>
            </div>
            <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border-l-4 border-green-600">
              <h3 className="text-xl font-semibold mb-2 text-green-700">Excellence</h3>
              <p className="text-gray-700">
                Pour les innovations confirmées avec résultats probants
              </p>
            </div>
            <div className="bg-white bg-opacity-95 backdrop-blur-sm p-6 rounded-lg shadow-lg border-l-4 border-amber-600">
              <h3 className="text-xl font-semibold mb-2 text-amber-700">Spéciaux</h3>
              <p className="text-gray-700">
                Souveraineté économique ou Engagement citoyen
              </p>
            </div>
          </div>
        </div>
      </div>
    </EsintaxLayout>
  );
};

export default HomePage;

