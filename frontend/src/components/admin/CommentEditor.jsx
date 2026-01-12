const CommentEditor = ({ commentaire, onCommentaireChange, loading }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Commentaire d'évaluation
      </label>
      <textarea
        value={commentaire || ''}
        onChange={(e) => onCommentaireChange(e.target.value)}
        rows={4}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
        placeholder="Ajoutez un commentaire sur l'évaluation (optionnel)..."
      />
      <p className="mt-1 text-xs text-gray-500">
        Commentaire visible par la structure candidate
      </p>
    </div>
  );
};

export default CommentEditor;

