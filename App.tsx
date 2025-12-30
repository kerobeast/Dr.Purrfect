
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Plus, User, Stethoscope, LogOut, Bell, PawPrint, Info, Sparkles, Heart, Mail, ShieldPlus, Lock, ArrowRight, ShieldCheck, KeyRound, Settings, UserCircle, ChevronDown, CheckCircle2, Clock, FileText, X, ArrowLeft, UserRound, Phone, AtSign, Shield, History, CalendarDays } from 'lucide-react';
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
    
    <div className="relative px-6 md:px-8 py-10 md:py-16 flex flex-col md:flex-row items-center gap-10 md:gap-12 max-w-6xl mx-auto">
      <div className="flex-1 space-y-6 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] md:text-sm font-bold animate-bounce">
            <Sparkles size={16} />
            <span>New: Lifestyle & Diet Tracking</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[9px] md:text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200/50">
            <FileText size={14} className="text-emerald-400" />
            <span>A Digital Prescription Pad</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
          One Dashboard for a <span className="text-emerald-600 italic">Lifetime</span> of Tail Wags.
        </h1>
        <p className="text-slate-500 text-base md:text-xl font-medium max-w-xl">
          Dr. Purrfect bridges the gap between clinics, giving you and your vet a single, continuous history of your pet's health.
        </p>
      </div>

      <div className="flex-1 relative w-full max-w-lg md:max-w-none">
        <div className="relative z-10 w-full aspect-[4/3] md:aspect-video rounded-3xl overflow-hidden shadow-2xl bg-emerald-100 flex items-center justify-center group border border-white/50">
          <img 
            src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80&w=800" 
            alt="Happy pet and owner" 
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/10 to-transparent" />
        </div>
        
        <div className="mt-4 md:mt-6 p-4 bg-white/95 backdrop-blur-md rounded-2xl flex items-center gap-4 border border-slate-100 shadow-xl shadow-emerald-900/5 relative z-20 animate-in slide-in-from-bottom-2 duration-700 mx-auto md:mx-0 max-w-xs md:max-w-none">
           <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0">
              <Heart size={20} className="fill-white" />
           </div>
           <div className="text-left">
             <p className="text-slate-900 font-bold text-sm">Empathetic Care</p>
             <p className="text-slate-500 text-[10px] md:text-xs font-medium">Trusted by 10k+ Pet Parents</p>
           </div>
        </div>

        <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-200/40 rounded-full blur-3xl -z-0" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-400/20 rounded-full blur-3xl -z-0" />
      </div>
    </div>
  </div>
);

