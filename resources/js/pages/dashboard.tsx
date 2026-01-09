import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import ArticleIndex from './article/article-index';
import ProcurementIndex from './mode_of_procurement/procurement-index';
import PurchaseTable from './purchase/purchase-table';
import SupplierIndex from './supplier/supplier-index';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative h-80 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ProcurementIndex />
                    </div>
                    <div className="relative h-80 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <ArticleIndex />
                    </div>
                    <div className="relative h-80 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <SupplierIndex />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PurchaseTable />
                </div>
            </div>
        </AppLayout>
    );
}
