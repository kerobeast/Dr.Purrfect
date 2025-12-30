
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Heart, Calendar, FileText, ChevronRight, ZoomIn, Utensils, Droplet, Activity, UserRound, Thermometer, AlertCircle, CalendarClock, Phone, Scale, Dog, PawPrint, ClipboardList, ChevronDown, ChevronUp, Info, ArrowRight, Hash, ShieldCheck, Sparkles, Globe, Fingerprint, Stethoscope, Plus, X, Upload, CheckCircle2, ReceiptText, Cat, Bird, Rabbit, Image as ImageIcon, Camera, UserPlus, Sparkle, Edit3, Shield, Mail, Copy, Check } from 'lucide-react';
import { Owner, Pet, Visit, PetType, Gender } from '../types';
import ImageLightbox from './ImageLightbox';

interface Props {
  owners: Owner[];
  pets: Pet[];
  visits: Visit[];
  onAddOwnerRecord: (record: Visit) => void;
  onAddPet: (pet: Pet) => void;
  onUpdatePet: (pet: Pet) => void;
  onAddOwner: (owner: Owner) => void;
  activeOwner: Owner | null;
  setActiveOwner: (owner: Owner | null) => void;
  selectedPet: Pet | null;
  setSelectedPet: (pet: Pet | null) => void;
}

