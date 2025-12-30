
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, Plus, Minus, Filter, Edit2, Trash2, FileText, Calendar, Dog, Info, ChevronRight, Activity, Clock, Utensils, Droplet, ShieldCheck, Thermometer, FlaskConical, ZoomIn, UserRound, AlertCircle, PlusCircle, CalendarClock, LogOut, ShieldPlus, Check, KeyRound, X, ChevronDown, FilterX, Lock, ArrowDown, AlertTriangle, ArrowLeft, Home, MoveRight } from 'lucide-react';
import { FullVisitRecord, PetType, Gender } from '../types';
import RecordModal from './RecordModal';
import ImageLightbox from './ImageLightbox';

interface Props {
  records: FullVisitRecord[];
  onAddRecord: (record: FullVisitRecord) => void;
  onDeleteRecord: (id: string) => void;
  onLogout?: () => void;
  onUpdateKey?: (message: string) => void;
  onSwitchRole?: () => void;
}

const formatDisplayDate = (dateString: string) => {
  if (!dateString) return 'Initial Setup';
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

const AdminDashboard: React.FC<Props> = ({ records, onAddRecord, onDeleteRecord, onLogout, onUpdateKey, onSwitchRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FullVisitRecord | null>(null);
  const [expandedPetId, setExpandedPetId] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Security management
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [newAccessCode, setNewAccessCode] = useState('');

  // Filtering management
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [selectedSpecies, setSelectedSpecies] = useState<PetType[]>([]);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [showRecentOnly, setShowRecentOnly] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Memoized data declarations
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
      const matchesSearch = 
        r.owner_name.toLowerCase().includes(term) ||
        r.pet_name.toLowerCase().includes(term) ||
        r.diagnosis.toLowerCase().includes(term) ||
        r.breed.toLowerCase().includes(term) ||
        r.display_id.toLowerCase().includes(term);

      if (!matchesSearch) return false;
      if (selectedSpecies.length > 0 && !selectedSpecies.includes(r.pet_type)) return false;
      if (selectedGender && r.gender !== selectedGender) return false;
      if (showRecentOnly) {
        if (!r.date) return false;
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
      const dateA = a[0].date ? new Date(a[0].date).getTime() : 0;
      const dateB = b[0].date ? new Date(b[0].date).getTime() : 0;
      return dateB - dateA;
    });
  }, [records, searchTerm, selectedSpecies, selectedGender, showRecentOnly]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Horizontal scroll detection
  const checkScroll = () => {
    if (tableContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tableContainerRef.current;
      setCanScrollRight(scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [groupedRecords]);

  const handleScrollToRight = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

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

  const handleEdit = (record: FullVisitRecord) => {
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteRecord(deleteConfirmId);
      setDeleteConfirmId(null);
    }
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
      image_urls: [],
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
    <div className="space-y-4 relative pb-20">
      <ImageLightbox imageUrl={enlargedImage} onClose={() => setEnlargedImage(null)} />

      {/* Deletion Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative w-full max-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 p-8 text-center">
             <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} />
             </div>
             <h3 className="text-xl font-black text-slate-900 mb-2">Delete Record?</h3>
             <p className="text-slate-500 text-sm font-medium mb-8">This action is permanent and cannot be undone. Are you sure you want to remove this medical entry?</p>
             <div className="flex gap-3">
                <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-200">Confirm Delete</button>
             </div>
          </div>
        </div>
      )}

      {/* Dynamic Scroll Hint */}
      {!isScrolled && groupedRecords.length > 5 && (
        <div className="fixed bottom-10 right-10 z-[100] animate-bounce pointer-events-none">
          <div className="flex flex-col items-center gap-1.5 px-4 py-3 bg-slate-900 text-white rounded-full shadow-2xl border border-white/10 backdrop-blur-md">
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Scroll for more</span>
            <ArrowDown size={14} className="text-emerald-400" />
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-4 mb-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Vet's Workspace</h2>
            <div className="flex gap-1.5">
              <button 
                onClick={() => setIsSecurityOpen(!isSecurityOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${isSecurityOpen ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50'}`}
              >
                <ShieldPlus size={12} /> Security
              </button>
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-rose-200 shadow-sm"
                >
                  <LogOut size={12} /> Lock Portal
                </button>
              )}
            </div>
          </div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Digital Prescription Desk</p>
        </div>
        <button 
          onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-200 transition-all active:scale-95"
        >
          <Plus size={16} />
          <span>New Entry</span>
        </button>
      </div>

      {isSecurityOpen && (
        <div className="bg-slate-900 text-white p-5 rounded-[1.5rem] border border-slate-800 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white/10 rounded-xl text-emerald-400"><KeyRound size={22} /></div>
              <div>
                <h4 className="text-sm font-black tracking-tight leading-none">Access Key Security</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5">Update credentials</p>
              </div>
            </div>
            <div className="flex flex-1 max-sm w-full gap-2">
              <input 
                type="password"
                placeholder="New Access Key..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg py-2.5 px-4 text-xs font-black text-emerald-400 outline-none focus:border-emerald-500 transition-all"
                value={newAccessCode}
                onChange={(e) => setNewAccessCode(e.target.value)}
              />
              <button onClick={handleUpdateAccessCode} className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl relative overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between bg-white rounded-t-[2rem] relative z-[60]">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Quick search patient or owner..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeFilterCount > 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              <Filter size={14} /> 
              <span>Filters</span>
              {activeFilterCount > 0 && <span className="w-4 h-4 bg-emerald-600 text-white rounded-full text-[9px] flex items-center justify-center">{activeFilterCount}</span>}
              <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterMenuOpen && (
              <div className="absolute right-0 md:right-0 left-0 md:left-auto mt-3 w-full md:w-80 bg-white border border-slate-200 shadow-2xl rounded-[1.5rem] p-6 space-y-6 animate-in slide-in-from-top-2 duration-200 z-[100]">
                 <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Clinical Filters</h4>
                  <button onClick={clearAllFilters} className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline">Reset</button>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">Species Selection</label>
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-2">
                    {Object.values(PetType).map(type => (
                      <button 
                        key={type} 
                        onClick={() => toggleSpecies(type)} 
                        className={`px-3 py-2 rounded-lg text-[9px] font-black border transition-all truncate text-center ${selectedSpecies.includes(type) ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-300'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                   <button 
                    onClick={() => setShowRecentOnly(!showRecentOnly)} 
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all border ${showRecentOnly ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-100 text-slate-500'}`}
                   >
                     <div className="flex flex-col items-start gap-0.5">
                       <span className="text-[10px] font-black uppercase tracking-tight">Active Records</span>
                       <span className="text-[8px] font-bold opacity-60 uppercase">Past 7 Days Only</span>
                     </div>
                     <div className={`w-9 h-5 rounded-full relative transition-colors ${showRecentOnly ? 'bg-amber-500' : 'bg-slate-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${showRecentOnly ? 'right-1' : 'left-1'}`} />
                     </div>
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Scroll Indicator Overlay */}
        {canScrollRight && (
          <div className="absolute right-0 top-[80px] bottom-0 w-16 bg-gradient-to-l from-white via-white/40 to-transparent z-[70] pointer-events-none flex items-center justify-end pr-2 md:hidden">
            <button 
              onClick={handleScrollToRight}
              className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse pointer-events-auto active:scale-95 transition-transform"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        <div 
          ref={tableContainerRef}
          onScroll={checkScroll}
          className="overflow-x-auto rounded-b-[2rem] scroll-smooth"
        >
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="w-12 px-5 py-3"></th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Guardian</th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Patient ID</th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Details</th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">Last Visit</th>
                <th className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right pr-10 whitespace-nowrap">Vault</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groupedRecords.map(([petId, petVisits]) => {
                const latestVisit = petVisits[0];
                const isExpanded = expandedPetId === petId;
                return (
                  <React.Fragment key={petId}>
                    <tr onClick={() => toggleExpand(petId)} className={`hover:bg-slate-50/80 transition-all cursor-pointer group ${isExpanded ? 'bg-emerald-50/20' : ''}`}>
                      <td className="px-5 py-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {isExpanded ? <Minus size={14} /> : <Plus size={14} />}
                        </div>
                      </td>
                      <td className="px-5 py-2.5 whitespace-nowrap text-xs font-black text-slate-900">{latestVisit.owner_name}</td>
                      <td className="px-5 py-2.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded-md text-[9px] font-black border border-blue-100">{latestVisit.display_id}</span>
                      </td>
                      <td className="px-5 py-2.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          {latestVisit.profile_photo_url ? (
                            <img src={latestVisit.profile_photo_url} className="w-8 h-8 rounded-lg object-cover shadow-sm border border-slate-200" alt={latestVisit.pet_name} />
                          ) : (
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black bg-emerald-100 text-emerald-800">{latestVisit.pet_name[0]}</div>
                          )}
                          <div>
                            <div className="text-xs font-black text-slate-900">{latestVisit.pet_name}</div>
                            <div className="text-[9px] font-bold text-slate-400 flex items-center gap-1.5">
                              <span>{latestVisit.breed}</span>
                              <span className="opacity-30">•</span>
                              <span>{latestVisit.gender}</span>
                              <span className="opacity-30">•</span>
                              <span className="text-blue-600 font-black">{formatAge(latestVisit.age)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-2.5 whitespace-nowrap text-center text-[11px] font-medium text-slate-500">{formatDisplayDate(latestVisit.date)}</td>
                      <td className="px-5 py-2.5 text-right pr-10">
                        <div className="flex items-center justify-end gap-2">
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full whitespace-nowrap">{petVisits.length} Records</span>
                           <ChevronRight size={14} className="text-slate-300 md:hidden" />
                        </div>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="bg-slate-50/30">
                        <td colSpan={6} className="px-4 py-3">
                          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-inner">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical History • Patient {latestVisit.display_id}</h5>
                              <button onClick={() => handleAddFollowUp(latestVisit)} className="text-[9px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5 hover:bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100"><PlusCircle size={12} /> Log Visit</button>
                            </div>
                            <div className="space-y-2">
                              {petVisits.map((visit) => (
                                <div key={visit.id} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex flex-col lg:flex-row gap-4 lg:gap-0 items-start lg:items-center relative">
                                  <div className="shrink-0 w-full lg:w-28 lg:border-r lg:border-slate-200 lg:mr-6 flex justify-between lg:block items-center">
                                    <div className="text-[11px] font-black text-slate-900">{formatDisplayDate(visit.date)}</div>
                                    <div className="text-[9px] font-bold text-emerald-600 mt-0.5 flex items-center gap-1"><UserRound size={10} /> {visit.doctor_name}</div>
                                  </div>
                                  
                                  <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-8 w-full items-start lg:items-center mt-2 lg:mt-0">
                                    <div className="flex-[1.5] min-w-0 space-y-1 w-full">
                                      <h6 className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Condition</h6>
                                      <p className="text-[10px] font-black text-slate-900 leading-tight truncate" title={visit.diagnosis}>{visit.diagnosis}</p>
                                    </div>
                                    <div className="flex-[1.5] min-w-0 space-y-1 w-full">
                                      <div className="flex items-center justify-between">
                                        <h6 className="text-[8px] font-black uppercase text-emerald-600 tracking-tighter">Prescription</h6>
                                      </div>
                                      <p className="text-[10px] font-black text-blue-800 leading-tight italic truncate" title={visit.prescription}>{visit.prescription || 'N/A'}</p>
                                    </div>
                                    <div className="shrink-0 flex gap-4 lg:px-4 lg:border-l lg:border-slate-100 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0 scrollbar-hide">
                                      <div className="flex flex-col min-w-10"><span className="text-[8px] font-black uppercase text-slate-400">Wt</span><span className="text-[10px] font-black">{visit.weight}kg</span></div>
                                      <div className="flex flex-col min-w-10"><span className="text-[8px] font-black uppercase text-slate-400">Tmp</span><span className="text-[10px] font-black">{visit.temperature}°</span></div>
                                      <div className="flex flex-col min-w-10"><span className="text-[8px] font-black uppercase text-slate-400">BPM</span><span className="text-[10px] font-black">{visit.heart_rate}</span></div>
                                    </div>
                                    <div className="shrink-0 ml-auto flex items-center gap-3 pl-4 border-l border-slate-100 hidden lg:flex">
                                      {visit.image_urls && visit.image_urls.length > 0 && (
                                        <div className="flex -space-x-2 mr-2">
                                          {visit.image_urls.slice(0, 3).map((url, i) => (
                                            <div key={i} onClick={() => setEnlargedImage(url)} className="w-6 h-6 rounded-md border border-white overflow-hidden shadow-sm cursor-zoom-in hover:scale-110 transition-transform"><img src={url} className="w-full h-full object-cover" /></div>
                                          ))}
                                          {visit.image_urls.length > 3 && <div className="w-6 h-6 rounded-md bg-slate-900 text-white flex items-center justify-center text-[7px] font-black">+{visit.image_urls.length - 3}</div>}
                                        </div>
                                      )}
                                      <div className="flex gap-1">
                                        <button onClick={() => handleEdit(visit)} className="p-1.5 hover:text-blue-600 transition-colors" title="Edit / View Details"><Edit2 size={12} /></button>
                                        <button onClick={() => setDeleteConfirmId(visit.id)} className="p-1.5 hover:text-rose-600 transition-colors" title="Delete Record"><Trash2 size={12} /></button>
                                      </div>
                                    </div>
                                    {/* Mobile only actions */}
                                    <div className="w-full pt-2 flex justify-between items-center lg:hidden border-t border-slate-100 mt-1">
                                      <div className="flex -space-x-2">
                                        {visit.image_urls?.slice(0, 3).map((url, i) => (
                                          <div key={i} onClick={() => setEnlargedImage(url)} className="w-6 h-6 rounded-md border border-white overflow-hidden shadow-sm cursor-zoom-in"><img src={url} className="w-full h-full object-cover" /></div>
                                        ))}
                                      </div>
                                      <div className="flex gap-4">
                                        <button onClick={() => handleEdit(visit)} className="text-[9px] font-black uppercase tracking-widest text-blue-600">Edit / View</button>
                                        <button onClick={() => setDeleteConfirmId(visit.id)} className="text-[9px] font-black uppercase tracking-widest text-rose-600">Delete</button>
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
          <div className="h-20 bg-gradient-to-t from-white/80 to-transparent pointer-events-none absolute bottom-0 left-0 w-full" />
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
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
