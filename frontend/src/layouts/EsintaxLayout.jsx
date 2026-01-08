const EsintaxLayout = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      {/* Background with Burkina Faso flag colors */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              rgba(239, 43, 45, 0.15) 0%, 
              rgba(239, 43, 45, 0.15) 50%, 
              rgba(0, 150, 57, 0.15) 50%, 
              rgba(0, 150, 57, 0.15) 100%)`,
          }}
        >
          {/* Yellow star in center - subtle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-64 h-64 text-yellow-400 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M50 10 L60 40 L90 40 L68 58 L78 88 L50 70 L22 88 L32 58 L10 40 L40 40 Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - pages keep their own structure */}
      <div className="relative z-10 flex-1">
        {children}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="relative z-10 bg-gray-800 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-end space-x-6 text-sm">
          <a href="#" className="flex items-center space-x-2 hover:text-yellow-400 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <span>IMPOTS.GOV.BF</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-yellow-400 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            <span>FINANCES.GOV.BF</span>
          </a>
          <a href="#" className="flex items-center space-x-2 hover:text-yellow-400 transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>EXPERTS-COMPTABLES</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default EsintaxLayout;

