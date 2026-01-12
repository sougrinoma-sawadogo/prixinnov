const NoteEditor = ({ note, onNoteChange, loading }) => {
  const handleNoteChange = (e) => {
    const value = e.target.value;
    // Allow empty, numbers, and one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      // Only allow values between 0 and 20
      if (value === '' || (!isNaN(numValue) && numValue >= 0 && numValue <= 20)) {
        onNoteChange(value === '' ? null : numValue);
      }
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Note finale /20
      </label>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="0"
          max="20"
          step="0.1"
          value={note !== null && note !== undefined ? note : ''}
          onChange={handleNoteChange}
          disabled={loading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
          placeholder="0.00"
        />
        <span className="text-gray-500 font-medium">/20</span>
      </div>
      <p className="mt-1 text-xs text-gray-500">
        Note sur 20 points (optionnel)
      </p>
    </div>
  );
};

export default NoteEditor;

