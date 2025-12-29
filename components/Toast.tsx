
import React from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface Props {
  message: string;
  type: 'success' | 'info';
}

const Toast: React.FC<Props> = ({ message, type }) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-8 duration-500 ease-out">
      <div className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] shadow-2xl border-2 ${
        type === 'success' 
          ? 'bg-emerald-900 text-white border-emerald-800' 
          : 'bg-white text-slate-900 border-slate-100'
      }`}>
        {type === 'success' ? <CheckCircle className="text-emerald-400" /> : <Info className="text-blue-500" />}
        <span className="font-bold tracking-tight whitespace-nowrap">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
