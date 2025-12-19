
export interface Director {
  id: number;
  name: string;
  tajriba_yili: number;
  tugilgan_yili: number;
}

export interface Play {
  id: number;
  title: string;
  janr: string;
  yil: number;
  rejissyor_id: number;
}

export interface Seat {
  id: number;
  qator: number;
  orin: number;
  narx: number;
}

export interface Ticket {
  id: number;
  spektakl_id: number;
  joy_id: number;
  xaridor: string;
  sana: string;
}

export type ViewType = 'dashboard' | 'directors' | 'plays' | 'seats' | 'tickets' | 'ai_assistant';
