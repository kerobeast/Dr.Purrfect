
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Check, Camera, ArrowRight, ArrowLeft, Image as ImageIcon, ZoomIn, Utensils, Droplet, Activity, ShieldCheck, FlaskConical, UserRound, Thermometer, AlertCircle, CalendarClock, Phone, Globe } from 'lucide-react';
import { FullVisitRecord, PetType, Gender } from '../types';
import ImageLightbox from './ImageLightbox';

interface Props {
  isOpen: boolean;
  initialData?: FullVisitRecord | null;
  onClose: () => void;
  onSave: (record: FullVisitRecord) => void;
}

const RecordModal: React.FC<Props> = ({ isOpen, initialData, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  
  // Refs for File Access
  const portraitInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<FullVisitRecord>>({
    date: new Date().toISOString().split('T')[0],
    pet_type: PetType.DOG,
    gender: Gender.FEMALE,
    doctor_name: 'Dr. Jane Doe',
    follow_up_date: '',
    owner_phone_confirmation: '',
    owner_phone_country_code: '+1',
    breed: '',
    age: '',
    color: '',
    vaccinations: '',
    diet_breakfast: '',
    diet_lunch: '',
    diet_dinner: '',
    diet_water: '',
    stool_color: 'Brown',
    stool_consistency: 'Solid',
    stool_frequency: 'Once Daily',
    urine_color: 'Pale Yellow',
    urine_frequency: 'Normal',
    symptoms: '',
    diagnosis: '',
    prescription: '',
    recommendations: '',
    weight: 0,
    temperature: 0,
    heart_rate: 0,
    image_urls: [],
    display_id: 'NEW',
    profile_photo_url: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        image_urls: initialData.image_urls || []
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        pet_type: PetType.DOG,
        gender: Gender.FEMALE,
        doctor_name: 'Dr. Jane Doe',
        follow_up_date: '',
        owner_phone_confirmation: '',
        owner_phone_country_code: '+1',
        breed: '',
        age: '',
        color: '',
        vaccinations: '',
        diet_breakfast: '',
        diet_lunch: '',
        diet_dinner: '',
        diet_water: '',
        stool_color: 'Brown',
        stool_consistency: 'Solid',
        stool_frequency: 'Once Daily',
        urine_color: 'Pale Yellow',
        urine_frequency: 'Normal',
        symptoms: '',
        diagnosis: '',
        prescription: '',
        recommendations: '',
        weight: 0,
        temperature: 0,
        heart_rate: 0,
        image_urls: [],
        display_id: 'NEW',
        profile_photo_url: ''
      });
    }
    setStep(1);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as FullVisitRecord);
    setStep(1);
  };

  const handleFileRead = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onPortraitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileRead(e.target.files[0], (base64) => {
        setFormData({ ...formData, profile_photo_url: base64 });
      });
    }
  };

  const onMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const currentUrls = formData.image_urls || [];
      if (currentUrls.length >= 5) return;
      handleFileRead(e.target.files[0], (base64) => {
        setFormData({ ...formData, image_urls: [...currentUrls, base64] });
      });
    }
  };

  const handleRemovePhoto = (idx: number) => {
    const currentUrls = formData.image_urls || [];
    setFormData({ ...formData, image_urls: currentUrls.filter((_, i) => i !== idx) });
  };

  const isEditMode = !!initialData?.id;

  // Design Constants
  const labelStyle = "block text-[11px] font-extrabold text-slate-900 uppercase tracking-wider mb-1.5";
  const inputBaseStyle = "w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-blue-800 transition-colors";

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">1. Patient Profile</h3>
              <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-[10px] font-black border border-blue-100">
                PATIENT ID: {formData.display_id === 'NEW' ? 'ASSIGNING...' : formData.display_id}
              </div>
            </div>

            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="relative group">
                <input type="file" ref={portraitInputRef} className="hidden" accept="image/*" onChange={onPortraitChange} />
                <div 
                  className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-emerald-400 transition-colors"
                  onClick={() => portraitInputRef.current?.click()}
                >
                  {formData.profile_photo_url ? (
                    <img src={formData.profile_photo_url} className="w-full h-full object-cover" alt="Portrait" />
                  ) : (
                    <Camera size={28} className="text-slate-300" />
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => portraitInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-500 text-white rounded-lg shadow-lg border border-white hover:bg-emerald-600 transition-colors"
                >
                  <Upload size={10} />
                </button>
              </div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Patient Portrait</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className={labelStyle}>Owner Name</label>
                <input type="text" className={inputBaseStyle} placeholder="Full name" value={formData.owner_name || ''} onChange={(e) => setFormData({...formData, owner_name: e.target.value})} required />
              </div>
              <div className="col-span-1">
                <label className={labelStyle}>Pet Name</label>
                <input type="text" className={inputBaseStyle} placeholder="e.g. Buddy" value={formData.pet_name || ''} onChange={(e) => setFormData({...formData, pet_name: e.target.value})} required />
              </div>
              <div className="col-span-1">
                <label className={labelStyle}>Type of Animal</label>
                <select 
                  className={inputBaseStyle}
                  value={formData.pet_type}
                  onChange={(e) => setFormData({...formData, pet_type: e.target.value as PetType})}
                >
                  {Object.values(PetType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-1">
                <label className={labelStyle}>Gender</label>
                <select 
                  className={inputBaseStyle}
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value as Gender})}
                >
                  {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="col-span-1">
                <label className={labelStyle}>Breed</label>
                <input type="text" className={inputBaseStyle} placeholder="e.g. Siamese" value={formData.breed || ''} onChange={(e) => setFormData({...formData, breed: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className={labelStyle}>Pet Color</label>
                <input type="text" className={inputBaseStyle} placeholder="e.g. Tricolor" value={formData.color || ''} onChange={(e) => setFormData({...formData, color: e.target.value})} />
              </div>
              <div className="col-span-1">
                <label className={labelStyle}>Age</label>
                <input type="text" className={inputBaseStyle} placeholder="e.g. 2Y 4M" value={formData.age || ''} onChange={(e) => setFormData({...formData, age: e.target.value})} />
              </div>
            </div>
            <button type="button" onClick={handleNext} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 hover:bg-slate-800 transition-all shadow-lg active:scale-[0.98]">
              Diet & Elimination <ArrowRight size={18} />
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 max-h-[70vh] overflow-y-auto px-1 pb-4">
             <h3 className="text-xl font-bold text-slate-900 mb-4">2. Habits & Lifestyle</h3>
             
             <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm mb-1 uppercase tracking-tight">
                  <Utensils size={16} className="text-emerald-600" /> Dietary Habits (3 Meals)
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-black text-slate-800 uppercase mb-1">Breakfast</label>
                    <input type="text" placeholder="Food/Amt" className="w-full p-2.5 bg-white border border-emerald-100 rounded-lg text-xs outline-none font-bold text-blue-800" value={formData.diet_breakfast || ''} onChange={(e) => setFormData({...formData, diet_breakfast: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-800 uppercase mb-1">Lunch</label>
                    <input type="text" placeholder="Food/Amt" className="w-full p-2.5 bg-white border border-emerald-100 rounded-lg text-xs outline-none font-bold text-blue-800" value={formData.diet_lunch || ''} onChange={(e) => setFormData({...formData, diet_lunch: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-800 uppercase mb-1">Dinner</label>
                    <input type="text" placeholder="Food/Amt" className="w-full p-2.5 bg-white border border-emerald-100 rounded-lg text-xs outline-none font-bold text-blue-800" value={formData.diet_dinner || ''} onChange={(e) => setFormData({...formData, diet_dinner: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-800 uppercase mb-1">Water Intake (Ltr / OZ per day)</label>
                  <input type="text" placeholder="e.g. 0.5 Ltr or 16 OZ" className="w-full p-2.5 bg-white border border-emerald-100 rounded-lg text-xs outline-none font-black text-blue-800" value={formData.diet_water || ''} onChange={(e) => setFormData({...formData, diet_water: e.target.value})} />
                </div>
             </div>

             <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-black text-sm mb-1 uppercase tracking-tight">
                  <Activity size={16} className="text-amber-600" /> Elimination Health
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Stool (Defecation)</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" placeholder="Color" className="p-2.5 bg-white border border-amber-200 rounded-lg text-[11px] outline-none font-black text-blue-800" value={formData.stool_color || ''} onChange={(e) => setFormData({...formData, stool_color: e.target.value})} />
                    <input type="text" placeholder="Consistency" className="p-2.5 bg-white border border-amber-200 rounded-lg text-[11px] outline-none font-black text-blue-800" value={formData.stool_consistency || ''} onChange={(e) => setFormData({...formData, stool_consistency: e.target.value})} />
                    <input type="text" placeholder="Frequency" className="p-2.5 bg-white border border-amber-200 rounded-lg text-[11px] outline-none font-black text-blue-800" value={formData.stool_frequency || ''} onChange={(e) => setFormData({...formData, stool_frequency: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5"><FlaskConical size={10} className="text-blue-500"/> Urine (Urination)</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Color" className="p-2.5 bg-white border border-amber-200 rounded-lg text-[11px] outline-none font-black text-blue-800" value={formData.urine_color || ''} onChange={(e) => setFormData({...formData, urine_color: e.target.value})} />
                    <input type="text" placeholder="Frequency" className="p-2.5 bg-white border border-amber-200 rounded-lg text-[11px] outline-none font-black text-blue-800" value={formData.urine_frequency || ''} onChange={(e) => setFormData({...formData, urine_frequency: e.target.value})} />
                  </div>
                </div>
             </div>

             <div className="flex gap-4 mt-6">
                <button type="button" onClick={handleBack} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
                  <ArrowLeft size={18} /> Back
                </button>
                <button type="button" onClick={handleNext} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98]">
                  Clinical Summary <ArrowRight size={18} />
                </button>
             </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 max-h-[70vh] overflow-y-auto px-1 pb-4">
             <h3 className="text-xl font-bold text-slate-900 mb-4">3. Assessment & Media</h3>
             
             <div className="grid grid-cols-3 gap-4">
              <div>
                <label className={labelStyle}>Weight (kg)</label>
                <input type="number" step="0.1" className={inputBaseStyle} value={formData.weight || ''} onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className={labelStyle}>Temp (°C)</label>
                <input type="number" step="0.1" className={inputBaseStyle} value={formData.temperature || ''} onChange={(e) => setFormData({...formData, temperature: parseFloat(e.target.value)})} />
              </div>
              <div>
                <label className={labelStyle}>Heart Rate</label>
                <input type="number" className={inputBaseStyle} value={formData.heart_rate || ''} onChange={(e) => setFormData({...formData, heart_rate: parseInt(e.target.value)})} />
              </div>
             </div>

             <div className="space-y-4">
              <div>
                <label className={`${labelStyle} flex items-center gap-1.5`}><ShieldCheck size={12} className="text-blue-600" /> Vaccinations Given</label>
                <input type="text" className={inputBaseStyle} placeholder="e.g. Rabies, DHPP" value={formData.vaccinations || ''} onChange={(e) => setFormData({...formData, vaccinations: e.target.value})} />
              </div>
              <div>
                <label className={`${labelStyle} flex items-center gap-1.5 text-rose-700`}><AlertCircle size={12} className="text-rose-600" /> Symptoms</label>
                <textarea rows={2} className={`${inputBaseStyle} h-20`} placeholder="Observations by owner..." value={formData.symptoms || ''} onChange={(e) => setFormData({...formData, symptoms: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Diagnosis</label>
                <textarea rows={2} className={`${inputBaseStyle} h-20`} placeholder="Primary clinical findings..." value={formData.diagnosis || ''} onChange={(e) => setFormData({...formData, diagnosis: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Prescription</label>
                <textarea rows={2} className={`${inputBaseStyle} italic h-20`} placeholder="Rx details, frequency, dosage..." value={formData.prescription || ''} onChange={(e) => setFormData({...formData, prescription: e.target.value})} />
              </div>
              <div>
                <label className={labelStyle}>Recommendation / Advice</label>
                <textarea rows={2} className={`${inputBaseStyle} h-20`} placeholder="Next steps for owner..." value={formData.recommendations || ''} onChange={(e) => setFormData({...formData, recommendations: e.target.value})} />
              </div>
             </div>

              <div className="space-y-2">
                <input type="file" ref={mediaInputRef} className="hidden" accept="image/*" onChange={onMediaChange} />
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <label className={labelStyle}>Clinical Media ({formData.image_urls?.length || 0}/5)</label>
                  {(formData.image_urls?.length || 0) < 5 && (
                    <button 
                      type="button" 
                      onClick={() => mediaInputRef.current?.click()}
                      className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg hover:bg-emerald-100 transition-colors uppercase tracking-widest"
                    >
                      Attach from Gallery
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {formData.image_urls?.map((url, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm cursor-zoom-in" onClick={() => setEnlargedImage(url)}>
                      <img src={url} alt={`Visit documentation ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                        <ZoomIn size={24} className="text-white drop-shadow-lg" />
                      </div>
                      <button 
                        type="button" 
                        onClick={(e) => { e.stopPropagation(); handleRemovePhoto(idx); }}
                        className="absolute top-2 right-2 bg-rose-500 text-white p-1.5 rounded-full shadow-lg z-20 hover:bg-rose-600 active:scale-90 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {(formData.image_urls?.length || 0) < 5 && (
                    <button 
                      type="button" 
                      onClick={() => mediaInputRef.current?.click()}
                      className="aspect-square border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all group"
                    >
                      <ImageIcon size={28} className="mb-1 group-hover:scale-110 transition-transform" />
                      <p className="text-[9px] font-black uppercase tracking-tighter">Gallery</p>
                    </button>
                  )}
                </div>
              </div>
             
              <div className="flex gap-4 mt-6">
                <button type="button" onClick={handleBack} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all hover:bg-slate-200">Back</button>
                <button type="button" onClick={handleNext} className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 active:scale-[0.98]">
                  Finalizing Care <ArrowRight size={18} />
                </button>
             </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
             <h3 className="text-xl font-bold text-slate-900 mb-4">4. Finalizing Care</h3>
             
             <div className="space-y-4">
              <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-200">
                <label className="block text-[11px] font-black text-slate-800 uppercase mb-2 flex items-center gap-1.5 tracking-wider"><CalendarClock size={16} className="text-blue-600" /> Follow-up Date</label>
                <input 
                  type="date" 
                  className="w-full p-4 bg-white border border-blue-200 rounded-xl font-black text-blue-800 outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" 
                  value={formData.follow_up_date || ''} 
                  onChange={(e) => setFormData({...formData, follow_up_date: e.target.value})} 
                />
                <p className="mt-2 text-[10px] text-blue-600 font-bold italic">SMS reminder will be sent on this date.</p>
              </div>

              <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-200">
                <label className="block text-[11px] font-black text-slate-800 uppercase mb-2 flex items-center gap-1.5 tracking-wider"><Phone size={16} className="text-amber-600" /> Owner's Phone Number</label>
                <div className="flex gap-2">
                  <div className="w-24 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600"><Globe size={14} /></div>
                    <input 
                      type="text" 
                      placeholder="+1" 
                      className="w-full pl-8 pr-2 py-4 bg-white border-amber-300 rounded-xl font-black text-blue-800 outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm shadow-sm"
                      value={formData.owner_phone_country_code || ''}
                      onChange={(e) => setFormData({...formData, owner_phone_country_code: e.target.value})}
                    />
                  </div>
                  <input 
                    type="tel" 
                    className="flex-1 p-4 bg-white border-amber-300 rounded-xl font-black text-blue-800 outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-sm" 
                    placeholder="e.g. 555-0101" 
                    value={formData.owner_phone_confirmation || ''} 
                    onChange={(e) => setFormData({...formData, owner_phone_confirmation: e.target.value})} 
                  />
                </div>
                <p className="mt-2 text-[10px] text-amber-700 font-bold italic">Include country code for automated SMS checkups.</p>
              </div>

              <div className="p-6 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <label className="block text-[11px] font-black text-slate-800 uppercase mb-2 flex items-center gap-1.5 tracking-wider"><UserRound size={16} className="text-emerald-600" /> Attending Doctor Name</label>
                <input 
                  type="text" 
                  className="w-full p-4 bg-white border border-emerald-300 rounded-xl font-black text-blue-800 outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm" 
                  placeholder="e.g. Dr. Jane Smith" 
                  value={formData.doctor_name || ''} 
                  onChange={(e) => setFormData({...formData, doctor_name: e.target.value})} 
                  required
                />
              </div>
             </div>

             <div className="flex gap-4 mt-8">
                <button type="button" onClick={handleBack} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all hover:bg-slate-200 active:scale-95">Back</button>
                <button type="submit" className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-emerald-200 hover:bg-emerald-700">
                  <Check size={18} /> {isEditMode ? 'Update Health Record' : 'Save & Send Prescription'}
                </button>
             </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <ImageLightbox imageUrl={enlargedImage} onClose={() => setEnlargedImage(null)} />
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {isEditMode ? 'Edit Health History' : (initialData?.pet_name ? `New Visit: ${initialData.pet_name}` : 'New Clinical Entry')}
              </h2>
              <div className="flex gap-1.5 mt-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'bg-emerald-500 w-8' : 'bg-slate-100 w-4'}`} />
                ))}
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit}>{renderStep()}</form>
        </div>
      </div>
    </div>
  );
};

export default RecordModal;
