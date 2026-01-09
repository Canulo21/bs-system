import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ModeOfProcurement {
    id: number;
    mode_name: string;
    mode_abbreviation: string;
}

export interface Article {
    id: number;
    article_name: string;
}

export interface Supplier {
    id: number;
    supplier_name: string;
}

export interface PurchaseDetail {
    id: number;
    mode_id: number;
    purchase_number: string;
    purchase_date: string;
    purchase_date_issued: string;
    supplier_id: number;
    article_id: number;
    purchase_amount: number;

    mode_id?: ModeOfProcurement;
    mode?: {
        mode_name: string;
        mode_abbreviation: string;
    };

    supplier_id?: Supplier;
    supplier?: {
        supplier_name: string;
    };

    article_id?: Article;
    article?: {
        article_name: string;
    };
}
