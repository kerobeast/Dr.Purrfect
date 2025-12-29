
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, User, Stethoscope, LogOut, Bell, PawPrint, Info, Sparkles, Heart, Mail, ShieldPlus, Lock, ArrowRight, ShieldCheck, KeyRound, Settings, UserCircle, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { MOCK_OWNERS, MOCK_PETS, MOCK_VISITS } from './mockData';
import { ViewRole, FullVisitRecord, Owner, Pet, Visit, PetType, Gender } from './types';
import AdminDashboard from './components/AdminDashboard';
import OwnerPortal from './components/OwnerPortal';
import Toast from './components/Toast';

const ACCESS_CODE_KEY = 'dr_purrfect_vet_key';
const DEFAULT_KEY = 'doctor123';

const HeroBanner: React.FC<{ role: ViewRole }> = ({ role }) => (
  <div className="relative overflow-hidden mb-8 rounded-[2.5rem] bg-white border border-slate-200 shadow-xl shadow-emerald-900/5">
    <div className="absolute inset-0 flex flex-col md:flex-row">
      <div className="flex-1 bg-amber-50/50" />
      <div className="flex-1 bg-emerald-500/5" />
    </div>
    
    <div className="relative px-8 py-12 md:py-16 flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold animate-bounce">
          <Sparkles size={16} />
          <span>New: Lifestyle & Diet Tracking</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
          One Dashboard for a <span className="text-emerald-600 italic">Lifetime</span> of Tail Wags.
        </h1>
        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-xl">
          Dr. Purrfect bridges the gap between clinics, giving you and your vet a single, continuous history of your pet's health.
        </p>
      </div>

      <div className="flex-1 relative hidden md:block">
        <div className="relative z-10 w-full aspect-video rounded-3xl overflow-hidden shadow-2xl bg-emerald-100 flex items-center justify-center group">
          <img 
            src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800" 
            alt="Happy pet and owner" 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <Heart size={20} className="fill-white" />
             </div>
             <div>
               <p className="text-slate-900 font-bold text-sm">Empathetic Care</p>
               <p className="text-slate-500 text-xs font-medium">Trusted by 10k+ Pet Parents</p>
             </div>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-200/50 rounded-full blur-3xl -z-0" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-400/30 rounded-full blur-3xl -z-0" />
      </div>
    </div>
  </div>
);