const formatDisplayDate = (dateString: string) => {
  if (!dateString) return 'Pending Profile';
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
    <div className={`bg-white rounded-2xl shadow-md border overflow-hidden group hover:shadow-lg transition-all duration-300 ${visit.is_external ? 'border-indigo-100 shadow-indigo-900/5' : 'border-slate-100'}`}>
      <div className={`px-4 py-3 flex items-center justify-between ${visit.is_external ? 'bg-indigo-50/50' : 'bg-slate-50/50'}`}>
        <div className="flex items-center gap-3">
          <div className={`${visit.is_external ? 'text-indigo-600' : 'text-emerald-600'} font-black text-sm tracking-tight flex items-center gap-1.5`}>
            <Calendar size={14} strokeWidth={3} />
            {formatDisplayDate(visit.date)}
          </div>
          {visit.is_external ? (
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-full text-[8px] font-black uppercase tracking-widest border border-indigo-200">
              Personal Vault
            </span>
          ) : (
            <span className="hidden xs:inline-block px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded text-[8px] font-black uppercase tracking-tighter">
              REF #{visit.id.slice(-4).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200">
            {visit.is_external ? <Globe size={12} className="text-indigo-500" /> : <UserRound size={12} className="text-emerald-500" />}
            {visit.doctor_name}
          </div>
        </div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <h6 className={`text-[9px] font-black uppercase flex items-center gap-1 tracking-widest ${visit.is_external ? 'text-indigo-500' : 'text-rose-600'}`}>
            <AlertCircle size={12} /> {visit.is_external ? 'Visit Summary' : 'Symptoms'}
          </h6>
          <p className="text-xs font-medium text-slate-600 line-clamp-2 leading-tight">
            {visit.symptoms || (visit.is_external ? 'Details for personal log...' : 'None reported.')}
          </p>
        </div>
        <div className="space-y-1">
          <h6 className={`text-[9px] font-black uppercase flex items-center gap-1 tracking-widest ${visit.is_external ? 'text-blue-500' : 'text-blue-600'}`}>
            <ClipboardList size={12} /> {visit.is_external ? 'Logged Items' : 'Diagnosis'}
          </h6>
          <p className="text-xs font-black text-slate-900 line-clamp-2 leading-tight">
            {visit.diagnosis}
          </p>
        </div>
      </div>
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full py-2 bg-slate-50/50 hover:bg-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-colors border-t border-slate-100">
        {isExpanded ? <>Less Details <ChevronUp size={12} /></> : <>More Details & Media <ChevronDown size={12} /></>}
      </button>
      {isExpanded && (
        <div className="p-4 bg-slate-50/30 space-y-4 animate-in slide-in-from-top-2 duration-300">
           {visit.prescription && (
            <div className="p-3 bg-slate-900 rounded-xl">
               <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest mb-1 block">Prescription Notes</span>
               <p className="text-xs text-white font-bold italic leading-relaxed">"{visit.prescription}"</p>
            </div>
           )}
          {visit.image_urls && visit.image_urls.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {visit.image_urls.map((url, idx) => (
                <div key={idx} className="relative group rounded-xl overflow-hidden shadow-sm border border-white cursor-zoom-in h-32" onClick={() => onEnlarge(url)}>
                  <img src={url} alt={`Visit Photo ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn size={20} className="text-white drop-shadow" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const OwnerPortal: React.FC<Props> = ({ owners, pets, visits, onAddOwnerRecord, onAddPet, onUpdatePet, onAddOwner, activeOwner, setActiveOwner, selectedPet, setSelectedPet }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [petSearchId, setPetSearchId] = useState('');
  const [petSearchName, setPetSearchName] = useState('');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [canScrollRightDetails, setCanScrollRightDetails] = useState(false);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const [searchError, setSearchError] = useState(false);
  
  const detailsScrollRef = useRef<HTMLDivElement>(null);
  const editPortraitInputRef = useRef<HTMLInputElement>(null);
  const regPortraitInputRef = useRef<HTMLInputElement>(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isEditPetModalOpen, setIsEditPetModalOpen] = useState(false);
  
  // Registration Flow State
  const [regStep, setRegStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [lastRegisteredPet, setLastRegisteredPet] = useState<Pet | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  const [regFormData, setRegFormData] = useState({
    ownerName: '',
    petName: '',
    petType: PetType.DOG,
    petAge: '',
    petBreed: '',
    petGender: Gender.FEMALE
  });

  const [newPetData, setNewPetData] = useState<Partial<Pet>>({
    pet_name: '', pet_type: PetType.DOG, gender: Gender.FEMALE, breed: '', age: '', color: '', birth_date: new Date().toISOString().split('T')[0], profile_photo_url: ''
  });

  const [newRecord, setNewRecord] = useState<Partial<Visit>>({
    date: new Date().toISOString().split('T')[0], doctor_name: '', diagnosis: '', prescription: '', recommendations: '', weight: 0, temperature: 0, heart_rate: 0, is_external: true, image_urls: []
  });

  useEffect(() => {
    const checkScroll = () => {
      if (detailsScrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = detailsScrollRef.current;
        setCanScrollRightDetails(scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 10);
      }
    };
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [selectedPet]);

  const handlePhoneSearch = () => {
    const normalizedInput = phoneNumber.replace(/\D/g, '');
    if (!normalizedInput) return;
    const foundOwner = owners.find(o => o.phone_number.replace(/\D/g, '') === normalizedInput);
    if (foundOwner) {
      setActiveOwner(foundOwner);
      const ownerPets = pets.filter(p => p.owner_id === foundOwner.id);
      if (ownerPets.length > 0) setSelectedPet(ownerPets[0]);
    } else {
      setShowRegisterPrompt(true);
    }
  };

  const handlePetIdSearch = () => {
    setSearchError(false);
    const cleanId = petSearchId.trim();
    const cleanName = petSearchName.trim().toLowerCase();
    
    if (!cleanId || !cleanName) return;

    const foundPet = pets.find(p => 
      p.display_id === cleanId && 
      p.pet_name.toLowerCase() === cleanName
    );

    if (foundPet) {
      const owner = owners.find(o => o.id === foundPet.owner_id);
      if (owner) {
        setActiveOwner(owner);
        setSelectedPet(foundPet);
      }
    } else {
      setSearchError(true);
      setTimeout(() => setSearchError(false), 3000);
    }
  };

  const handleFinalRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Create Owner
    const ownerId = `o${Date.now()}`;
    const owner: Owner = { 
      id: ownerId, 
      name: regFormData.ownerName, 
      email: '', 
      phone_number: '' 
    };
    onAddOwner(owner);

    // 2. Create Pet
    const petId = `p${Date.now()}`;
    const displayId = (pets.length + 1001).toString();
    const pet: Pet = {
      id: petId,
      display_id: displayId,
      owner_id: ownerId,
      pet_name: regFormData.petName,
      pet_type: regFormData.petType,
      age: regFormData.petAge,
      breed: regFormData.petBreed || 'Mixed',
      gender: regFormData.petGender,
      color: 'Standard',
      birth_date: new Date().toISOString().split('T')[0]
    };
    onAddPet(pet);
    setLastRegisteredPet(pet);
    
    // 3. Move to Success Screen
    setRegStep('SUCCESS');
  };

  const handleSaveAnotherPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOwner) return;
    const petId = `p${Date.now()}`;
    const displayId = (pets.length + 1001).toString();
    const pet: Pet = { ...newPetData, id: petId, display_id: displayId, owner_id: activeOwner.id } as Pet;
    onAddPet(pet);
    setIsAddPetModalOpen(false);
    setNewPetData({ pet_name: '', pet_type: PetType.DOG, gender: Gender.FEMALE, breed: '', age: '', color: '', birth_date: new Date().toISOString().split('T')[0], profile_photo_url: '' });
  };

  const handleCopyId = () => {
    if (!lastRegisteredPet) return;
    navigator.clipboard.writeText(lastRegisteredPet.display_id);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  const handleUpdatePetDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPet) {
      onUpdatePet(selectedPet);
      setIsEditPetModalOpen(false);
    }
  };

  const handleSaveOwnerRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPet) return;
    onAddOwnerRecord({
      ...newRecord,
      id: `ext-${Date.now()}`,
      pet_id: selectedPet.id,
      is_external: true
    } as Visit);
    setIsUploadModalOpen(false);
    setNewRecord({ date: new Date().toISOString().split('T')[0], doctor_name: '', diagnosis: '', prescription: '', recommendations: '', weight: 0, temperature: 0, heart_rate: 0, is_external: true, image_urls: [] });
  };

  const onPortraitFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'EDIT' | 'REG') => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        if (type === 'EDIT' && selectedPet) {
          const updated = { ...selectedPet, profile_photo_url: url };
          setSelectedPet(updated);
          onUpdatePet(updated);
        } else {
          setNewPetData({ ...newPetData, profile_photo_url: url });
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleAddPhotoToRecord = () => {
    const randomImg = `https://picsum.photos/seed/${Math.random()}/800/600`;
    const current = newRecord.image_urls || [];
    if (current.length < 5) {
      setNewRecord({...newRecord, image_urls: [...current, randomImg]});
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-700 relative pb-24">
      <ImageLightbox imageUrl={enlargedImage} onClose={() => setEnlargedImage(null)} />

      {/* Landing View */}
      {!activeOwner ? (
        <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden rounded-[3rem]">
          <div className="absolute inset-0 -z-20 bg-[#f8fafc]">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
              <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-emerald-100 rounded-full blur-[120px]" />
              <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-100 rounded-full blur-[120px]" />
            </div>
          </div>
          
          <div className="text-center mb-12 relative z-10">
            <div className="inline-flex p-5 bg-white text-emerald-600 rounded-3xl mb-8 shadow-xl border border-emerald-50">
              <Stethoscope size={40} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Retrieve <span className="text-emerald-600">Clinical Records</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl w-full z-10">
            <div className="bg-[#56A483] p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500 flex flex-col h-full text-white">
              <div className="absolute top-4 right-4 opacity-10 pointer-events-none group-hover:scale-110 transition-transform"><Sparkle size={140} /></div>
              <div className="flex-1">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center"><UserPlus size={32} /></div>
                  <div>
                    <h3 className="text-3xl font-black leading-none">New Patient</h3>
                    <p className="text-[11px] font-black uppercase tracking-widest mt-2 opacity-80">Join the Practice</p>
                  </div>
                </div>
                <p className="text-lg font-medium leading-relaxed opacity-95 mb-10">First time visiting? Create your digital household vault and register your pet's medical profile instantly.</p>
              </div>
              <button onClick={() => { setRegStep('FORM'); setIsRegisterModalOpen(true); }} className="w-full bg-white text-[#56A483] py-6 rounded-3xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-xl shadow-black/10">Register Today <ArrowRight size={22} /></button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-2xl flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-emerald-500 text-white rounded-2xl shadow-xl shadow-emerald-200"><Phone size={28} /></div>
                  <div><h3 className="text-2xl font-black text-slate-900">Phone Access</h3><p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Returning Clients</p></div>
                </div>
                <input type="tel" placeholder="555-0101" className="w-full text-xl font-bold p-5 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:border-emerald-500 outline-none mb-4" value={phoneNumber} onChange={e => { setPhoneNumber(e.target.value); setShowRegisterPrompt(false); }} />
                {showRegisterPrompt && <button onClick={() => { setRegStep('FORM'); setIsRegisterModalOpen(true); }} className="text-[10px] font-black text-emerald-600 uppercase hover:underline">Profile not found. Register now?</button>}
              </div>
              <button onClick={handlePhoneSearch} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest mt-4 hover:bg-slate-800 transition-colors">Access History</button>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200/50 shadow-2xl flex flex-col h-full">
              <div className="flex-1">
                <div className="flex items-center gap-5 mb-10">
                  <div className="w-16 h-16 bg-[#6366f1] text-white rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center"><Hash size={32} /></div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 leading-none">Patient ID</h3>
                    <p className="text-[11px] font-black text-[#6366f1] uppercase tracking-widest mt-2">Direct Verification</p>
                  </div>
                </div>
                <div className="space-y-4 mb-8">
                  <input type="text" placeholder="Patient ID (e.g. 1001)" className={`w-full text-xl font-bold p-5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${searchError ? 'border-rose-400' : 'border-slate-50 focus:border-[#6366f1]'}`} value={petSearchId} onChange={e => setPetSearchId(e.target.value)} />
                  <input type="text" placeholder="Pet Name" className={`w-full text-xl font-bold p-5 bg-slate-50 border-2 rounded-2xl outline-none transition-all ${searchError ? 'border-rose-400' : 'border-slate-50 focus:border-[#6366f1]'}`} value={petSearchName} onChange={e => setPetSearchName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handlePetIdSearch()} />
                  {searchError && <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest text-center">Patient Record Not Found</p>}
                </div>
              </div>
              <button onClick={handlePetIdSearch} className="w-full bg-[#6366f1] text-white py-6 rounded-3xl font-black text-sm uppercase tracking-widest mt-4 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100">Verify Patient</button>
            </div>
          </div>
        </div>
      ) : (
        /* Dashboard View */
        <div className="animate-in fade-in duration-500">
          <div className="flex items-center justify-between bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400"><UserRound size={16} /></div>
              <div><p className="text-xs font-black leading-none">{activeOwner.name}</p></div>
            </div>
            <button onClick={() => { setActiveOwner(null); setSelectedPet(null); }} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-[8px] font-black uppercase rounded-lg">Sign Out</button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-3">
              <button onClick={() => setIsAddPetModalOpen(true)} className="w-full p-3 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 flex items-center justify-center gap-2 hover:bg-slate-50"><Plus size={14} /> <span className="text-[11px] font-bold">New Pet</span></button>
              {pets.filter(p => p.owner_id === activeOwner.id).map(pet => (
                <button key={pet.id} onClick={() => setSelectedPet(pet)} className={`w-full p-3 rounded-xl border-2 text-left transition-all ${selectedPet?.id === pet.id ? 'bg-white border-emerald-500 shadow-sm' : 'bg-white border-slate-100'}`}>
                  <h4 className="text-[11px] font-black text-slate-900">{pet.pet_name}</h4>
                </button>
              ))}
            </div>
            <div className="lg:col-span-3">
              {selectedPet ? (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <input type="file" ref={editPortraitInputRef} className="hidden" accept="image/*" onChange={(e) => onPortraitFileSelect(e, 'EDIT')} />
                          <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white text-2xl font-black overflow-hidden border border-slate-100">
                            {selectedPet.profile_photo_url ? <img src={selectedPet.profile_photo_url} className="w-full h-full object-cover" /> : selectedPet.pet_name[0]}
                          </div>
                          <button onClick={() => editPortraitInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-emerald-600 transition-colors"><Camera size={12} /></button>
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900">{selectedPet.pet_name}</h3>
                          <div className="flex items-center gap-3 mt-1">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ID: {selectedPet.display_id}</p>
                             <div className="w-px h-2.5 bg-slate-200" />
                             <button onClick={() => setIsEditPetModalOpen(true)} className="flex items-center gap-1 text-[9px] font-black text-emerald-600 uppercase tracking-widest hover:underline"><Edit3 size={10} /> Edit Details</button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 w-full md:w-auto"
                      >
                        <Plus size={18} /> Add Medical Record
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-slate-50">
                       <div className="flex flex-col"><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Species</span><span className="text-sm font-black text-slate-900">{selectedPet.pet_type}</span></div>
                       <div className="flex flex-col"><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Breed</span><span className="text-sm font-black text-slate-900">{selectedPet.breed || 'N/A'}</span></div>
                       <div className="flex flex-col"><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Gender</span><span className="text-sm font-black text-slate-900">{selectedPet.gender}</span></div>
                       <div className="flex flex-col"><span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Age</span><span className="text-sm font-black text-emerald-600">{formatAge(selectedPet.age)}</span></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                       <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical History Vault</h3>
                    </div>
                    {visits.filter(v => v.pet_id === selectedPet.id).map(visit => (
                      <CompactVisitCard key={visit.id} visit={visit} pet={selectedPet} onEnlarge={setEnlargedImage} />
                    ))}
                    {visits.filter(v => v.pet_id === selectedPet.id).length === 0 && (
                      <div className="p-16 bg-white rounded-[2.5rem] border border-slate-100 text-center flex flex-col items-center">
                        <div className="p-6 bg-slate-50 rounded-full mb-6 text-slate-200"><ClipboardList size={40} /></div>
                        <p className="text-lg font-black text-slate-900">No medical history uploaded yet</p>
                        <p className="text-xs font-medium text-slate-400 max-w-xs mt-2 mb-8">Keep your pet's life journey in one place. Sync records from other vets or log home observations.</p>
                        <button onClick={() => setIsUploadModalOpen(true)} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all">Sync First Record</button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center p-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
                   <Dog size={48} className="mx-auto text-slate-200 mb-4" />
                   <p className="text-sm font-bold text-slate-400">Select a patient to view history</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REGISTRATION MODAL WITH STEPS */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsRegisterModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
            <div className="p-10">
              {regStep === 'FORM' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 tracking-tight">Register your Pet</h3>
                      <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mt-1">Start your pet's medical profile</p>
                    </div>
                    <button onClick={() => setIsRegisterModalOpen(false)} className="p-2 text-slate-400"><X size={28} /></button>
                  </div>
                  <form onSubmit={handleFinalRegistration} className="space-y-6">
                    <div className="space-y-4">
                      <div className="group">
                        <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Guardian Name</label>
                        <input type="text" required placeholder="Full name" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all" value={regFormData.ownerName} onChange={e => setRegFormData({...regFormData, ownerName: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Pet Name</label>
                          <input type="text" required placeholder="e.g. Luna" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all" value={regFormData.petName} onChange={e => setRegFormData({...regFormData, petName: e.target.value})} />
                        </div>
                        <div className="group">
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Pet Age</label>
                          <input type="text" required placeholder="e.g. 2 Years" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all" value={regFormData.petAge} onChange={e => setRegFormData({...regFormData, petAge: e.target.value})} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="group">
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Pet Type</label>
                          <select required className="w-full p-4 bg-slate-50 border rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all appearance-none" value={regFormData.petType} onChange={e => setRegFormData({...regFormData, petType: e.target.value as PetType})}>
                            {Object.values(PetType).map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="group">
                          <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 ml-1">Gender</label>
                          <select required className="w-full p-4 bg-slate-50 border rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all appearance-none" value={regFormData.petGender} onChange={e => setRegFormData({...regFormData, petGender: e.target.value as Gender})}>
                            {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-5 bg-[#56A483] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-[#4a8d70] transition-all">Complete Registration <ArrowRight size={20} /></button>
                  </form>
                </div>
              )}

              {regStep === 'SUCCESS' && lastRegisteredPet && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                      <CheckCircle2 size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900">Registration Complete</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2">Your household is now active at Dr. Purrfect.</p>
                  </div>

                  <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl mb-8">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><PawPrint size={100} /></div>
                     <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                           <div>
                              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Official Patient ID</p>
                              <h4 className="text-5xl font-black tracking-tighter">{lastRegisteredPet.display_id}</h4>
                           </div>
                           <button onClick={handleCopyId} className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10">
                              {isCopying ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} />}
                           </button>
                        </div>
                        <div className="space-y-4 pt-4 border-t border-white/10">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Companion</span>
                              <span className="text-lg font-black">{lastRegisteredPet.pet_name}</span>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Species</span>
                              <span className="text-sm font-bold text-emerald-400">{lastRegisteredPet.pet_type}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 mb-8">
                     <div className="flex gap-3">
                        <Info size={20} className="text-amber-600 shrink-0" />
                        <p className="text-xs font-bold text-amber-900 leading-relaxed">
                          Save this Patient ID. You can use it along with your pet's name to instantly access their medical records from any device.
                        </p>
                     </div>
                  </div>

                  <button 
                    onClick={() => { setIsRegisterModalOpen(false); setRegStep('FORM'); }}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-slate-800 transition-all"
                  >
                    Go to Patient Portal <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADD PET MODAL (For existing owners) */}
      {isAddPetModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsAddPetModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-10">
              <h3 className="text-3xl font-black text-slate-900 mb-6">Register Companion</h3>
              <form onSubmit={handleSaveAnotherPet} className="space-y-6">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <input type="file" ref={regPortraitInputRef} className="hidden" accept="image/*" onChange={(e) => onPortraitFileSelect(e, 'REG')} />
                    <button type="button" onClick={() => regPortraitInputRef.current?.click()} className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden hover:border-emerald-400 transition-all">
                      {newPetData.profile_photo_url ? <img src={newPetData.profile_photo_url} className="w-full h-full object-cover" /> : <Camera size={32} className="text-slate-300" />}
                    </button>
                  </div>
                </div>
                <input type="text" required placeholder="Pet Legal Name" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newPetData.pet_name} onChange={e => setNewPetData({...newPetData, pet_name: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                   <select required className="p-4 bg-slate-50 border rounded-2xl font-bold" value={newPetData.pet_type} onChange={e => setNewPetData({...newPetData, pet_type: e.target.value as PetType})}>
                     {Object.values(PetType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                   <select required className="p-4 bg-slate-50 border rounded-2xl font-bold" value={newPetData.gender} onChange={e => setNewPetData({...newPetData, gender: e.target.value as Gender})}>
                     {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <input type="text" placeholder="Breed" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newPetData.breed} onChange={e => setNewPetData({...newPetData, breed: e.target.value})} />
                   <input type="text" placeholder="Age" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newPetData.age} onChange={e => setNewPetData({...newPetData, age: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-5 bg-[#56A483] text-white rounded-2xl font-black uppercase shadow-xl flex items-center justify-center gap-2">Finalize Registration <ShieldCheck size={20} /></button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD RECORD MODAL */}
      {isUploadModalOpen && selectedPet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsUploadModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-10">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Sync Record</h3>
                  <p className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mt-1">Upload external clinical data</p>
                </div>
                <button onClick={() => setIsUploadModalOpen(false)} className="p-2 text-slate-400"><X size={28} /></button>
              </div>
              <form onSubmit={handleSaveOwnerRecord} className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Visit Date</label>
                      <input type="date" required className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newRecord.date} onChange={e => setNewRecord({...newRecord, date: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Clinic / Provider</label>
                      <input type="text" required placeholder="e.g. City Vet" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newRecord.doctor_name} onChange={e => setNewRecord({...newRecord, doctor_name: e.target.value})} />
                    </div>
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Summary Findings</label>
                    <input type="text" required placeholder="e.g. Annual Vaccination, X-ray Session" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={newRecord.diagnosis} onChange={e => setNewRecord({...newRecord, diagnosis: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Prescription / Notes</label>
                    <textarea rows={3} placeholder="Details about medicine or recovery steps..." className="w-full p-4 bg-slate-50 border rounded-2xl font-bold italic" value={newRecord.prescription} onChange={e => setNewRecord({...newRecord, prescription: e.target.value})} />
                 </div>
                 
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <label className="text-[10px] font-black text-slate-500 uppercase">Attach documentation</label>
                       {(newRecord.image_urls?.length || 0) < 5 && <button type="button" onClick={handleAddPhotoToRecord} className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl uppercase">Add Photo</button>}
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                       {newRecord.image_urls?.map((url, i) => (
                         <div key={i} className="aspect-square rounded-xl overflow-hidden border bg-slate-100 group relative">
                            <img src={url} className="w-full h-full object-cover" />
                            <button onClick={() => setNewRecord({...newRecord, image_urls: newRecord.image_urls?.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full"><X size={10} /></button>
                         </div>
                       ))}
                       {(newRecord.image_urls?.length || 0) < 5 && <button type="button" onClick={handleAddPhotoToRecord} className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 hover:border-indigo-300 hover:bg-indigo-50 transition-all"><Upload size={20} /></button>}
                    </div>
                 </div>

                 <button type="submit" className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Sync to Vault</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PET MODAL */}
      {isEditPetModalOpen && selectedPet && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsEditPetModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            <div className="p-10">
              <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">Update Details</h3>
              <form onSubmit={handleUpdatePetDetails} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Pet Legal Name</label>
                    <input type="text" required className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={selectedPet.pet_name} onChange={e => setSelectedPet({...selectedPet, pet_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Breed</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={selectedPet.breed} onChange={e => setSelectedPet({...selectedPet, breed: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Age</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={selectedPet.age} onChange={e => setSelectedPet({...selectedPet, age: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2">Color / Markings</label>
                    <input type="text" className="w-full p-4 bg-slate-50 border rounded-2xl font-bold" value={selectedPet.color} onChange={e => setSelectedPet({...selectedPet, color: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase shadow-xl hover:bg-emerald-700 transition-all">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerPortal;
