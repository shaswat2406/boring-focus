import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  Upload,
  ExternalLink,
  Copy,
  Eye,
  Search,
  FileText,
  FolderGit2,
  Tv,
} from 'lucide-react';
import { HubSection, HubFileItem, ThemeConfig } from '../../types';

interface LocalFileHubProps {
  theme?: ThemeConfig;
  sections: HubSection[];
  setSections: React.Dispatch<React.SetStateAction<HubSection[]>>;
  files: HubFileItem[];
  setFiles: React.Dispatch<React.SetStateAction<HubFileItem[]>>;
}

export const LocalFileHub: React.FC<LocalFileHubProps> = ({
  theme,
  sections,
  setSections,
  files,
  setFiles,
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<HubFileItem | null>(null);
  const [addPathModalOpen, setAddPathModalOpen] = useState(false);
  const [pathInput, setPathInput] = useState('');
  const [pathNameInput, setPathNameInput] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];

  const handleAddSection = () => {
    const name = prompt('Enter new topic section name (e.g., Python, C++, Research):');
    if (!name || !name.trim()) return;
    const colors = ['#38bdf8', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e'];
    const icons = ['📁', '🐍', '⚡', '📊', '📚', '🎯'];
    const newSec: HubSection = {
      id: 'sec-' + Date.now(),
      name: name.trim(),
      color: colors[Math.floor(Math.random() * colors.length)],
      icon: icons[Math.floor(Math.random() * icons.length)],
    };
    setSections([...sections, newSec]);
    setActiveSectionId(newSec.id);
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    selectedFiles.forEach((file) => {
      const isPdf = file.name.endsWith('.pdf') || file.type === 'application/pdf';
      const isPpt = file.name.endsWith('.ppt') || file.name.endsWith('.pptx');
      const isImg = file.type.startsWith('image/');
      const isCode =
        file.name.endsWith('.py') ||
        file.name.endsWith('.js') ||
        file.name.endsWith('.ts') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.md');
      const fileType = isPdf ? 'pdf' : isPpt ? 'ppt' : isImg ? 'image' : isCode ? 'code' : 'doc';

      const reader = new FileReader();
      if (isCode) {
        reader.onload = (ev) => {
          const item: HubFileItem = {
            id: 'file-' + Date.now() + Math.random().toString(36).slice(2, 6),
            sectionId: activeSectionId,
            name: file.name,
            type: 'code',
            sizeStr: (file.size / 1024).toFixed(1) + ' KB',
            content: ev.target?.result as string,
            dateAdded: Date.now(),
          };
          setFiles((prev) => [item, ...prev]);
        };
        reader.readAsText(file);
      } else {
        reader.onload = (ev) => {
          const item: HubFileItem = {
            id: 'file-' + Date.now() + Math.random().toString(36).slice(2, 6),
            sectionId: activeSectionId,
            name: file.name,
            type: fileType,
            sizeStr: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
            dataUrl: ev.target?.result as string,
            dateAdded: Date.now(),
          };
          setFiles((prev) => [item, ...prev]);
        };
        reader.readAsDataURL(file);
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddPath = () => {
    if (!pathInput.trim()) return;
    const name =
      pathNameInput.trim() ||
      pathInput.split('\\').pop()?.split('/').pop() ||
      'Resource';
    const isPdf = pathInput.toLowerCase().endsWith('.pdf');
    const isPpt =
      pathInput.toLowerCase().endsWith('.ppt') ||
      pathInput.toLowerCase().endsWith('.pptx');
    const isImg =
      pathInput.toLowerCase().endsWith('.png') ||
      pathInput.toLowerCase().endsWith('.jpg');

    const item: HubFileItem = {
      id: 'path-' + Date.now(),
      sectionId: activeSectionId,
      name,
      type: isPdf ? 'pdf' : isPpt ? 'ppt' : isImg ? 'image' : 'path',
      localPath: pathInput.trim(),
      sizeStr: 'Local Path',
      dateAdded: Date.now(),
    };

    setFiles((prev) => [item, ...prev]);
    setPathInput('');
    setPathNameInput('');
    setAddPathModalOpen(false);
    showToast(`Linked ${name} to ${activeSection?.name}`);
  };

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete resource from section?')) return;
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (previewItem?.id === id) setPreviewItem(null);
  };

  const handleOpenInDeviceDefault = (item: HubFileItem) => {
    if (item.dataUrl) {
      const win = window.open();
      if (win) {
        win.document.write(
          `<iframe src="${item.dataUrl}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
        );
      }
    } else if (item.localPath) {
      const formatted = 'file:///' + item.localPath.replace(/\\/g, '/');
      window.open(formatted, '_blank');
      navigator.clipboard?.writeText(item.localPath);
      showToast(`Opening ${item.name} & copied path!`);
    }
  };

  const filtered = files
    .filter((f) => f.sectionId === activeSectionId)
    .filter((f) => (typeFilter === 'all' ? true : f.type === typeFilter))
    .filter((f) => !searchQuery.trim() || f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-9.5rem)] max-w-5xl mx-auto w-full">
      {toast && (
        <div className="absolute top-2 right-4 z-50 p-2.5 rounded-xl bg-zinc-900 border border-white/20 text-xs text-white shadow-xl backdrop-blur-xl">
          {toast}
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelected}
        multiple
        className="hidden"
        accept=".pdf,.ppt,.pptx,.png,.jpg,.jpeg,.py,.txt,.md"
      />

      {/* Sections Tab Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3 gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {sections.map((sec) => {
            const isSelected = sec.id === activeSectionId;
            const count = files.filter((f) => f.sectionId === sec.id).length;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSectionId(sec.id)}
                style={{ borderColor: isSelected ? sec.color : 'transparent' }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-white/15 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300">
                  {count}
                </span>
              </button>
            );
          })}
          <button
            onClick={handleAddSection}
            className="px-2.5 py-1.5 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-white text-xs hover:border-white/40 transition-colors flex items-center gap-1"
            title="Add Section"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Section</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setAddPathModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 border border-white/15 text-slate-300 hover:text-white text-xs font-medium hover:border-white/30 transition-all shadow"
            title="Link local path"
          >
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Link Local Path</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-sky-400 text-zinc-950 font-bold text-xs hover:bg-sky-300 transition-all shadow"
            title="Add local file"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Add PDF / PPT / File</span>
          </button>
        </div>
      </div>

      {/* Type Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2.5 mb-3 text-xs">
        <div className="inline-flex rounded-xl bg-white/5 p-0.5 border border-white/10">
          {[
            { id: 'all', label: 'All' },
            { id: 'pdf', label: 'PDFs' },
            { id: 'ppt', label: 'PPT Slides' },
            { id: 'image', label: 'Images' },
            { id: 'code', label: 'Scripts / Code' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              className={`px-3 py-1 rounded-lg capitalize transition-all ${
                typeFilter === t.id
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search in ${activeSection?.name}...`}
          className="bg-white/5 border border-white/10 rounded-xl px-3 py-1 text-xs text-white placeholder-slate-500 w-44 sm:w-56 focus:outline-none"
        />
      </div>

      {/* Files Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-white">No files in {activeSection?.name}</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add local PDFs, PowerPoint presentations, or Python scripts to view them in-app or open
              in your device's default app.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((file) => (
              <div
                key={file.id}
                onClick={() => setPreviewItem(file)}
                className="group relative p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/25 transition-all cursor-pointer backdrop-blur-md flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                        file.type === 'pdf'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800/80'
                          : file.type === 'ppt'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800/80'
                          : file.type === 'image'
                          ? 'bg-purple-950/80 text-purple-300 border-purple-800/80'
                          : file.type === 'code'
                          ? 'bg-sky-950/80 text-sky-300 border-sky-800/80'
                          : 'bg-white/10 text-slate-300 border-white/10'
                      }`}
                    >
                      {file.type === 'pdf' && 'PDF Document'}
                      {file.type === 'ppt' && 'PowerPoint Presentation'}
                      {file.type === 'image' && 'Image / PNG'}
                      {file.type === 'code' && 'Python / Code'}
                      {file.type === 'path' && 'Linked Path'}
                    </span>

                    <button
                      onClick={(e) => handleDelete(file.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-1 text-slate-500 transition-opacity"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-xs font-semibold text-white tracking-tight truncate group-hover:text-sky-400 transition-colors">
                    {file.name}
                  </h4>

                  {file.localPath && (
                    <p className="text-[10px] font-mono text-slate-400 truncate mt-1">
                      {file.localPath}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-2 mt-3 text-[10px] font-mono text-slate-400">
                  <span>{file.sizeStr || 'Local'}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenInDeviceDefault(file);
                      }}
                      className="flex items-center gap-1 hover:text-white text-sky-400"
                      title="Open in Device Default Application"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Device App</span>
                    </button>
                    <span className="text-white flex items-center gap-0.5">View</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Viewer Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col p-4 sm:p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2 truncate">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-sky-400">
                {previewItem.type.toUpperCase()}
              </span>
              <h3 className="text-sm font-semibold text-white truncate">{previewItem.name}</h3>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => handleOpenInDeviceDefault(previewItem)}
                className="px-3 py-1.5 rounded-xl bg-sky-400 text-zinc-950 font-bold text-xs hover:bg-sky-300 flex items-center gap-1.5 shadow"
                title="Open with your computer's default application"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Device App</span>
              </button>

              <button
                onClick={() => setPreviewItem(null)}
                className="px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex-1 max-w-5xl mx-auto w-full overflow-hidden flex flex-col rounded-2xl bg-zinc-950 border border-white/10 p-3">
            {previewItem.type === 'pdf' && (
              <div className="flex-1 flex flex-col h-full w-full">
                {previewItem.dataUrl ? (
                  <embed
                    src={previewItem.dataUrl}
                    type="application/pdf"
                    className="w-full h-full rounded-xl border border-white/10"
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <FileText className="w-14 h-14 text-rose-400" />
                    <h4 className="text-base font-semibold text-white">{previewItem.name}</h4>
                    <p className="text-xs font-mono text-slate-400">{previewItem.localPath}</p>
                    <button
                      onClick={() => handleOpenInDeviceDefault(previewItem)}
                      className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-bold text-xs"
                    >
                      Launch in Device PDF Viewer
                    </button>
                  </div>
                )}
              </div>
            )}

            {previewItem.type === 'ppt' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-950 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Tv className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{previewItem.name}</h4>
                  <p className="text-xs text-slate-400 font-mono mt-1">
                    PowerPoint Presentation • {previewItem.sizeStr}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenInDeviceDefault(previewItem)}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 flex items-center gap-2 shadow-lg"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in PowerPoint / Device Viewer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