const VetLogin: React.FC<{ onAuthenticate: () => void }> = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedKey = localStorage.getItem(ACCESS_CODE_KEY) || DEFAULT_KEY;
    
    if (password === storedKey) {
      onAuthenticate();
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16" />
        
        <div className="relative text-center mb-8">
          <div className="inline-flex p-4 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-200 mb-6">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Clinician Access Only</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">Protected Practice Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Practice Key</label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" 
                placeholder="Enter access code..." 
                className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none font-bold text-slate-900 transition-all ${error ? 'border-rose-300 bg-rose-50' : 'border-slate-50 focus:border-emerald-500 focus:bg-white'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-rose-600 text-[10px] font-black uppercase text-center mt-2 tracking-widest">Invalid Credentials</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl active:scale-[0.98]"
          >
            Authenticate <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
          <ShieldCheck size={20} className="text-blue-500 shrink-0" />
          <p className="text-[10px] font-bold text-blue-800 leading-snug">This area contains sensitive medical data protected by HIPAA-compliant protocols.</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [role, setRole] = useState<ViewRole>('OWNER');
  const [isVetAuthenticated, setIsVetAuthenticated] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Nav Dropdowns state
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [owners] = useState<Owner[]>(MOCK_OWNERS);
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [visits, setVisits] = useState<Visit[]>(MOCK_VISITS);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fullRecords = useMemo(() => {
    return visits.map(v => {
      const pet = pets.find(p => p.id === v.pet_id);
      const owner = pet ? owners.find(o => o.id === pet.owner_id) : null;
      
      const flat = v as any;

      return {
        ...v,
        display_id: flat.display_id || pet?.display_id || 'N/A',
        owner_name: flat.owner_name || owner?.name || 'Unknown Owner',
        pet_name: flat.pet_name || pet?.pet_name || 'Unknown Pet',
        pet_type: flat.pet_type || pet?.pet_type || PetType.OTHER,
        gender: flat.gender || pet?.gender || Gender.OTHER,
        breed: flat.breed || pet?.breed || 'Mixed Breed',
        age: flat.age || pet?.age || 'Unknown Age',
        color: flat.color || pet?.color || 'N/A',
        birth_date: flat.birth_date || pet?.birth_date || new Date().toISOString().split('T')[0],
        vaccinations: v.vaccinations || 'None recorded',
        recommendations: v.recommendations || 'No specific recommendations provided.',
        symptoms: v.symptoms || 'None reported.',
        doctor_name: v.doctor_name || 'Unknown Doctor',
        follow_up_date: v.follow_up_date || '',
        owner_phone_confirmation: v.owner_phone_confirmation || owner?.phone_number || '',
        owner_phone_country_code: v.owner_phone_country_code || '+1',
        diet_water: v.diet_water || 'Normal',
        stool_color: v.stool_color || 'Normal',
        stool_consistency: v.stool_consistency || 'Normal',
        stool_frequency: v.stool_frequency || 'Normal'
      } as FullVisitRecord;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [visits, pets, owners]);

  const handleAddOrUpdateRecord = (newRecord: FullVisitRecord) => {
    if (newRecord.id && visits.some(v => v.id === newRecord.id)) {
      setVisits(prev => prev.map(v => v.id === newRecord.id ? { ...v, ...newRecord } : v));
      showToast("Health record updated successfully.", 'info');
    } else {
      const newId = `v${Date.now()}`;
      let petId = newRecord.pet_id;
      let displayId = newRecord.display_id;

      const existingPet = pets.find(p => p.pet_name.toLowerCase() === newRecord.pet_name.toLowerCase() && p.owner_id === (owners.find(o => o.name === newRecord.owner_name)?.id));
      
      if (!existingPet && !petId) {
        petId = `p${Date.now()}`;
        const nextIdNumber = pets.length + 1001;
        displayId = nextIdNumber.toString();
        
        const newPet: Pet = {
          id: petId,
          display_id: displayId,
          owner_id: owners[0].id,
          pet_name: newRecord.pet_name,
          pet_type: newRecord.pet_type,
          gender: newRecord.gender,
          breed: newRecord.breed,
          age: newRecord.age,
          color: newRecord.color,
          birth_date: newRecord.birth_date
        };
        setPets(prev => [...prev, newPet]);
      } else if (existingPet) {
        petId = existingPet.id;
        displayId = existingPet.display_id;
      }

      setVisits(prev => [{ ...newRecord, id: newId, pet_id: petId, display_id: displayId }, ...prev]);
      
      let message = `Prescription sent to ${newRecord.owner_name} via SMS.`;
      if (newRecord.follow_up_date) {
        message += ` Follow-up reminder scheduled for ${newRecord.follow_up_date}.`;
      }
      showToast(message, 'success');
    }
  };

  const handleDeleteRecord = (id: string) => {
    setVisits(prev => prev.filter(v => v.id !== id));
    showToast("Record deleted.", 'info');
  };

  const handleSwitchToVet = () => {
    setRole('VET');
    setIsProfileOpen(false);
  };

  const handleLogoutVet = () => {
    setIsVetAuthenticated(false);
    setIsProfileOpen(false);
    showToast("Session locked.", 'info');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-200">
            <Stethoscope size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dr. <span className="text-emerald-500 font-extrabold">Purrfect</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <div className="flex bg-slate-100 p-1.5 rounded-[1.25rem] border border-slate-200/50">
            <button 
              onClick={() => setRole('OWNER')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${role === 'OWNER' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <User size={16} /> Pet Owner
            </button>
            <button 
              onClick={handleSwitchToVet}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold transition-all ${role === 'VET' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Stethoscope size={16} /> Veterinarian
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell Dropdown */}
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2.5 rounded-xl transition-all relative ${isNotificationsOpen ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-4 w-80 bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 space-y-4 animate-in slide-in-from-top-2 duration-200 z-[60]">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Clinical Feed</h4>
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">3 New</span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-emerald-50 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">Mochi's vaccine booster due</p>
                      <p className="text-[9px] text-slate-400 font-medium">Scheduled for tomorrow, 10:00 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-emerald-50 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">Lab Results: Patient Luna</p>
                      <p className="text-[9px] text-slate-400 font-medium">Bloodwork finalized by lab 2h ago</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">
                  View All Activity
                </button>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-2 w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 border border-emerald-300 items-center justify-center text-emerald-800 font-bold shadow-sm transition-all hover:scale-105 active:scale-95 ${isProfileOpen ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
            >
              {role === 'VET' ? 'JD' : 'AR'}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-4 w-64 bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden animate-in slide-in-from-top-2 duration-200 z-[60]">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-black text-slate-900">{role === 'VET' ? 'Dr. Jane Doe' : 'Alex Rivera'}</p>
                  <p className="text-[10px] font-medium text-slate-500">{role === 'VET' ? 'Chief Clinician' : 'Household Owner'}</p>
                </div>
                
                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left">
                    <UserCircle size={16} className="text-slate-400" /> My Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left">
                    <Settings size={16} className="text-slate-400" /> Practice Settings
                  </button>
                  <div className="h-px bg-slate-100 my-2 mx-2" />
                  {role === 'VET' && isVetAuthenticated && (
                    <button 
                      onClick={handleLogoutVet}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <Lock size={16} /> Lock Dashboard
                    </button>
                  )}
                  <button 
                    onClick={() => { setRole(role === 'VET' ? 'OWNER' : 'VET'); setIsProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 transition-colors text-left"
                  >
                    <ArrowRight size={16} /> Switch to {role === 'VET' ? 'Owner' : 'Vet'} View
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <HeroBanner role={role} />

        <div className="md:hidden flex mb-8 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           <button 
              onClick={() => setRole('OWNER')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${role === 'OWNER' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
            >
              <User size={18} /> Pet Owner
            </button>
            <button 
              onClick={handleSwitchToVet}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all ${role === 'VET' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
            >
              <Stethoscope size={18} /> Vet
            </button>
        </div>

        {role === 'VET' ? (
          isVetAuthenticated ? (
            <AdminDashboard 
              records={fullRecords} 
              onAddRecord={handleAddOrUpdateRecord}
              onDeleteRecord={handleDeleteRecord}
              onLogout={handleLogoutVet}
              onUpdateKey={(msg) => showToast(msg, 'success')}
            />
          ) : (
            <VetLogin onAuthenticate={() => setIsVetAuthenticated(true)} />
          )
        ) : (
          <OwnerPortal 
            owners={owners}
            pets={pets}
            visits={visits}
            onUploadPhoto={(message) => showToast(message, 'info')}
          />
        )}
      </main>

      {toast && (
        <Toast message={toast.message} type={toast.type} />
      )}
      
      <footer className="py-5 px-6 border-t border-slate-200 mt-12 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-emerald-600">
            <Stethoscope size={18} />
            <span className="text-sm font-black tracking-tight">Dr. Purrfect</span>
          </div>
          <div className="h-4 w-px bg-slate-200 hidden md:block" />
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">&copy; 2025 Digital Care</p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <a 
            href="mailto:doctorpurrfect@gmail.com" 
            className="group flex items-center gap-2 text-[10px] font-black text-slate-900 uppercase tracking-widest transition-all px-4 py-2 bg-slate-50 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 border border-slate-100"
          >
            <Mail size={14} className="text-emerald-500 group-hover:scale-110 transition-transform" /> 
            doctorpurrfect@gmail.com
          </a>
          <div className="flex items-center gap-3 text-slate-300">
             <Heart size={14} className="hover:text-rose-400 transition-colors cursor-help" />
             <ShieldPlus size={14} className="hover:text-emerald-400 transition-colors cursor-help" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
