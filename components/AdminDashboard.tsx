
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, Minus, Filter, Edit2, Trash2, FileText, Calendar, Dog, Info, ChevronRight, Activity, Clock, Utensils, Droplet, ShieldCheck, Thermometer, FlaskConical, ZoomIn, UserRound, AlertCircle, PlusCircle, CalendarClock, LogOut, ShieldPlus, Check, KeyRound, X, ChevronDown, FilterX, Lock } from 'lucide-react';
import { FullVisitRecord, PetType, Gender } from '../types';
import RecordModal from './RecordModal';
import ImageLightbox from './ImageLightbox';

interface Props {
  records: FullVisitRecord[];
  onAddRecord: (record: FullVisitRecord) => void;
  onDeleteRecord: (id: string) => void;
  onLogout?: () => void;
  onUpdateKey?: (message: string) => void;
}

const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const day = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.getFullYear();
  return `${day}, ${month}, ${year}`;
};

const formatAge = (age: string) => {
  if (!age) return 'N/A';
  if (/^\d+$/.test(age.trim())) {
    return `${age} Years`;
  }
  return age;
};

const AdminDashboard: React.FC<Props> = ({ records, onAddRecord, onDeleteRecord, onLogout, onUpdateKey }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FullVisitRecord | null>(null);
  const [expandedPetId, setExpandedPetId] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  
  // Security management
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [newAccessCode, setNewAccessCode] = useState('');

  // Filtering management
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<PetType[]>([]);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [showRecentOnly, setShowRecentOnly] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedSpecies.length > 0) count++;
    if (selectedGender) count++;
    if (showRecentOnly) count++;
    return count;
  }, [selectedSpecies, selectedGender, showRecentOnly]);

  const groupedRecords = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));

    const filtered = records.filter(r => {
      // Search matching
      const matchesSearch = 
        r.owner_name.toLowerCase().includes(term) ||
        r.pet_name.toLowerCase().includes(term) ||
        r.diagnosis.toLowerCase().includes(term) ||
        r.breed.toLowerCase().includes(term) ||
        r.display_id.toLowerCase().includes(term);

      if (!matchesSearch) return false;

      // Species filtering
      if (selectedSpecies.length > 0 && !selectedSpecies.includes(r.pet_type)) return false;

      // Gender filtering
      if (selectedGender && r.gender !== selectedGender) return false;

      // Recent activity filtering (any record of the pet in the last 7 days)
      if (showRecentOnly) {
        const visitDate = new Date(r.date);
        if (visitDate < sevenDaysAgo) return false;
      }

      return true;
    });

    const groups: Record<string, FullVisitRecord[]> = {};
    filtered.forEach(r => {
      if (!groups[r.pet_id]) groups[r.pet_id] = [];
      groups[r.pet_id].push(r);
    });

    return Object.entries(groups).sort(([, a], [, b]) => {
      const latestA = new Date(a[0].date).getTime();
      const latestB = new Date(b[0].date).getTime();
      return latestB - latestA;
    });
  }, [records, searchTerm, selectedSpecies, selectedGender, showRecentOnly]);

  const handleEdit = (record: FullVisitRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const handleAddFollowUp = (baseRecord: FullVisitRecord) => {
    const followUpTemplate: FullVisitRecord = {
      ...baseRecord,
      id: '',
      date: new Date().toISOString().split('T')[0],
      weight: baseRecord.weight,
      temperature: 0,
      heart_rate: 0,
      symptoms: '',
      diagnosis: '',
      prescription: '',
      recommendations: '',
      vaccinations: '',
      image_url: undefined,
      follow_up_date: '',
      owner_phone_confirmation: baseRecord.owner_phone_confirmation,
      owner_phone_country_code: baseRecord.owner_phone_country_code,
      diet_breakfast: baseRecord.diet_breakfast,
      diet_lunch: baseRecord.diet_lunch,
      diet_dinner: baseRecord.diet_dinner,
      diet_water: baseRecord.diet_water,
    };
    setEditingRecord(followUpTemplate);
    setIsModalOpen(true);
  };

  const toggleExpand = (petId: string) => {
    setExpandedPetId(expandedPetId === petId ? null : petId);
  };

  const handleUpdateAccessCode = () => {
    if (newAccessCode.length < 4) {
      alert("Access code must be at least 4 characters long.");
      return;
    }
    localStorage.setItem('dr_purrfect_vet_key', newAccessCode);
    setIsSecurityOpen(false);
    setNewAccessCode('');
    if (onUpdateKey) onUpdateKey("Clinic access key updated successfully.");
  };

  const clearAllFilters = () => {
    setSelectedSpecies([]);
    setSelectedGender(null);
    setShowRecentOnly(false);
    setSearchTerm('');
  };

  const toggleSpecies = (species: PetType) => {
    setSelectedSpecies(prev => 
      prev.includes(species) 
        ? prev.filter(s => s !== species) 
        : [...prev, species]
    );
  };

  return (
    <div className="space-y-6">
      <ImageLightbox imageUrl={enlargedImage} onClose={() => setEnlargedImage(null)} />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 mb-1">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Vet's Dashboard</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsSecurityOpen(!isSecurityOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isSecurityOpen ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'}`}
              >
                <ShieldPlus size={14} /> Security
              </button>
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-slate-200"
                >
                  <LogOut size={14} /> Lock Dashboard
                </button>
              )}
            </div>
          </div>
          <p className="text-slate-500">Manage prescriptions and clinical patient history.</p>
        </div>
        <button 
          onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          <Plus size={20} />
          <span>New Medical Record</span>
        </button>
      </div>

      {/* Security Panel */}
      {isSecurityOpen && (
        <div className="bg-slate-900 text-white p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl text-emerald-400">
                <KeyRound size={28} />
              </div>
              <div>
                <h4 className="text-lg font-black tracking-tight leading-none">Access Key Security</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Update dashboard login credentials</p>
              </div>
            </div>
            
            <div className="flex flex-1 max-w-md w-full gap-3">
              <div className="relative flex-1">
                {/* Fixed: Lock icon is now correctly imported from lucide-react */}
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="password"
                  placeholder="New Access Key..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm font-black text-emerald-400 outline-none focus:border-emerald-500 focus:bg-white/10 transition-all"
                  value={newAccessCode}
                  onChange={(e) => setNewAccessCode(e.target.value)}
                />
              </div>
              <button 
                onClick={handleUpdateAccessCode}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-emerald-900/40"
              >
                <Check size={16} /> Update
              </button>
              <button 
                onClick={() => setIsSecurityOpen(false)}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-slate-400"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-visible">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-white rounded-t-[2.5rem] relative z-20">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by owner, pet, breed, or ID..." 
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`flex items-center gap-2 px-5 py-3 border rounded-2xl font-bold transition-all relative ${activeFilterCount > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              <Filter size={18} /> 
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-[10px] flex items-center justify-center animate-in zoom-in-50">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-200 shadow-2xl rounded-[2rem] p-6 space-y-6 animate-in slide-in-from-top-2 duration-200 z-50">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Dashboard Filters</h4>
                  <button onClick={clearAllFilters} className="text-[9px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded-lg">
                    <FilterX size={10} /> Reset
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Species</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(PetType).map(type => (
                      <button 
                        key={type}
                        onClick={() => toggleSpecies(type)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${selectedSpecies.includes(type) ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-emerald-200'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                  <div className="flex gap-2">
                    {Object.values(Gender).map(gender => (
                      <button 
                        key={gender}
                        onClick={() => setSelectedGender(selectedGender === gender ? null : gender)}
                        className={`flex-1 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${selectedGender === gender ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-blue-200'}`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                   <button 
                    onClick={() => setShowRecentOnly(!showRecentOnly)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${showRecentOnly ? 'bg-amber-50 text-amber-900' : 'bg-slate-50 text-slate-600'}`}
                   >
                     <div className="flex items-center gap-2">
                        <Clock size={14} className={showRecentOnly ? 'text-amber-600' : 'text-slate-400'} />
                        <span className="text-[10px] font-black uppercase tracking-tight">Recent Activity (7d)</span>
                     </div>
                     <div className={`w-8 h-4 rounded-full relative transition-colors ${showRecentOnly ? 'bg-amber-500' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-2 h-2 bg-white rounded-full transition-all ${showRecentOnly ? 'right-1' : 'left-1'}`} />
                     </div>
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {groupedRecords.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="bg-slate-50 p-6 rounded-full border border-slate-100 border-dashed">
                <Search size={40} className="opacity-20" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">No matching patient records</p>
                <p className="text-[10px] font-black uppercase tracking-widest mt-1">Try adjusting your filters or search term</p>
              </div>
              <button onClick={clearAllFilters} className="px-5 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-emerald-600 transition-all">
                Show All Patients
              </button>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="w-12 px-6 py-4"></th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">Owner</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">Pet ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap">Patient Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap text-center">Latest Visit</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-900 uppercase tracking-wider whitespace-nowrap text-right">Records</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {groupedRecords.map(([petId, petVisits]) => {
                  const latestVisit = petVisits[0];
                  const isExpanded = expandedPetId === petId;
                  
                  return (
                    <React.Fragment key={petId}>
                      <tr 
                        className={`hover:bg-slate-50/80 transition-all cursor-pointer group ${isExpanded ? 'bg-emerald-50/30' : ''}`}
                        onClick={() => toggleExpand(petId)}
                      >
                        <td className="px-6 py-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${isExpanded ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}`}>
                            {isExpanded ? <Minus size={16} /> : <Plus size={16} />}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-slate-900">{latestVisit.owner_name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-xl text-[10px] font-black border border-blue-100 shadow-sm">
                            {latestVisit.display_id}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shadow-sm bg-emerald-100 text-emerald-800">
                              {latestVisit.pet_name[0]}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-slate-900">{latestVisit.pet_name}</div>
                              <div className="text-[10px] font-black uppercase tracking-tight text-slate-400">
                                {latestVisit.breed} • {latestVisit.gender} • {formatAge(latestVisit.age)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-slate-600 font-medium">
                            {formatDisplayDate(latestVisit.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                            {petVisits.length} Entries
                          </span>
                        </td>
                      </tr>
                      
                      {isExpanded && (
                        <tr className="bg-white border-b-2 border-slate-100">
                          <td colSpan={6} className="px-2 py-4 md:px-6">
                            <div className="bg-slate-50 rounded-[2.5rem] border border-slate-200 p-4 md:p-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-inner">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                                <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                  <Clock size={14} className="text-emerald-600" /> Comprehensive Life Timeline • <span className="text-blue-800">Patient {latestVisit.display_id}</span>
                                </h5>
                                <button 
                                  onClick={() => handleAddFollowUp(latestVisit)}
                                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white border border-emerald-200 text-emerald-600 rounded-xl font-bold text-[9px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                >
                                  <PlusCircle size={14} /> Log New Visit
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                {petVisits.map((visit) => (
                                  <div key={visit.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow">
                                    {/* Header Strip */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-50">
                                      <div className="flex items-center gap-4">
                                        <span className="text-sm font-black text-slate-900">{formatDisplayDate(visit.date)}</span>
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-900 text-[9px] font-black uppercase rounded-lg">
                                          <UserRound size={12} className="text-emerald-500" /> <span className="text-blue-800">{visit.doctor_name}</span>
                                        </div>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-50 text-slate-900 text-[10px] font-black rounded-lg border border-rose-200/50 shadow-sm">
                                          <Thermometer size={12} className="text-rose-600" /> <span className="text-blue-800">{visit.temperature}°C</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-slate-900 text-[10px] font-black rounded-lg border border-blue-200/50 shadow-sm">
                                          <Activity size={12} className="text-blue-600" /> <span className="text-blue-800">{visit.heart_rate} BPM</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-900 text-[10px] font-black rounded-lg border border-slate-200 shadow-sm">
                                          <span className="text-blue-800">{visit.weight} KG</span>
                                        </span>
                                        {visit.follow_up_date && (
                                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 text-slate-900 text-[10px] font-black rounded-lg border border-amber-200/50 shadow-sm">
                                            <CalendarClock size={12} className="text-amber-600" /> Follow-up: <span className="text-blue-800">{formatDisplayDate(visit.follow_up_date)}</span>
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                                      <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
                                            <h6 className="text-[9px] font-black uppercase text-slate-900 mb-1 flex items-center gap-1 tracking-wide"><AlertCircle size={10} className="text-rose-600" /> Reported Symptoms</h6>
                                            <p className="text-[11px] font-bold text-blue-800 leading-snug">{visit.symptoms || 'None reported'}</p>
                                          </div>
                                          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
                                            <h6 className="text-[9px] font-black uppercase text-slate-900 mb-1 tracking-wide">Clinical Diagnosis</h6>
                                            <p className="text-[11px] font-bold text-blue-800 leading-snug">{visit.diagnosis}</p>
                                          </div>
                                        </div>

                                        <div className="space-y-3">
                                          <div className="p-3 bg-emerald-900 text-white rounded-xl shadow-lg border-l-4 border-emerald-400">
                                            <h6 className="text-[9px] font-black uppercase text-emerald-300 mb-1 flex items-center gap-1 tracking-wide"><FileText size={10} /> Prescription</h6>
                                            <p className="text-[11px] font-black italic leading-snug text-emerald-50">"{visit.prescription}"</p>
                                          </div>
                                          <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200">
                                            <h6 className="text-[9px] font-black uppercase text-slate-900 mb-1 tracking-wide">Recommendation</h6>
                                            <p className="text-[11px] font-bold text-blue-800 leading-snug">{visit.recommendations}</p>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="lg:col-span-3 flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 h-full pt-1">
                                        {visit.image_url ? (
                                          <div 
                                            className="relative group w-20 h-20 lg:w-full lg:h-24 rounded-xl overflow-hidden border-2 border-slate-100 cursor-zoom-in shadow-sm"
                                            onClick={() => setEnlargedImage(visit.image_url!)}
                                          >
                                            <img src={visit.image_url} alt="Clinical Attachment" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                              <ZoomIn className="text-white drop-shadow-md" size={16} />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="hidden lg:flex w-full h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex-col items-center justify-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                            No Media
                                          </div>
                                        )}
                                        <div className="flex gap-2">
                                          <button 
                                            onClick={() => handleEdit(visit)} 
                                            className="p-2.5 bg-slate-100 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all border border-slate-200"
                                            title="Edit Record"
                                          >
                                            <Edit2 size={16} />
                                          </button>
                                          <button 
                                            onClick={() => onDeleteRecord(visit.id)} 
                                            className="p-2.5 bg-slate-100 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-200"
                                            title="Delete Record"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <RecordModal 
        isOpen={isModalOpen} 
        initialData={editingRecord}
        onClose={() => setIsModalOpen(false)} 
        onSave={(data) => {
          onAddRecord(data);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default AdminDashboard;
