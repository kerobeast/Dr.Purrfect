
import React from 'react';
import { X, Download, ZoomIn } from 'lucide-react';

interface Props {
  imageUrl: string | null;
  onClose: () => void;
}

const ImageLightbox: React.FC<Props> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
      <div 
        className="absolute inset-0 bg-slate-900/95 backdrop-blur-md" 
        onClick={onClose} 
      />
      
      <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center z-10">
        <div className="absolute top-0 right-0 left-0 flex justify-between items-center p-4 md:p-0 mb-8">
           <div className="flex items-center gap-3 text-white">
              <div className="bg-emerald-500 p-2 rounded-xl">
                 <ZoomIn size={20} />
              </div>
              <span className="font-bold tracking-tight text-lg">Image Inspection</span>
           </div>
           <div className="flex gap-2">
             <button 
               onClick={() => window.open(imageUrl, '_blank')}
               className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10"
               title="Download Image"
             >
               <Download size={24} />
             </button>
             <button 
               onClick={onClose}
               className="p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full transition-all shadow-lg shadow-emerald-900/40"
               title="Close"
             >
               <X size={24} />
             </button>
           </div>
        </div>

        <div className="w-full h-[80vh] flex items-center justify-center rounded-[2.5rem] overflow-hidden bg-slate-800 shadow-2xl border border-white/5 group">
          <img 
            src={imageUrl} 
            alt="Enlarged view" 
            className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-500"
          />
        </div>
        
        <p className="mt-6 text-slate-400 text-sm font-medium bg-white/5 px-4 py-2 rounded-full border border-white/5">
          Click outside or use the close button to return
        </p>
      </div>
    </div>
  );
};

export default ImageLightbox;