const ActivityModal: React.FC<{ isOpen: boolean; onClose: () => void; isUserLoggedIn: boolean }> = ({ isOpen, onClose, isUserLoggedIn }) => {
  if (!isOpen) return null;

  const activities = [
    { id: 1, title: "Vaccination Reminder", desc: "Mochi's DHPP booster is due tomorrow.", time: "2 hours ago", type: "alert" },
    { id: 2, title: "Prescription Sync", desc: "Luna's clinical notes were updated by Dr. Thorne.", time: "5 hours ago", type: "info" },
    { id: 3, title: "Vault Access", desc: "New record added to the digital health vault.", time: "1 day ago", type: "success" },
    { id: 4, title: "Profile Update", desc: "Alex Rivera updated the household profile.", time: "2 days ago", type: "info" }
  ];

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                <History size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900">Clinical Activity Log</h3>
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">Real-time Practice Feed</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><X size={20} /></button>
          </div>

          {!isUserLoggedIn ? (
            <div className="py-20 text-center">
              <Lock size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold">Please sign in to view your activity log.</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {activities.map((act) => (
                <div key={act.id} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${act.type === 'alert' ? 'bg-rose-50 text-rose-500' : act.type === 'success' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'}`}>
                    {act.type === 'alert' ? <Clock size={18} /> : act.type === 'success' ? <CheckCircle2 size={18} /> : <Info size={18} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-[13px] font-black text-slate-900">{act.title}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">{act.time}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 mt-1 leading-relaxed">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button onClick={onClose} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-emerald-600 transition-all">Dismiss History</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const VetLogin: React.FC<{ onAuthenticate: () => void; onBack: () => void }> = ({ onAuthenticate, onBack }) => {
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
    <div className="max-w-md mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden">
        <button 
          onClick={onBack}
          className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 transition-colors z-20"
        >
          <X size={20} />
        </button>

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

const ProfileModal: React.FC<{ isOpen: boolean; onClose: () => void; role: ViewRole; owner: Owner | null; pets: Pet[]; isVetAuthenticated: boolean }> = ({ isOpen, onClose, role, owner, pets, isVetAuthenticated }) => {
  if (!isOpen) return null;

  const getProfileName = () => {
    if (role === 'VET') return isVetAuthenticated ? 'Dr. Jane Doe' : 'Clinician Not Authenticated';
    return owner?.name || 'Guest Explorer';
  };

  const getProfileInitials = () => {
    if (role === 'VET') return isVetAuthenticated ? 'JD' : '?';
    if (owner) return owner.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    return '?';
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        <div className="p-10">
          <div className="flex justify-between items-start mb-8">
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black shadow-xl ${role === 'VET' && isVetAuthenticated ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-slate-100 text-slate-400 shadow-slate-100'}`}>
              {getProfileInitials()}
            </div>
            <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-600 rounded-full transition-colors"><X size={24} /></button>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-black text-slate-900">{getProfileName()}</h3>
            <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mt-1">{role === 'VET' ? 'Clinical Workspace' : 'Personal Health Vault'}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <Mail className="text-slate-400" size={18} />
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Email Address</p>
                <p className="text-xs font-bold text-slate-700">{role === 'VET' ? (isVetAuthenticated ? 'jane.doe@drpurrfect.vet' : 'Authentication Required') : (owner?.email || 'No email registered')}</p>
              </div>
            </div>
            {role === 'OWNER' && owner && (
              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Registered Companions</p>
                  <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-100">{pets.filter(p => p.owner_id === owner.id).length}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pets.filter(p => p.owner_id === owner.id).map(pet => (
                    <div key={pet.id} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-xl border border-emerald-100">
                      <PawPrint size={10} className="text-emerald-500" />
                      <span className="text-[10px] font-black text-slate-700">{pet.pet_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 pt-6 border-t border-slate-100 flex gap-4">
            <button className="flex-1 py-3.5 bg-slate-100 text-slate-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">Settings</button>
            <button onClick={onClose} className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200">Done</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [role, setRole] = useState<ViewRole>('OWNER');
  const [isVetAuthenticated, setIsVetAuthenticated] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const [activeOwner, setActiveOwner] = useState<Owner | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const [owners, setOwners] = useState<Owner[]>(MOCK_OWNERS);
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [visits, setVisits] = useState<Visit[]>(MOCK_VISITS);

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
    const allRecords: FullVisitRecord[] = [];
    pets.forEach(pet => {
      const petVisits = visits.filter(v => v.pet_id === pet.id);
      const owner = owners.find(o => o.id === pet.owner_id);
      
      if (petVisits.length === 0) {
        allRecords.push({
          id: `no-visit-${pet.id}`,
          pet_id: pet.id,
          date: '', 
          weight: 0,
          temperature: 0,
          heart_rate: 0,
          symptoms: 'No visits recorded yet.',
          diagnosis: 'Initial Profile Created',
          prescription: 'N/A',
          recommendations: 'N/A',
          doctor_name: 'Owner Profile',
          display_id: pet.display_id,
          owner_name: owner?.name || 'Unknown Owner',
          pet_name: pet.pet_name,
          pet_type: pet.pet_type,
          gender: pet.gender,
          breed: pet.breed,
          age: pet.age,
          color: pet.color,
          birth_date: pet.birth_date,
          profile_photo_url: pet.profile_photo_url,
        } as FullVisitRecord);
      } else {
        petVisits.forEach(v => {
          allRecords.push({
            ...v,
            display_id: pet.display_id,
            owner_name: owner?.name || 'Unknown Owner',
            pet_name: pet.pet_name,
            pet_type: pet.pet_type,
            gender: pet.gender,
            breed: pet.breed,
            age: pet.age,
            color: pet.color,
            birth_date: pet.birth_date,
            weight: v.weight || 0,
            temperature: v.temperature || 0,
            heart_rate: v.heart_rate || 0,
            profile_photo_url: pet.profile_photo_url,
          } as FullVisitRecord);
        });
      }
    });

    return allRecords.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [visits, pets, owners]);

  const handleAddOwner = (newOwner: Owner) => {
    setOwners(prev => [...prev, newOwner]);
    setActiveOwner(newOwner);
    showToast(`Household created for ${newOwner.name}. Welcome!`, 'success');
  };

  const handleAddPet = (newPet: Pet) => {
    setPets(prev => [...prev, newPet]);
    setSelectedPet(newPet);
    showToast(`Registered ${newPet.pet_name} to your household.`, 'success');
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    setPets(prev => prev.map(p => p.id === updatedPet.id ? updatedPet : p));
    showToast(`${updatedPet.pet_name}'s profile portrait updated.`, 'success');
  };

  const handleAddOrUpdateRecord = (newRecord: Visit) => {
    if (newRecord.id && visits.some(v => v.id === newRecord.id)) {
      setVisits(prev => prev.map(v => v.id === newRecord.id ? { ...v, ...newRecord } : v));
      showToast("Health record updated successfully.", 'info');
    } else {
      const newId = `v${Date.now()}`;
      setVisits(prev => [{ ...newRecord, id: newId }, ...prev]);
      
      if (newRecord.is_external) {
        showToast("Record successfully synced to your pet's vault.", 'success');
      } else {
        showToast("Prescription sent to owner via SMS.", 'success');
      }
    }
  };

  const handleDeleteRecord = (id: string) => {
    setVisits(prev => prev.filter(v => v.id !== id));
    showToast("Record deleted.", 'info');
  };

  const handleSwitchToVet = () => {
    setRole('VET');
    setIsProfileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToOwner = () => {
    setRole('OWNER');
    setIsProfileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutVet = () => {
    setIsVetAuthenticated(false);
    setIsProfileOpen(false);
    showToast("Session locked.", 'info');
  };

  const handleLogoutOwner = () => {
    setActiveOwner(null);
    setSelectedPet(null);
    setIsProfileOpen(false);
    showToast("Signed out successfully.", 'info');
  };

  const getInitials = () => {
    if (role === 'VET') return isVetAuthenticated ? 'JD' : '?';
    if (activeOwner) {
      return activeOwner.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    }
    return '?';
  };

  const getCurrentName = () => {
    if (role === 'VET') return isVetAuthenticated ? 'Dr. Jane Doe' : 'Locked Workspace';
    if (activeOwner) return activeOwner.name;
    return 'Guest User';
  };

  const isUserLoggedIn = role === 'VET' ? isVetAuthenticated : !!activeOwner;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900 relative">
      <nav className="sticky top-0 z-[300] bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={handleSwitchToOwner} className="bg-emerald-500 p-2 md:p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-200 hover:scale-105 active:scale-95 transition-all">
            <Stethoscope size={20} className="md:w-6 md:h-6" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight hidden sm:block">
            Dr. <span className="text-emerald-500 font-extrabold">Purrfect</span>
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex bg-slate-100 p-1 rounded-2xl md:rounded-[1.25rem] border border-slate-200/50">
            <button 
              onClick={handleSwitchToOwner}
              className={`flex items-center gap-1.5 px-3 md:px-5 py-1.5 md:py-2 rounded-xl text-[10px] md:text-sm font-bold transition-all whitespace-nowrap ${role === 'OWNER' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <User size={14} className="md:w-4 md:h-4" /> <span className="hidden xs:inline">Pet</span> Owner
            </button>
            <button 
              onClick={handleSwitchToVet}
              className={`flex items-center gap-1.5 px-3 md:px-5 py-1.5 md:py-2 rounded-xl text-[10px] md:text-sm font-bold transition-all whitespace-nowrap ${role === 'VET' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Stethoscope size={14} className="md:w-4 md:h-4" /> Vet<span className="hidden xs:inline">erinarian</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`p-2 md:p-2.5 rounded-xl transition-all relative ${isNotificationsOpen ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50'}`}
            >
              <Bell size={18} className="md:w-5 md:h-5" />
              {isUserLoggedIn && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-4 w-72 md:w-80 bg-white border border-slate-200 shadow-2xl rounded-3xl p-6 space-y-4 animate-in slide-in-from-top-2 duration-200 z-[310] overflow-hidden">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Clinical Feed</h4>
                  <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">3 New</span>
                </div>
                {isUserLoggedIn ? (
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
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4 italic">Sign in to view your activity feed</p>
                )}
                <button 
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    setIsActivityModalOpen(true);
                  }}
                  className="w-full py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors border-t border-slate-50 mt-2"
                >
                  View All Activity
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`flex items-center gap-2 w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br ${isUserLoggedIn ? 'from-emerald-100 to-emerald-200 border-emerald-300 text-emerald-800 shadow-emerald-200' : 'from-slate-100 to-slate-200 border-slate-300 text-slate-400'} border items-center justify-center font-bold shadow-sm transition-all hover:scale-105 active:scale-95 ${isProfileOpen ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}`}
            >
              {getInitials()}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-4 w-60 md:w-64 bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden animate-in slide-in-from-top-2 duration-200 z-[310]">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Signed in as</p>
                  <p className="text-sm font-black text-slate-900">{getCurrentName()}</p>
                </div>
                <div className="p-2">
                  <button 
                    onClick={() => { setIsProfileModalOpen(true); setIsProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-slate-700 hover:bg-slate-50 transition-colors text-left"
                  >
                    <UserCircle size={16} className="text-slate-400" /> My Profile
                  </button>
                  <button 
                    onClick={() => { role === 'VET' ? handleSwitchToOwner() : handleSwitchToVet(); setIsProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 transition-colors text-left"
                  >
                    <ArrowRight size={16} /> Switch to {role === 'VET' ? 'Owner' : 'Vet'}
                  </button>
                  {isUserLoggedIn && (
                    <button 
                      onClick={role === 'VET' ? handleLogoutVet : handleLogoutOwner}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut size={16} /> {role === 'VET' ? 'Lock Portal' : 'Sign Out'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-[10]">
        <HeroBanner role={role} />

        {role === 'VET' ? (
          isVetAuthenticated ? (
            <AdminDashboard 
              records={fullRecords} 
              onAddRecord={handleAddOrUpdateRecord}
              onDeleteRecord={handleDeleteRecord}
              onLogout={handleLogoutVet}
              onUpdateKey={(msg) => showToast(msg, 'success')}
              onSwitchRole={handleSwitchToOwner}
            />
          ) : (
            <VetLogin onAuthenticate={() => setIsVetAuthenticated(true)} onBack={handleSwitchToOwner} />
          )
        ) : (
          <OwnerPortal 
            owners={owners}
            pets={pets}
            visits={visits}
            onAddOwnerRecord={handleAddOrUpdateRecord}
            onAddPet={handleAddPet}
            onUpdatePet={handleUpdatePet}
            onAddOwner={handleAddOwner}
            activeOwner={activeOwner}
            setActiveOwner={setActiveOwner}
            selectedPet={selectedPet}
            setSelectedPet={setSelectedPet}
          />
        )}
      </main>

      {isProfileModalOpen && (
        <ProfileModal 
          isOpen={isProfileModalOpen} 
          onClose={() => setIsProfileModalOpen(false)} 
          role={role} 
          owner={activeOwner}
          pets={pets}
          isVetAuthenticated={isVetAuthenticated}
        />
      )}

      {isActivityModalOpen && (
        <ActivityModal 
          isOpen={isActivityModalOpen} 
          onClose={() => setIsActivityModalOpen(false)} 
          isUserLoggedIn={isUserLoggedIn}
        />
      )}

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
        <div className="flex gap-6">
          <a href="mailto:doctorpurrfect@gmail.com" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors">doctorpurrfect@gmail.com</a>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default App;
