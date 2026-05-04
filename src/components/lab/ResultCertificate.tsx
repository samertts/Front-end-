import React from 'react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { Shield, CheckCircle2, Download, Printer, X, FileText, Activity } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { cn } from '../../lib/utils';

interface ResultCertificateProps {
  taskId: string;
  patientName: string;
  testName: string;
  resultValue: string;
  unit: string;
  referenceRange: string;
  issuedAt: string;
  issuedBy: string;
  onClose: () => void;
}

export const ResultCertificate: React.FC<ResultCertificateProps> = ({
  taskId,
  patientName,
  testName,
  resultValue,
  unit,
  referenceRange,
  issuedAt,
  issuedBy,
  onClose
}) => {
  const { t, isRtl, dir } = useLanguage();

  const verificationUrl = `https://health-os.verify/result/${taskId}`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative"
        dir={dir}
      >
        {/* Header Ribbon */}
        <div className="h-4 bg-indigo-600 w-full" />
        
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        <div className="p-12">
          {/* Institution Header */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                <Activity size={32} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">National Health OS</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Laboratory Diagnostics Division</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest border border-emerald-100">
                <CheckCircle2 size={14} /> {t.resultVerified}
              </div>
            </div>
          </div>

          {/* Certificate Title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
              {t.digitalCertificate}
            </h1>
            <div className="h-1 w-24 bg-indigo-600 mx-auto rounded-full" />
          </div>

          {/* Patient Info Grid */}
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Name</label>
              <p className="text-lg font-bold text-slate-800">{patientName}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Report Date</label>
              <p className="text-lg font-bold text-slate-800">{issuedAt}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificate ID</label>
              <p className="text-sm font-mono text-slate-500">RES-{taskId.slice(-12).toUpperCase()}</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical License (Issuer)</label>
              <p className="text-sm font-bold text-slate-800">{issuedBy}</p>
            </div>
          </div>

          {/* Result Box */}
          <div className="bg-slate-50 rounded-[2.5rem] p-10 mb-12 border border-slate-100 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText size={120} />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-baseline justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{testName}</h3>
                <span className="px-3 py-1 bg-white rounded-lg text-[10px] font-black text-slate-400 border border-slate-200">
                  {unit}
                </span>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-6xl font-black text-indigo-600 tracking-tighter">
                  {resultValue}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Reference Range</p>
                  </div>
                  <p className="text-lg font-bold text-slate-900 pl-3.5 border-l-2 border-indigo-100 italic">
                    {referenceRange} {unit}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Footer */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-12">
            <div className="flex items-center gap-6">
              <div className="p-3 bg-white border-2 border-slate-100 rounded-3xl shadow-xl">
                <QRCodeSVG 
                  value={verificationUrl}
                  size={100}
                  level="H"
                  includeMargin={true}
                  imageSettings={{
                    src: "https://cdn-icons-png.flaticon.com/512/3063/3063176.png",
                    height: 20,
                    width: 20,
                    excavate: true,
                  }}
                />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{t.verifyViaQr}</p>
                <p className="text-[9px] text-slate-400 max-w-[200px] leading-relaxed italic">
                  This cryptographic token ensures the data originates from a verified National Health OS laboratory node.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all flex items-center gap-2 group">
                <Printer size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 group">
                <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
                {t.printCertificate}
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex justify-center py-6 pointer-events-none opacity-50">
           <div className="flex items-center gap-2">
              <Shield size={12} className="text-slate-300" />
              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-[0.2em]">Secure Blockchain Verified Certificate</p>
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
