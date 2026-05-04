import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Shield, Key, Fingerprint, 
  Search, Filter, Plus, MoreVertical,
  UserCheck, UserX, ShieldAlert, Zap,
  Database, Activity, Lock, Unlock,
  Terminal, Code2, Save, ArrowUpRight, History, Download
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

const mockUsers = [
  { id: 'UID-9902', name: 'Dr. Samer M.', role: 'Senior Pathologist', loa: 'Level 4', status: 'active', location: 'Baghdad Central', mfa: true },
  { id: 'UID-9851', name: 'Sarah Ahmed', role: 'Lab Technician', loa: 'Level 2', status: 'active', location: 'Basrah Hub', mfa: true },
  { id: 'UID-9820', name: 'John Doe', role: 'Integration Service', loa: 'Level 3', status: 'suspended', location: 'System Cluster', mfa: false },
  { id: 'UID-9799', name: 'Mazin Ali', role: 'Health Inspector', loa: 'Level 4', status: 'active', location: 'Nineveh Nord', mfa: true },
];

export function UserGovernance() {
  const { t, isRtl } = useLanguage();
  const [activeTab, setActiveTab] = useState<'users' | 'policies' | 'audit'>('users');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const getLoaColor = (loa: string) => {
    switch (loa) {
      case 'Level 4': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Level 3': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'Level 2': return 'text-indigo-600 bg-indigo-50 border-indigo-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 bg-rose-600 rounded-full" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600">{t.identityGovernance}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-2">{t.userGovernance}</h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">{t.iamControl}</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
           {[
             { id: 'users', label: t.identityFeed, icon: Users },
             { id: 'policies', label: t.iamPolicies, icon: Shield },
             { id: 'audit', label: t.accessAudit, icon: Fingerprint }
           ].map((tab) => (
             <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={cn(
                 "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                 activeTab === tab.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
               )}
             >
               <tab.icon size={16} />
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-[1600px] mx-auto w-full">
         {[
           { label: t.activeIdentities, value: '12,842', icon: Users, color: 'text-indigo-600' },
           { label: t.privilegedAccounts, value: '840', icon: Shield, color: 'text-rose-600' },
           { label: t.trustLoa + ' 4', value: '12%', icon: UserCheck, color: 'text-emerald-600' },
           { label: t.mfaPenetration, value: '98.2%', icon: Lock, color: 'text-amber-600' },
         ].map((stat, i) => (
           <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between mb-4">
                 <div className={cn("p-4 rounded-2xl bg-slate-50", stat.color)}>
                    <stat.icon size={24} />
                 </div>
                 <ArrowUpRight size={20} className="text-slate-300" />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
           </div>
         ))}
      </div>

      <div className="max-w-[1600px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
               {activeTab === 'users' && (
                 <motion.div
                   key="users"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50"
                 >
                    <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                       <div className="relative flex-1 max-w-md">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                          <input 
                            type="text" 
                            placeholder={t.searchIdent}
                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-bold"
                          />
                       </div>
                       <button className="px-6 py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                          <Plus size={16} /> {t.provisionIdentity}
                       </button>
                    </div>

                    <div className="overflow-x-auto">
                       <table className={cn("w-full", isRtl ? "text-right" : "text-left")}>
                          <thead>
                             <tr className="bg-slate-50/30 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                <th className="px-8 py-5">Ident Subject</th>
                                <th className="px-8 py-5">Role/Affiliation</th>
                                <th className="px-8 py-5">Trust (LoA)</th>
                                <th className="px-8 py-5">MFA</th>
                                <th className="px-8 py-5">State</th>
                                <th className="px-4 py-5"></th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {mockUsers.map((user, i) => (
                                <tr key={i} className="hover:bg-indigo-50/20 transition-all cursor-pointer group" onClick={() => setSelectedUser(user)}>
                                   <td className="px-8 py-6">
                                      <div className="flex items-center gap-4">
                                         <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <Users size={20} />
                                         </div>
                                         <div>
                                            <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors uppercase italic">{user.name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 opacity-60 font-mono">{user.id}</p>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-8 py-6">
                                      <p className="text-xs font-bold text-slate-600">{user.role}</p>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase">{user.location}</p>
                                   </td>
                                   <td className="px-8 py-6">
                                      <span className={cn(
                                        "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                        getLoaColor(user.loa)
                                      )}>{user.loa}</span>
                                   </td>
                                   <td className="px-8 py-6">
                                      <div className={cn(
                                        "flex items-center gap-1.5",
                                        user.mfa ? "text-emerald-500" : "text-amber-500"
                                      )}>
                                         <Lock size={14} />
                                         <span className="text-[10px] font-black uppercase">{user.mfa ? t.activeStatus : t.missingStatus}</span>
                                      </div>
                                   </td>
                                   <td className="px-8 py-6">
                                      <div className={cn(
                                        "inline-flex items-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                        user.status === 'active' ? "text-emerald-700 bg-emerald-50 border-emerald-100" : "text-rose-700 bg-rose-50 border-rose-100"
                                      )}>
                                         <div className={cn(
                                           "w-2 h-2 rounded-full mr-2",
                                           user.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                                         )} />
                                         {user.status}
                                      </div>
                                   </td>
                                   <td className="px-4 py-6">
                                      <button className="p-2 text-slate-200 group-hover:text-indigo-600 transition-all">
                                         <MoreVertical size={18} />
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </motion.div>
               )}

               {activeTab === 'policies' && (
                 <motion.div
                   key="policies"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="space-y-8"
                 >
                    <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-10 opacity-5">
                          <Terminal size={120} />
                       </div>
                       <div className="relative z-10">
                          <div className="flex justify-between items-center mb-8">
                             <div>
                                <h3 className="text-xl font-black tracking-tight leading-none mb-1">ABAC Neural Policy Engine</h3>
                                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Attribute-Based Access Control Specification</p>
                             </div>
                             <div className="flex gap-3">
                                <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                                   <Download size={18} />
                                </button>
                                <button className="p-3 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-900/50">
                                   <Save size={18} />
                                </button>
                             </div>
                          </div>

                          <div className="bg-black/50 rounded-3xl border border-white/5 p-8 font-mono text-[11px] leading-relaxed relative group">
                             <div className="absolute top-4 right-4 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Syntax: VALID</span>
                             </div>
                             <pre className="text-indigo-300">
{`{
  "policy_name": "MINISTRY_RESEARCH_CLUSTER_X",
  "effect": "ALLOW",
  "principals": ["ministry_analyst", "researcher_senior"],
  "actions": ["id.read", "result.aggregate", "epi.visualize"],
  "resources": ["urn:gula:id:*", "urn:gula:results:epi_clusters"],
  "conditions": {
    "string_equals": {
      "principal.mfa_active": "true",
      "resource.sovereignty_level": "national"
    },
    "ip_address": ["192.168.0.0/16", "10.0.0.0/8"]
  }
}`}
                             </pre>
                          </div>
                          
                          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <ShieldAlert size={20} className="text-amber-400 mb-3" />
                                <p className="text-xs font-bold mb-1">Strict MFA Enforcement</p>
                                <p className="text-[10px] text-slate-400">All LoA 4 users must possess hardware keys.</p>
                             </div>
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <Lock size={20} className="text-indigo-400 mb-3" />
                                <p className="text-xs font-bold mb-1">Dynamic Redaction</p>
                                <p className="text-[10px] text-slate-400">Non-Clinical roles auto-mask PII data.</p>
                             </div>
                             <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <Zap size={20} className="text-emerald-400 mb-3" />
                                <p className="text-xs font-bold mb-1">Zero-Trust Triage</p>
                                <p className="text-[10px] text-slate-400">Context-aware session challenge active.</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
         </div>

         <div className="lg:col-span-4 space-y-8">
            {selectedUser ? (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-[3rem] border border-indigo-200 shadow-2xl relative overflow-hidden"
              >
                 <div className="flex justify-between items-start mb-10">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl">
                       <Users size={24} />
                    </div>
                    <button onClick={() => setSelectedUser(null)} className="text-slate-300 hover:text-slate-900 transition-colors">
                       <UserX size={20} />
                    </button>
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 italic uppercase">{selectedUser.name}</h3>
                 <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-8">{selectedUser.role} • {selectedUser.loa}</p>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <Activity size={18} className="text-slate-400" />
                          <span className="text-xs font-black uppercase text-slate-500">Security Tokens</span>
                       </div>
                       <span className="text-xs font-black text-slate-900">4 Active</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                       <div className="flex items-center gap-3">
                          <History size={18} className="text-slate-400" />
                          <span className="text-xs font-black uppercase text-slate-500">Last Access</span>
                       </div>
                       <span className="text-xs font-black text-slate-900">2 min ago</span>
                    </div>
                 </div>

                 <div className="mt-10 flex gap-3">
                    <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">Suspend Ident</button>
                    <button className="p-4 bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all">
                       <Unlock size={20} />
                    </button>
                 </div>
              </motion.div>
            ) : (
              <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-5">
                    <Activity size={120} />
                 </div>
                 <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">{t.securityIntelligence}</h3>
                 <h4 className="text-2xl font-black mb-4 leading-tight">{t.accountEntropy}</h4>
                 <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10">
                    Neural analysis indicates 4 Level 3 accounts have high session overlap in the Baghdad Hub. Recommend re-validation.
                 </p>
                 <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-900/50 hover:bg-indigo-500 transition-all">
                    Initiate Bulk Re-Auth
                 </button>
              </div>
            )}

            <div className="p-8 bg-white rounded-[3rem] border border-slate-200">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">{t.iamIntegrity}</h3>
               <div className="flex flex-col items-center text-center p-6">
                  <div className="w-24 h-24 rounded-full border-8 border-indigo-600/10 border-t-indigo-600 flex items-center justify-center mb-4 animate-[spin_10s_linear_infinite]">
                     <Shield size={32} className="text-indigo-600 -rotate-[36grad]" />
                  </div>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight italic">{t.peakDefense}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">G-Identity OS V4.2.1 Stable</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

export default UserGovernance;
