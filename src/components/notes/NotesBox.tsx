import React, { useState, useMemo, useRef } from 'react';
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Search,
  Check,
  CheckSquare,
  Highlighter,
  ChevronLeft,
} from 'lucide-react';
import { OneNoteSection, OneNoteItem } from '../../types';

interface NotesBoxProps {
  sections: OneNoteSection[];
  setSections: React.Dispatch<React.SetStateAction<OneNoteSection[]>>;
  notes: OneNoteItem[];
  setNotes: React.Dispatch<React.SetStateAction<OneNoteItem[]>>;
}

export const NotesBox: React.FC<NotesBoxProps> = ({
  sections,
  setSections,
  notes,
  setNotes,
}) => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(sections[0]?.id || '');
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabMode, setActiveTabMode] = useState<'edit' | 'preview'>('edit');
  const [mobilePane, setMobilePane] = useState<'notes' | 'editor'>('notes');
  const fileRef = useRef<HTMLInputElement | null>(null);
  const editorTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const currentSectionNotes = useMemo(() => {
    return notes
      .filter((n) => n.sectionId === selectedSectionId)
      .filter(
        (n) =>
          !searchQuery.trim() ||
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [notes, selectedSectionId, searchQuery]);

  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === selectedNoteId) || currentSectionNotes[0] || null;
  }, [notes, selectedNoteId, currentSectionNotes]);

  const handleCreateSection = () => {
    const name = prompt('Enter new OneNote section name:');
    if (!name || !name.trim()) return;
    const colors = ['#8b5cf6', '#38bdf8', '#10b981', '#f59e0b', '#f43f5e'];
    const icons = ['🟣', '🔵', '🟢', '🟡', '🔴'];
    const randIdx = Math.floor(Math.random() * colors.length);
    const newSec: OneNoteSection = {
      id: 'sec-' + Date.now(),
      name: name.trim(),
      color: colors[randIdx],
      icon: icons[randIdx],
    };
    setSections([...sections, newSec]);
    setSelectedSectionId(newSec.id);
  };

  const handleCreateNote = () => {
    const newNote: OneNoteItem = {
      id: 'n-' + Date.now(),
      sectionId: selectedSectionId,
      title: 'Untitled Note',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNoteId(newNote.id);
    setMobilePane('editor');
  };

  const handleUpdateNote = (field: 'title' | 'content', val: string) => {
    if (!activeNote) return;
    setNotes(
      notes.map((n) =>
        n.id === activeNote.id ? { ...n, [field]: val, updatedAt: Date.now() } : n
      )
    );
  };

  const handleDeleteNote = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Delete this page permanently?')) return;
    const rem = notes.filter((n) => n.id !== id);
    setNotes(rem);
    if (selectedNoteId === id && rem.length > 0) setSelectedNoteId(rem[0].id);
  };

  const insertFormatting = (prefix: string, suffix = '') => {
    const textarea = editorTextareaRef.current;
    if (!textarea || !activeNote) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = activeNote.content || '';
    const selectedText = text.substring(start, end);
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;
    const newContent = text.substring(0, start) + replacement + text.substring(end);
    handleUpdateNote('content', newContent);
  };

  const toggleChecklistLine = (lineIndex: number) => {
    if (!activeNote) return;
    const lines = (activeNote.content || '').split('\n');
    const target = lines[lineIndex];
    if (target.includes('- [ ] ')) {
      lines[lineIndex] = target.replace('- [ ] ', '- [x] ');
    } else if (target.includes('- [x] ')) {
      lines[lineIndex] = target.replace('- [x] ', '- [ ] ');
    }
    handleUpdateNote('content', lines.join('\n'));
  };

  const handleExportMD = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'note'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = activeNote?.content ? activeNote.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = activeNote?.content?.length || 0;
  const currentSec = sections.find((s) => s.id === selectedSectionId) || sections[0];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-9.5rem)] max-w-5xl mx-auto w-full">
      {/* OneNote Color-Coded Section Tabs Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 overflow-x-auto no-scrollbar gap-1.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {sections.map((sec) => {
            const isSelected = sec.id === selectedSectionId;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setSelectedSectionId(sec.id);
                  setMobilePane('notes');
                }}
                style={{ borderColor: isSelected ? sec.color : 'transparent' }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'bg-zinc-900/50 text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <span>{sec.icon}</span>
                <span>{sec.name}</span>
                <span className="text-[10px] font-mono px-1 rounded-full bg-white/10 text-slate-400">
                  {notes.filter((n) => n.sectionId === sec.id).length}
                </span>
              </button>
            );
          })}
          <button
            onClick={handleCreateSection}
            className="px-2 py-1.5 rounded-xl border border-dashed border-white/20 text-slate-400 hover:text-white text-xs hover:border-white/40 transition-colors flex items-center gap-1"
            title="Create Section"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Section</span>
          </button>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCreateNote}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition-colors shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Page</span>
          </button>
        </div>
      </div>

      {/* OneNote 2-Pane Split */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-3 overflow-hidden">
        {/* Pages Column */}
        <div
          className={`md:col-span-4 flex flex-col space-y-2 overflow-hidden border-r border-white/10 pr-2 ${
            mobilePane === 'editor' ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter pages..."
              className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {currentSectionNotes.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-white/10 rounded-xl">
                No pages in this section. Click "+ New Page" above.
              </div>
            ) : (
              currentSectionNotes.map((note) => {
                const isSelected = activeNote?.id === note.id;
                return (
                  <div
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setMobilePane('editor');
                    }}
                    className={`group p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-zinc-800 border-white/20 text-white shadow-sm'
                        : 'bg-zinc-900/40 border-white/5 hover:border-white/15 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span className="truncate flex-1">{note.title || 'Untitled Note'}</span>
                      <button
                        onClick={(e) => handleDeleteNote(note.id, e)}
                        className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 transition-opacity"
                        title="Delete page"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-1">
                      {note.content ? note.content.slice(0, 70) : 'Blank page'}
                    </p>
                    <span className="text-[9px] font-mono text-slate-600 block mt-1.5">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Canvas */}
        <div
          className={`md:col-span-8 flex flex-col overflow-hidden bg-zinc-900/40 rounded-2xl border border-white/10 p-3.5 ${
            mobilePane !== 'editor' ? 'hidden md:flex' : 'flex'
          }`}
        >
          {activeNote ? (
            <>
              {/* OneNote Toolbar */}
              <div className="flex flex-wrap items-center justify-between border-b border-white/10 pb-2 mb-2 gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setMobilePane('notes')}
                    className="md:hidden text-xs text-slate-400 hover:text-white mr-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => insertFormatting('**', '**')}
                    title="Bold"
                    className="px-2 py-1 text-xs font-bold rounded hover:bg-white/10 text-slate-300"
                  >
                    B
                  </button>
                  <button
                    onClick={() => insertFormatting('*', '*')}
                    title="Italic"
                    className="px-2 py-1 text-xs italic rounded hover:bg-white/10 text-slate-300"
                  >
                    I
                  </button>
                  <button
                    onClick={() => insertFormatting('### ')}
                    title="Heading"
                    className="px-2 py-1 text-xs font-mono rounded hover:bg-white/10 text-slate-300"
                  >
                    H
                  </button>
                  <button
                    onClick={() => insertFormatting('==', '==')}
                    title="OneNote Highlight"
                    className="px-2 py-1 text-xs rounded hover:bg-white/10 text-amber-300 font-bold"
                  >
                    Highlight
                  </button>
                  <button
                    onClick={() => insertFormatting('- [ ] ')}
                    title="To-Do Checkbox"
                    className="px-2 py-1 text-xs rounded hover:bg-white/10 text-emerald-400 font-mono flex items-center gap-1"
                  >
                    <CheckSquare className="w-3 h-3" />
                    <span>Checklist</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg bg-zinc-950 p-0.5 border border-white/10 text-xs">
                    <button
                      onClick={() => setActiveTabMode('edit')}
                      className={`px-2.5 py-0.5 rounded ${
                        activeTabMode === 'edit'
                          ? 'bg-white/15 text-white font-medium'
                          : 'text-slate-400'
                      }`}
                    >
                      Write
                    </button>
                    <button
                      onClick={() => setActiveTabMode('preview')}
                      className={`px-2.5 py-0.5 rounded ${
                        activeTabMode === 'preview'
                          ? 'bg-white/15 text-white font-medium'
                          : 'text-slate-400'
                      }`}
                    >
                      Preview
                    </button>
                  </div>

                  <button
                    onClick={handleExportMD}
                    title="Export as Markdown (.md)"
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateNote('title', e.target.value)}
                placeholder="Page Title"
                className="w-full bg-transparent border-none text-lg font-bold text-white placeholder-slate-600 focus:outline-none mb-2"
              />

              {/* Body */}
              <div className="flex-1 overflow-y-auto">
                {activeTabMode === 'edit' ? (
                  <textarea
                    ref={editorTextareaRef}
                    value={activeNote.content}
                    onChange={(e) => handleUpdateNote('content', e.target.value)}
                    placeholder="Write your notes. Use OneNote checklists like - [ ] Task item, or ==highlighted text==..."
                    className="w-full h-full bg-transparent resize-none border-none text-xs text-slate-200 font-mono leading-relaxed focus:outline-none"
                  />
                ) : (
                  <div className="text-xs text-slate-200 space-y-2 font-sans leading-relaxed">
                    {(activeNote.content || '').split('\n').map((line, idx) => {
                      if (line.startsWith('# '))
                        return <h1 key={idx} className="text-lg font-bold text-white mt-3 mb-1">{line.slice(2)}</h1>;
                      if (line.startsWith('## '))
                        return <h2 key={idx} className="text-base font-semibold text-white mt-2 mb-1">{line.slice(3)}</h2>;
                      if (line.startsWith('### '))
                        return <h3 key={idx} className="text-sm font-semibold text-sky-400 mt-2 mb-1">{line.slice(4)}</h3>;
                      if (line.startsWith('> '))
                        return <blockquote key={idx} className="border-l-2 border-purple-500 pl-3 py-1 italic text-slate-400 my-1">{line.slice(2)}</blockquote>;
                      if (line.startsWith('- [ ] ') || line.startsWith('- [x] ')) {
                        const checked = line.startsWith('- [x] ');
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleChecklistLine(idx)}
                            className="flex items-center gap-2 cursor-pointer hover:text-white my-1 select-none"
                          >
                            <span
                              className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] ${
                                checked
                                  ? 'bg-emerald-500 border-emerald-500 text-zinc-950 font-bold'
                                  : 'border-white/20 bg-zinc-950'
                              }`}
                            >
                              {checked && '✓'}
                            </span>
                            <span className={checked ? 'line-through text-slate-500' : 'text-slate-200'}>
                              {line.slice(6)}
                            </span>
                          </div>
                        );
                      }
                      if (line.trim() === '') return <div key={idx} className="h-2" />;
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>
                )}
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-2 text-[10px] font-mono text-slate-400">
                <span>Words: {wordCount} | Chars: {charCount}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  100% Offline LocalStorage
                </span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
              Select or create a page in {currentSec?.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
