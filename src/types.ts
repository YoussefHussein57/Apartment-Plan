export type Section = 'finishing' | 'furniture' | 'appliances';
export type Status = 'not_started' | 'in_progress' | 'done';
export type Priority = 'low' | 'medium' | 'high';

export const SECTION_LABELS: Record<Section, string> = {
  finishing: 'التشطيب',
  furniture: 'العفش',
  appliances: 'الأجهزة الكهربائية',
};

export const STATUS_LABELS: Record<Status, string> = {
  not_started: 'لم يبدأ',
  in_progress: 'جاري',
  done: 'تم',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'منخفضة',
  medium: 'متوسطة',
  high: 'عالية',
};

export interface ItemTotals {
  id: string;
  section: Section;
  name: string;
  budget: number;
  total_cost: number | null;
  status: Status;
  priority: Priority;
  start_date: string | null;
  end_date: string | null;
  purchase_date: string | null;
  notes: string | null;
  sort_order: number;
  paid: number;
  remaining: number;
  progress: number;
}

export interface Payment {
  id: string;
  item_id: string | null;
  date: string;
  amount: number;
  method: string | null;
  notes: string | null;
}

export interface SectionTotal {
  section: Section;
  budget: number;
  paid: number;
  remaining: number;
}

export interface Settings {
  id: number;
  salary: number;
  living_expense: number;
  gam3eya1_installment: number;
  gam3eya1_end_date: string | null;
  gam3eya2_installment: number;
  gam3eya2_end_date: string | null;
  sept_lumpsum: number;
  sept_month: string | null;
  nov_lumpsum: number;
  nov_month: string | null;
  furniture_share_pct: number;
  plan_start_date: string | null;
  saved_cash: number;
  gold_grams_21k: number;
  gold_grams_24k: number;
  usd_amount: number;
  eur_amount: number;
}
