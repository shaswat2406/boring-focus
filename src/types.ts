export type TabType = 'hub' | 'focus' | 'reels' | 'tasks';

export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category?: string;
  createdAt?: number;
}

export interface HubSection {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export type HubFileType = 'pdf' | 'ppt' | 'image' | 'code' | 'doc' | 'path';

export interface HubFileItem {
  id: string;
  sectionId: string;
  name: string;
  type: HubFileType;
  sizeStr?: string;
  dataUrl?: string; // Stored base64 / blob URL for in-app preview
  content?: string; // Text / code content for in-app syntax preview
  localPath?: string; // Direct path e.g. C:\Users\asus\Python\script.py or presentation.pptx
  dateAdded: number;
}

export interface ThemeConfig {
  id: string;
  name: string;
  bgClass: string;
  cardBg: string;
  cardBorder: string;
  accentColor: string;
  previewHex: string;
  meshGlow: string;
}
