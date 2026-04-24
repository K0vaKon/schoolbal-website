import { UploadComponent } from '@/components/UploadComponent';
import { Upload } from 'lucide-react';

export default function UploadPage() {
  return (
    <div>
      <div className="text-center mb-16">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-3 rounded-full">
            <Upload className="w-6 h-6 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-4 tracking-tight">
          Foto Uploaden
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Upload je favoriete foto's van het schoolbal. Ze worden eerst gecontroleerd door de beheerder.
        </p>
      </div>
      <UploadComponent />
    </div>
  );
}
