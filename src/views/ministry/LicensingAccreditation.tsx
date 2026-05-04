import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ClipboardList, CheckCircle2, Clock, AlertCircle, 
  Search, Filter, Plus, MoreHorizontal, 
  Building2, BadgeCheck, FileText, Shield,
  ArrowUpRight, Download, Eye
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

const applications = [
  { id: 'APP-992', facility: 'Future Lab Baghdad', type: 'Clinical Lab', status: 'Pending Review', date: '2024-04-20', risk: 'Low' },
  { id: 'APP-988', facility: 'Basrah Diagnostics', type: 'Specialized Center', status: 'Inspection Scheduled', date: '2024-04-18', risk: 'Moderate' },
  { id: 'APP-985', facility: 'Al-Hayat Path Lab', type: 'Private Lab', status: 'Approved', date: '2024-04-15', risk: 'Low' },
  { id: 'APP-982', facility: 'Erbil Molecular Hub', type: 'Molecular Lab', status: 'Rejected', date: '2024-04-10', risk: 'High' },
];

export function LicensingAccreditation() {
  const { t, isRtl } = useLanguage();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Pending Review': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Inspection Scheduled': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600">{t.regulatoryOversight}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{t.regulatoryControl}</h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t.accreditationLifecycle}</p>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-4 bg-white border border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-3">
            <Download size={16} /> {t.standardsRegistry}
          </button>
          <button className="px-6 py-4 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-2xl shadow-slate-200 hover:bg-indigo-600 transition-all flex items-center gap-3">
            <Plus size={16} /> {t.newApplication}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1600px] mx-auto w-full">
        {[
          { label: t.activeLicenses, value: '1,420', icon: BadgeCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: t.pendingInspections, value: '42', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: t.regulatoryViolations, value: '08', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map((stat, i) => (
          <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-between group cursor-pointer hover:border-indigo-200 transition-all">
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                <p className="text-4xl font-black text-slate-900 leading-none">{stat.value}</p>
             </div>
             <div className={cn("p-4 rounded-[1.5rem] transition-all group-hover:scale-110", stat.bg, stat.color)}>
                <stat.icon size={28} />
             </div>
          </div>
        ))}
      </div>

      <div className="max-w-[1600px] mx-auto w-full bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50">
        <div className="px-8 py-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50/50">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder={t.searchFacility}
                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold focus:ring-4 focus:ring-indigo-100 transition-all"
              />
           </div>
           <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                 <Filter size={16} /> {t.filters}
              </button>
              <button className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all">
                 <MoreHorizontal size={20} />
              </button>
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className={cn("w-full", isRtl ? "text-right" : "text-left")}>
              <thead>
                 <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-5">{t.applicationId}</th>
                    <th className="px-8 py-5">{t.facilityName}</th>
                    <th className="px-8 py-5">{t.assetType}</th>
                    <th className="px-8 py-5">{t.approvalState}</th>
                    <th className="px-8 py-5">{t.submissionDate}</th>
                    <th className="px-4 py-5"></th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {applications.map((app, i) => (
                    <tr key={i} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                       <td className="px-8 py-6">
                          <span className="text-xs font-mono font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">{app.id}</span>
                       </td>
                       <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                <Building2 size={18} />
                             </div>
                             <div>
                                <p className="text-sm font-black text-slate-900 leading-tight">{app.facility}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.zoneCentral}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{app.type}</p>
                       </td>
                       <td className="px-8 py-6">
                          <div className={cn(
                            "inline-flex items-center px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                            getStatusStyle(app.status)
                          )}>
                             {app.status}
                          </div>
                       </td>
                       <td className="px-8 py-6">
                          <p className="text-xs font-bold text-slate-600">{app.date}</p>
                       </td>
                       <td className="px-4 py-6">
                          <div className="flex items-center justify-end pr-4 gap-2">
                             <button className="p-2 text-slate-300 hover:text-indigo-600 transition-all">
                                <Eye size={18} />
                             </button>
                             <button className="p-2 text-slate-300 hover:text-slate-600 transition-all">
                                <FileText size={18} />
                             </button>
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}

export default LicensingAccreditation;
