export interface Profile {
  id: string;
  username: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  phone?: string | null;
  role: "admin" | "moderator" | "user";
  is_vip: boolean;
  is_restricted: boolean;
  is_banned: boolean;
  is_frozen: boolean;
  profile_picture?: string | null;
  total_paid: number;
  active_slots: number;
  dob?: string | null;
  state_of_origin?: string | null;
  lga?: string | null;
  current_state?: string | null;
  current_address?: string | null;
  home_address?: string | null;
  bvn_nin?: string | null;
  nickname?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  account_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string | null;
  contribution_amount: number;
  cycle_type: "daily" | "weekly" | "monthly";
  total_slots: number;
  filled_slots: number;
  is_live: boolean;
  is_locked: boolean;
  chat_locked: boolean;
  payout_account?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  account_name?: string | null;
  terms_text?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Slot {
  id: number;
  group_id: string;
  user_id?: string | null;
  slot_number: number;
  status: "available" | "locked" | "taken";
  is_disbursed: boolean;
  disbursed_at?: string | null;
  created_at: string;
  profile?: Profile;
}

export interface Transaction {
  id: string;
  code: string;
  group_id: string;
  user_id: string;
  amount: number;
  status: "pending" | "approved" | "declined";
  screenshot_url?: string | null;
  seat_no?: number | null;
  admin_note?: string | null;
  created_at: string;
  updated_at: string;
  group?: Group;
  profile?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: "announcement" | "promotion" | "server-update" | "group-message";
  image_url?: string | null;
  target_group_id?: string | null;
  admin_name?: string | null;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  status: "open" | "replied" | "closed";
  admin_reply?: string | null;
  replied_at?: string | null;
  created_at: string;
  profile?: Profile;
}

export interface ContactInfo {
  id: number;
  whatsapp?: string | null;
  facebook?: string | null;
  email?: string | null;
  call_number?: string | null;
  sms_number?: string | null;
  updated_at: string;
}

export interface Settings {
  key: string;
  value: unknown;
  updated_at: string;
}
