/**
 * M-Ware Money TypeScript Definitions
 * Generated from Django models and serializers
 */

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export type TransactionType = 'INC' | 'EXP';

export interface Transaction {
    id: string;
    amount: number;
    transaction_type: TransactionType;
    category: string;
    payment_method: string;
    description: string | null;
    transaction_date: string; // ISO DateTime string
    created_at: string;
    updated_at: string;
}

export type DebtDirection = 'LENT' | 'BORROWED';
export type DebtStatus = 'PENDING' | 'PARTIAL' | 'SETTLED';

export interface Debt {
    id: string;
    person_name: string;
    amount: number;
    direction: DebtDirection;
    status: DebtStatus;
    due_date: string | null; // ISO Date string
    last_reminder_sent: string | null;
    created_at: string;
    updated_at: string;
}

export type WishlistPriority = 1 | 2 | 3 | 4 | 5;

export interface Wishlist {
    id: string;
    item_name: string;
    estimated_price: number;
    priority: WishlistPriority;
    url_link: string | null;
    cooling_off_until: string;
    is_purchased: boolean;
    is_cool: boolean; // SerializerMethodField
    created_at: string;
    updated_at: string;
}

export type BillFrequency = 'MON' | 'QUART' | 'YEAR';

export interface Bill {
    id: string;
    provider_name: string;
    amount: number;
    frequency: BillFrequency;
    due_day: number;
    is_autopay: boolean;
    last_paid_date: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Analytics Data Types
 */

export interface FinanceSummary {
    monthly_income: number;
    monthly_expense: number;
    net_flow: number;
    active_debt_total: number;
}

export interface CategoryBreakdown {
    category: string;
    total: number;
}

export interface DailyAllowance {
    daily_allowance: number;
    days_left_in_month: number;
}
