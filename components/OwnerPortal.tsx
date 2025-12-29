
import React, { useState, useMemo, useEffect } from 'react';
import { Heart, Calendar, FileText, ChevronRight, ZoomIn, Utensils, Droplet, Activity, UserRound, Thermometer, AlertCircle, CalendarClock, Phone, Scale, Dog, PawPrint, ClipboardList, ChevronDown, ChevronUp, Info, ArrowRight, Hash, ShieldCheck, Sparkles, Globe, Fingerprint, Stethoscope } from 'lucide-react';
import { Owner, Pet, Visit } from '../types';
import ImageLightbox from './ImageLightbox';

interface Props {
  owners: Owner[];
  pets: Pet[];
  visits: Visit[];
  onUploadPhoto: (message: string) => void;
}

const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};

const formatAge = (age: string) => {
  if (!age) return 'N/A';
  if (/^\d+$/.test(age.trim())) {
    return `${age} Years`;
  }
  return age;
};

const CompactVisitCard: React.FC<{ visit: Visit; pet: Pet; onEnlarge: (url: string) => void }> = ({ visit, pet, onEnlarge }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Header Bar - High Density */}
      <div className="px-4 py-3 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-emerald-600 font-black text-sm tracking-tight flex items-center gap-1.5">
            <Calendar size={14} strokeWidth={3} />
            {formatDisplayDate(visit.date)}
          </div>
          <span className="hidden xs:inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[8px] font-black uppercase tracking-tighter">
            REF #{visit.id.slice(-4).toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
            <UserRound size={12} className="text-emerald-500" />
            {visit.doctor_name.split(' ').pop()}
          </div>
        </div>
      </div>

      {/* Vitals Bar - Ultra Compact Single Row */}
      <div className="px-4 py-2 border-b border-slate-50 flex items-center justify-around bg-white">
        <div className="flex items-center gap-1.5">
          <Thermometer size={14} className="text-rose-500" />
          <span className="text-xs font-black text-slate-800">{visit.temperature}°</span>
        </div>
        <div className="w-px h-3 bg-slate-100" />
        <div className="flex items-center gap-1.5">
          <Activity size={14} className="text-blue-500" />
          <span className="text-xs font-black text-slate-800">{visit.heart_rate}</span>
        </div>
        <div className="w-px h-3 bg-slate-100" />
        <div className="flex items-center gap-1.5">
          <Scale size={14} className="text-emerald-500" />
          <span className="text-xs font-black text-slate-800">{visit.weight}kg</span>
        </div>
      </div>

      {/* Primary Clinical Findings */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <h6 className="text-[9px] font-black uppercase text-rose-600 flex items-center gap-1 tracking-widest">
            <AlertCircle size={12} /> Symptoms
          </h6>
          <p className="text-xs font-medium text-slate-600 line-clamp-2 leading-tight">
            {visit.symptoms || 'None reported.'}
          </p>
        </div>
        <div className="space-y-1">
          <h6 className="text-[9px] font-black uppercase text-blue-600 flex items-center gap-1 tracking-widest">
            <ClipboardList size={12} /> Diagnosis
          </h6>
          <p className="text-xs font-black text-slate-900 line-clamp-2 leading-tight">
            {visit.diagnosis}
          </p>
        </div>
      </div>

      {/* Prescription Badge - Smaller & Integrated */}
      <div className="px-4 pb-3">
        <div className="bg-slate-900 p-3 rounded-xl flex items-start gap-3 relative overflow-hidden">
          <FileText size={16} className="text-emerald-400 shrink-0 mt-0.5" />
          <div className="relative z-10">
             <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest block mb-0.5">Prescription</span>
             <p className="text-xs font-bold text-white leading-tight italic">"{visit.prescription}"</p>
          </div>
          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-500/10 rounded-full blur-xl" />
        </div>
      </div>

      {/* Expandable Section Toggle */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-2 bg-slate-50/50 hover:bg-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors border-t border-slate-100"
      >
        {isExpanded ? (
          <>Less Details <ChevronUp size={12} /></>
        ) : (
          <>More Details & Lifestyle <ChevronDown size={12} /></>
        )}
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="p-4 bg-slate-50/30 space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-1">
            <h6 className="text-[9px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1.5">
              <Info size={12} /> Full Vet Advice
            </h6>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              {visit.recommendations}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <h6 className="text-[9px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1">
                <Utensils size={12} className="text-emerald-600" /> Lifestyle
              </h6>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[7px] block">Breakfast</span>
                  <span className="font-black text-slate-700">{visit.diet_breakfast || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[7px] block">Lunch</span>
                  <span className="font-black text-slate-700">{visit.diet_lunch || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[7px] block">Dinner</span>
                  <span className="font-black text-slate-700">{visit.diet_dinner || '—'}</span>
                </div>
                <div>
                  <span className="text-blue-400 font-bold uppercase text-[7px] block">Water</span>
                  <span className="font-black text-slate-700">{visit.diet_water || 'Normal'}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h6 className="text-[9px] font-black uppercase text-slate-900 tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1">
                <Activity size={12} className="text-amber-600" /> Elimination
              </h6>
              <div className="grid grid-cols-1 gap-2 text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                    <Activity size={10} />
                  </div>
                  <span className="font-black text-slate-700">Stool: {visit.stool_color}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Droplet size={10} />
                  </div>
                  <span className="font-black text-slate-700">Urine: {visit.urine_color}</span>
                </div>
              </div>
            </div>
          </div>

          {visit.image_url && (
            <div className="relative group rounded-xl overflow-hidden shadow-sm border border-white cursor-zoom-in h-32" onClick={() => onEnlarge(visit.image_url!)}>
              <img src={visit.image_url} alt="Visit Photo" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn size={20} className="text-white drop-shadow" />
              </div>
            </div>
          )}

          {visit.follow_up_date && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/50 flex items-center gap-3">
              <CalendarClock size={16} className="text-amber-600 shrink-0" />
              <div className="leading-tight">
                <p className="text-[8px] font-black text-amber-700 uppercase tracking-widest">Follow-up Appointment</p>
                <p className="text-xs font-black text-blue-900">{formatDisplayDate(visit.follow_up_date)}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OwnerPortal: React.FC<Props> = ({ owners, pets, visits, onUploadPhoto }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [petSearchId, setPetSearchId] = useState('');
  const [petSearchName, setPetSearchName] = useState('');
  const [activeOwner, setActiveOwner] = useState<Owner | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isSinglePetView, setIsSinglePetView] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) setShowScrollHint(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePhoneSearch = () => {
    const normalizedInput = phoneNumber.replace(/\D/g, '');
    if (!normalizedInput) { alert("Please enter a valid phone number."); return; }
    const foundOwner = owners.find(o => o.phone_number.replace(/\D/g, '') === normalizedInput);
    if (foundOwner) {
      setActiveOwner(foundOwner);
      setIsSinglePetView(false);
      const ownerPets = pets.filter(p => p.owner_id === foundOwner.id);
      if (ownerPets.length > 0) {
        setSelectedPet(ownerPets[0]);
        if (visits.filter(v => v.pet_id === ownerPets[0].id).length > 1) setShowScrollHint(true);
      }
    } else {
      alert(`No owner found with number "${phoneNumber}".`);
    }
  };

  const handlePetIdSearch = () => {
    const cleanId = petSearchId.replace('#', '').trim();
    const cleanName = petSearchName.trim().toLowerCase();
    if (!cleanId || !cleanName) { alert("Please enter Patient ID and Name."); return; }
    const foundPet = pets.find(p => p.display_id === cleanId && p.pet_name.toLowerCase() === cleanName);
    if (foundPet) {
      const owner = owners.find(o => o.id === foundPet.owner_id);
      if (owner) {
        setActiveOwner(owner);
        setSelectedPet(foundPet);
        setIsSinglePetView(true);
        if (visits.filter(v => v.pet_id === foundPet.id).length > 1) setShowScrollHint(true);
      }
    } else {
      alert("Verification failed. Data does not match.");
    }
  };

  const myPets = useMemo(() => {
    if (!activeOwner) return [];
    const all = pets.filter(p => p.owner_id === activeOwner.id);
    return isSinglePetView && selectedPet ? all.filter(p => p.id === selectedPet.id) : all;
  }, [activeOwner, pets, isSinglePetView, selectedPet]);

  const petVisits = useMemo(() => {
    if (!selectedPet) return [];
    return visits.filter(v => v.pet_id === selectedPet.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [selectedPet, visits]);

  if (!activeOwner) {
    return (
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden rounded-[3rem]">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 -z-20 bg-[#f8fafc]">
          <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
            <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-emerald-100 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Trail of Clinical Icons */}
        <div className="absolute inset-0 -z-10 opacity-[0.05] pointer-events-none">
          <Stethoscope size={48} className="absolute top-[10%] left-[5%] rotate-[-15deg]" />
          <Sparkles size={32} className="absolute top-[18%] left-[15%] rotate-[10deg]" />
          <Stethoscope size={48} className="absolute top-[25%] left-[25%] rotate-[-5deg]" />
          <Sparkles size={32} className="absolute top-[35%] left-[32%] rotate-[20deg]" />
          <Stethoscope size={48} className="absolute top-[48%] left-[45%] rotate-[-12deg]" />
          <Sparkles size={32} className="absolute bottom-[20%] right-[10%] rotate-[25deg]" />
          <Stethoscope size={48} className="absolute bottom-[10%] right-[20%] rotate-[-10deg]" />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 relative z-10">
          <div className="inline-flex p-5 bg-white text-emerald-600 rounded-3xl mb-8 shadow-xl shadow-emerald-500/5 ring-1 ring-emerald-50">
            <Stethoscope size={40} className="text-emerald-600 animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
            Retrieve <span className="text-emerald-600 relative">
              Clinical Records
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-100 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="currentColor" strokeWidth="8" fill="transparent" />
              </svg>
            </span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-xl mx-auto font-medium">
            Your pet's health journey, tracked with clinical precision. Log in to access past visits and prescriptions.
          </p>
        </div>

        {/* Symmetry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative max-w-5xl w-full items-stretch z-10">
          {/* Card 1: Phone Access */}
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-slate-200/50 shadow-2xl relative overflow-hidden flex flex-col h-full group hover:shadow-emerald-900/10 transition-all duration-500 hover:-translate-y-1">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700" />
             <div className="relative">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-200">
                        <Phone size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">Phone Access</h3>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1">Household View</p>
                    </div>
                </div>
                <div className="space-y-6 mb-12">
                   <div className="relative">
                      <input 
                        type="tel" 
                        placeholder="555-0101" 
                        className="w-full text-xl font-bold p-6 bg-slate-50 border-2 border-slate-50 rounded-[1.5rem] focus:border-emerald-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-inner" 
                        value={phoneNumber} 
                        onChange={e => setPhoneNumber(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handlePhoneSearch()} 
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                        <Globe size={24} />
                      </div>
                   </div>
                   <div className="px-3 flex items-start gap-2">
                     <ShieldCheck size={14} className="text-emerald-500 mt-0.5" />
                     <p className="text-xs text-slate-400 font-bold leading-relaxed">Login using the verified household phone number provided during your clinic registration.</p>
                   </div>
                </div>
             </div>
             <div className="mt-auto pt-4">
                <button 
                    onClick={handlePhoneSearch} 
                    className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-emerald-600 transition-all shadow-xl hover:shadow-emerald-500/20 active:scale-[0.98]"
                >
                    Access History <ArrowRight size={20} />
                </button>
             </div>
          </div>

          {/* Card 2: Patient ID Access */}
          <div className="bg-white/80 backdrop-blur-md p-10 rounded-[3rem] border border-slate-200/50 shadow-2xl relative overflow-hidden flex flex-col h-full group hover:shadow-indigo-900/10 transition-all duration-500 hover:-translate-y-1">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-700" />
             <div className="relative">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200">
                        <Hash size={28} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-slate-900">Patient ID</h3>
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1">Direct Verification</p>
                    </div>
                </div>
                <div className="space-y-4 mb-10">
                   <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Patient ID (e.g. 1001)" 
                        className="w-full text-lg font-bold p-5 bg-slate-50 border-2 border-slate-50 rounded-[1.25rem] focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-inner" 
                        value={petSearchId} 
                        onChange={e => setPetSearchId(e.target.value)} 
                      />
                   </div>
                   <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Pet Legal Name" 
                        className="w-full text-lg font-bold p-5 bg-slate-50 border-2 border-slate-50 rounded-[1.25rem] focus:border-indigo-500 focus:bg-white outline-none transition-all placeholder:text-slate-300 shadow-inner" 
                        value={petSearchName} 
                        onChange={e => setPetSearchName(e.target.value)} 
                        onKeyDown={e => e.key === 'Enter' && handlePetIdSearch()} 
                      />
                   </div>
                </div>
             </div>
             <div className="mt-auto pt-4">
                <button 
                    onClick={handlePetIdSearch} 
                    className="w-full bg-indigo-600 text-white py-6 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-[0.98]"
                >
                    Verify & Track <Fingerprint size={20} />
                </button>
             </div>
          </div>
        </div>

        {/* Bottom Decorative Element: Owner walking pet silhouette (Stylized line art) */}
        <div className="mt-20 opacity-20 hidden md:block select-none grayscale brightness-50">
           <div className="flex items-end gap-12">
             <Dog size={64} strokeWidth={1} />
             <div className="w-16 h-0.5 bg-slate-300 rounded-full mb-2" />
             <UserRound size={80} strokeWidth={1} />
             <div className="w-24 h-0.5 bg-slate-300 rounded-full mb-2" />
             <Activity size={48} strokeWidth={1} className="mb-2" />
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-700 relative pb-24">
      <ImageLightbox imageUrl={enlargedImage} onClose={() => setEnlargedImage(null)} />

      {/* Ultra Compact Welcome Header */}
      <div className="flex items-center justify-between bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg">
        <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
             <UserRound size={16} />
           </div>
           <div>
             <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Guardian</h2>
             <p className="text-xs font-black leading-none">{activeOwner.name.split(' ')[0]}</p>
           </div>
        </div>
        <button onClick={() => { setActiveOwner(null); setSelectedPet(null); setIsSinglePetView(false); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[8px] font-black uppercase tracking-widest rounded-lg border border-white/10">
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">My Household</h3>
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0 scrollbar-hide">
            {myPets.map(pet => (
              <button 
                key={pet.id} 
                onClick={() => setSelectedPet(pet)} 
                className={`flex-shrink-0 lg:flex-shrink p-3 rounded-xl border-2 text-left transition-all active:scale-95 ${selectedPet?.id === pet.id ? 'bg-white border-emerald-500 shadow-sm min-w-[120px]' : 'bg-white border-slate-100 min-w-[110px]'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${selectedPet?.id === pet.id ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    {pet.pet_name[0]}
                  </div>
                  <h4 className="text-[11px] font-black text-slate-900 truncate leading-none">{pet.pet_name}</h4>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          {!selectedPet ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-300 flex flex-col items-center justify-center">
              <Dog size={24} className="mb-2 opacity-10" />
              <p className="text-[10px] font-black uppercase tracking-widest">Select Patient</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Patient Quick Info Bar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center gap-x-6 gap-y-3">
                 <div className="flex items-center gap-2.5">
                   <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-emerald-100">
                     {selectedPet.pet_name[0]}
                   </div>
                   <div>
                     <h3 className="text-sm font-black text-slate-900 leading-none">{selectedPet.pet_name}</h3>
                     <p className="text-[9px] font-black text-slate-400 uppercase mt-1 tracking-tighter">Patient ID: {selectedPet.display_id}</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-5 ml-auto sm:ml-0">
                   <div className="flex flex-col">
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Breed</span>
                      <span className="text-[11px] font-black text-blue-900">{selectedPet.breed}</span>
                   </div>
                   <div className="w-px h-5 bg-slate-100" />
                   <div className="flex flex-col">
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Gender</span>
                      <span className="text-[11px] font-black text-blue-900">{selectedPet.gender}</span>
                   </div>
                   <div className="w-px h-5 bg-slate-100" />
                   <div className="flex flex-col">
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Age</span>
                      <span className="text-[11px] font-black text-blue-900">{formatAge(selectedPet.age)}</span>
                   </div>
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical History</h3>
                  <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{petVisits.length} Records found</span>
                </div>
                
                <div className="space-y-4">
                  {petVisits.map((visit) => (
                    <CompactVisitCard 
                      key={visit.id} 
                      visit={visit} 
                      pet={selectedPet} 
                      /* Fixed: Pass setEnlargedImage setter function to satisfy (url: string) => void type */
                      onEnlarge={setEnlargedImage} 
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showScrollHint && petVisits.length > 1 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce z-40 pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-white/10">
            <ChevronDown size={14} strokeWidth={3} />
            <span className="text-[8px] font-black uppercase tracking-widest whitespace-nowrap">Swipe for History</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerPortal;
