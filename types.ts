
export type Tool = 'pencil' | 'eraser';

export interface CanvasState {
  brushColor: string;
  brushSize: number;
  tool: Tool;
}

export interface GenerationResult {
  imageUrl: string;
  timestamp: number;
}

export interface SavedMockup {
  id: string;
  sketchUrl: string;
  resultUrl: string;
  prompt: string;
  timestamp: number;
}
