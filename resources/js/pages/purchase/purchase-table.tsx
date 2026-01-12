import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { useForm } from '@inertiajs/react';
import axios from 'axios';
import {
    ArrowUpDown,
    Download,
    Pencil,
    Plus,
    RefreshCcw,
    Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import InputError from '../../components/input-error';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    Article,
    ModeOfProcurement,
    PurchaseDetail,
    Supplier,
} from '../../types';

export default function PurchaseTable() {
    const [paginationData, setPaginationData] = useState<PurchaseDetail[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedPurchase, setSelectedPurchase] =
        useState<PurchaseDetail | null>(null);

    // ⭐ NEW: add filters state
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        category: 'created_at',
    });

    const [selectMOP, setSelectMOP] = useState<ModeOfProcurement[]>([]);
    const [selectArticles, setSelectArticles] = useState<Article[]>([]);
    const [selectSuppliers, setSelectSuppliers] = useState<Supplier[]>([]);

    // Add form
    const { data, setData, errors, setError, clearErrors } = useForm({
        mode_id: '',
        purchase_number: '',
        purchase_date: '',
        purchase_date_issued: '',
        supplier_id: '',
        article_id: '',
        purchase_amount: '',
    });

    // Edit form
    const {
        data: editData,
        setData: setEditData,
        errors: editErrors,
        setError: setEditError,
        clearErrors: clearEditErrors,
    } = useForm({
        mode_id: '',
        purchase_number: '',
        purchase_date: '',
        purchase_date_issued: '',
        supplier_id: '',
        article_id: '',
        purchase_amount: '',
    });

    const fetchSelectArticles = async () => {
        const response = await axios.get('/articles-select');
        setSelectArticles(response.data);
    };
    const fetchSelectMOP = async () => {
        const response = await axios.get('/mode-of-procurement-select');
        setSelectMOP(response.data);
    };
    const fetchSelectSuppliers = async () => {
        const response = await axios.get('/suppliers-select');
        setSelectSuppliers(response.data);
    };

    // ⭐ UPDATED: fetch table with filters
    const fetchData = async (page: number = 1) => {
        const query = new URLSearchParams({
            page: String(page),
            start_date: filters.start_date,
            end_date: filters.end_date,
            category: filters.category,
        });

        const response = await fetch(`/purchase-table/data?${query}`);
        const data = await response.json();

        setPaginationData(data.data);
        setCurrentPage(data.current_page);
        setLastPage(data.last_page);
    };

    useEffect(() => {
        fetchSelectArticles();
        fetchSelectMOP();
        fetchSelectSuppliers();
    }, []);

    // ⭐ NEW: Auto reload when filters change
    useEffect(() => {
        fetchData(1); // reset to page 1 when filtering
    }, [filters]);

    // ⭐ Keep existing pagination behavior
    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage]);

    const handleDeletePurchase = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await axios.delete(`/purchase-detail/remove/${id}`);
                await fetchData();
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: res.data.message,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
        });
    };

    const handleAddPurchaseDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        try {
            const res = await axios.post('/purchase-detail/create', data);
            await fetchData();

            setData({
                mode_id: '',
                purchase_number: '',
                purchase_date: '',
                purchase_date_issued: '',
                supplier_id: '',
                article_id: '',
                purchase_amount: '',
            });

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (err: any) {
            setError(err.response.data.errors);
        }
    };

    const handleUpdatePurchase = (id: number) => {
        const record = paginationData.find((d) => d.id === id);
        if (!record) return;

        setSelectedPurchase(record);
        setEditData({
            mode_id: String(record.mode_id),
            purchase_number: record.purchase_number ?? '',
            purchase_date: record.purchase_date ?? '',
            purchase_date_issued: record.purchase_date_issued ?? '',
            supplier_id: String(record.supplier_id),
            article_id: String(record.article_id),
            purchase_amount: String(record.purchase_amount),
        });
        clearEditErrors();
        setIsEditDialogOpen(true);
    };

    const submitUpdatePurchase = async () => {
        if (!selectedPurchase) return;

        try {
            const res = await axios.put(
                `/purchase-detail/update/${selectedPurchase.id}`,
                editData,
            );
            await fetchData(currentPage);

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
            });

            setIsEditDialogOpen(false);
            setSelectedPurchase(null);
        } catch (err: any) {
            setEditError(err.response.data.errors);
        }
    };

    return (
        <div className="h-full overflow-y-auto px-4 pb-4">
            <div className="sticky top-0 z-20 bg-background pt-4 pb-2">
                <h1 className="mb-10 text-xl font-bold tracking-wide uppercase">
                    Purchase Details Table
                </h1>
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h3 className="text-md mb-4 font-semibold">Filters</h3>
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-medium opacity-75">
                                    START DATE
                                </Label>
                                <Input
                                    type="date"
                                    className="mt-1 mb-2 w-[160px]"
                                    value={filters.start_date}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            start_date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-medium opacity-75">
                                    END DATE
                                </Label>
                                <Input
                                    type="date"
                                    className="mt-1 mb-2 w-[160px]"
                                    value={filters.end_date}
                                    onChange={(e) =>
                                        setFilters({
                                            ...filters,
                                            end_date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label className="text-xs font-medium opacity-75">
                                    Category
                                </Label>
                                <Select
                                    value={filters.category}
                                    onValueChange={(value) =>
                                        setFilters({
                                            ...filters,
                                            category: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="mt-1 w-[160px]">
                                        <ArrowUpDown />
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Category</SelectLabel>
                                            <SelectItem value="created_at">
                                                Date Created (default)
                                            </SelectItem>
                                            <SelectItem value="purchase_date">
                                                P.O Date
                                            </SelectItem>
                                            <SelectItem value="purchase_date_issued">
                                                Date Issued
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Button
                                    className="mt-6"
                                    onClick={() =>
                                        setFilters({
                                            start_date: '',
                                            end_date: '',
                                            category: 'created_at',
                                        })
                                    }
                                >
                                    <RefreshCcw />
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Dialog>
                            <DialogTrigger className="flex items-center gap-2 rounded-lg bg-pink-600 px-3 text-sm font-bold text-white hover:opacity-80">
                                <Plus /> Add
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Purchase</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddPurchaseDetails}>
                                    <div>
                                        <div className="flex gap-4">
                                            <div className="w-1/2">
                                                <Label className="text-md mt-4 mb-2 block text-sm">
                                                    M.O.P
                                                </Label>
                                                <Select
                                                    value={data.mode_id}
                                                    onValueChange={(value) =>
                                                        setData({
                                                            ...data,
                                                            mode_id: value,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-full uppercase">
                                                        <SelectValue placeholder="M.O.P" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                M.O.P
                                                            </SelectLabel>
                                                            {selectMOP.map(
                                                                (item) => (
                                                                    <SelectItem
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={String(
                                                                            item.id,
                                                                        )}
                                                                        className="capitalize"
                                                                    >
                                                                        {
                                                                            item.mode_abbreviation
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={errors.mode_id}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="w-1/2">
                                                <Label className="text-md mt-4 mb-2 block text-sm">
                                                    P.O No.
                                                </Label>
                                                <Input
                                                    type="text"
                                                    placeholder="P.O No."
                                                    value={data.purchase_number}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            purchase_number:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.purchase_number
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-4">
                                            <div className="w-1/2">
                                                <Label className="text-md mt-4 mb-2 block text-sm">
                                                    P.O Date
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={data.purchase_date}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            purchase_date:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.purchase_date
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="w-1/2">
                                                <Label className="text-md mt-4 mb-2 block text-sm">
                                                    Date Issued
                                                </Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        data.purchase_date_issued
                                                    }
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            purchase_date_issued:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.purchase_date_issued
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-4">
                                            <div className="w-full">
                                                <Label className="text-md mt-4 mb-2 block text-sm">
                                                    Supplier Name
                                                </Label>
                                                <Select
                                                    value={data.supplier_id}
                                                    onValueChange={(value) =>
                                                        setData({
                                                            ...data,
                                                            supplier_id: value,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-full capitalize">
                                                        <SelectValue placeholder="Supplier Name" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Supplier Name
                                                            </SelectLabel>
                                                            {selectSuppliers.map(
                                                                (item) => (
                                                                    <SelectItem
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={String(
                                                                            item.id,
                                                                        )}
                                                                        className="capitalize"
                                                                    >
                                                                        {
                                                                            item.supplier_name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={errors.supplier_id}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-4">
                                            <div className="w-full">
                                                <Label className="text-md mt-4 mb-2 block text-sm">
                                                    Article/Ordered
                                                </Label>
                                                <Select
                                                    value={data.article_id}
                                                    onValueChange={(value) =>
                                                        setData({
                                                            ...data,
                                                            article_id: value,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger className="w-full capitalize">
                                                        <SelectValue placeholder="Article Name" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>
                                                                Article Name
                                                            </SelectLabel>
                                                            {selectArticles.map(
                                                                (item) => (
                                                                    <SelectItem
                                                                        key={
                                                                            item.id
                                                                        }
                                                                        value={String(
                                                                            item.id,
                                                                        )}
                                                                        className="capitalize"
                                                                    >
                                                                        {
                                                                            item.article_name
                                                                        }
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                                <InputError
                                                    message={errors.article_id}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4 flex gap-4">
                                            <div className="w-full">
                                                <Label className="text-md mt-4 mb-2 block text-sm">
                                                    Amount (Php)
                                                </Label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    step="any"
                                                    placeholder="Amount"
                                                    value={data.purchase_amount}
                                                    onChange={(e) =>
                                                        setData({
                                                            ...data,
                                                            purchase_amount:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                <InputError
                                                    message={
                                                        errors.purchase_amount
                                                    }
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            variant="default"
                                            type="submit"
                                            className="mt-8 w-full"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Button className="bg-green-600 text-white hover:bg-green-800 hover:text-amber-100">
                            <Download className="mr-2" /> Export PDF
                        </Button>
                    </div>
                </div>
            </div>

            <Table>
                <TableCaption>A list of purchase details.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[60px]">Sr No.</TableHead>
                        <TableHead>MOP</TableHead>
                        <TableHead>P.O. No.</TableHead>
                        <TableHead>P.O. Date</TableHead>
                        <TableHead>Date Issued</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Article/Ordered</TableHead>
                        <TableHead className="text-right">
                            Amount(PHP)
                        </TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginationData.map((data, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">
                                {(currentPage - 1) * 15 + i + 1}
                            </TableCell>
                            <TableCell className="font-bold tracking-widest uppercase italic">
                                {data.mode?.mode_abbreviation || 'N/A'}
                            </TableCell>
                            <TableCell>
                                {data.purchase_number || 'N/A'}
                            </TableCell>
                            <TableCell>{data.purchase_date || 'N/A'}</TableCell>
                            <TableCell>
                                {data.purchase_date_issued || 'N/A'}
                            </TableCell>
                            <TableCell className="text-md font-bold tracking-widest capitalize italic">
                                {data.supplier?.supplier_name || 'N/A'}
                            </TableCell>
                            <TableCell className="font-bold tracking-widest capitalize italic">
                                {data.article?.article_name || 'N/A'}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat('en-PH', {
                                    style: 'currency',
                                    currency: 'PHP',
                                }).format(data.purchase_amount) || 'N/A'}
                            </TableCell>
                            <TableCell className="text-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="font-bold tracking-widest">
                                        ...
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            Actions
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleUpdatePurchase(data.id)
                                            }
                                        >
                                            <Pencil /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDeletePurchase(data.id)
                                            }
                                        >
                                            <Trash2 /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {lastPage > 1 && (
                <div className="mt-5 flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                    >
                        Previous
                    </Button>
                    <span className="text-xs">
                        Page {currentPage} of {lastPage}
                    </span>
                    <Button
                        variant="outline"
                        disabled={currentPage === lastPage}
                        onClick={() => setCurrentPage(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}

            {/* EDIT DIALOG */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Purchase Details</DialogTitle>
                    </DialogHeader>
                    {selectedPurchase && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitUpdatePurchase();
                            }}
                        >
                            <div>
                                <div className="flex gap-4">
                                    <div className="w-1/2">
                                        <Label className="text-md mt-4 mb-2 block text-sm">
                                            M.O.P
                                        </Label>
                                        <Select
                                            value={editData.mode_id}
                                            onValueChange={(value) =>
                                                setEditData({
                                                    ...editData,
                                                    mode_id: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full uppercase">
                                                <SelectValue placeholder="M.O.P" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        M.O.P
                                                    </SelectLabel>
                                                    {selectMOP.map((item) => (
                                                        <SelectItem
                                                            key={item.id}
                                                            value={String(
                                                                item.id,
                                                            )}
                                                            className="capitalize"
                                                        >
                                                            {
                                                                item.mode_abbreviation
                                                            }
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={editErrors.mode_id}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <Label className="text-md mt-4 mb-2 block text-sm">
                                            P.O No.
                                        </Label>
                                        <Input
                                            type="text"
                                            value={editData.purchase_number}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    purchase_number:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                        <InputError
                                            message={editErrors.purchase_number}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-4">
                                    <div className="w-1/2">
                                        <Label className="text-md mt-4 mb-2 block text-sm">
                                            P.O Date
                                        </Label>
                                        <Input
                                            type="date"
                                            value={editData.purchase_date}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    purchase_date:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                        <InputError
                                            message={editErrors.purchase_date}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <Label className="text-md mt-4 mb-2 block text-sm">
                                            Date Issued
                                        </Label>
                                        <Input
                                            type="date"
                                            value={
                                                editData.purchase_date_issued
                                            }
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    purchase_date_issued:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                        <InputError
                                            message={
                                                editErrors.purchase_date_issued
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-4">
                                    <div className="w-full">
                                        <Label className="text-md mt-4 mb-2 block text-sm">
                                            Supplier Name
                                        </Label>
                                        <Select
                                            value={editData.supplier_id}
                                            onValueChange={(value) =>
                                                setEditData({
                                                    ...editData,
                                                    supplier_id: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full capitalize">
                                                <SelectValue placeholder="Supplier Name" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Supplier Name
                                                    </SelectLabel>
                                                    {selectSuppliers.map(
                                                        (item) => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={String(
                                                                    item.id,
                                                                )}
                                                                className="capitalize"
                                                            >
                                                                {
                                                                    item.supplier_name
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={editErrors.supplier_id}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-4">
                                    <div className="w-full">
                                        <Label className="text-md mt-4 mb-2 block text-sm">
                                            Article/Ordered
                                        </Label>
                                        <Select
                                            value={editData.article_id}
                                            onValueChange={(value) =>
                                                setEditData({
                                                    ...editData,
                                                    article_id: value,
                                                })
                                            }
                                        >
                                            <SelectTrigger className="w-full capitalize">
                                                <SelectValue placeholder="Article Name" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>
                                                        Article Name
                                                    </SelectLabel>
                                                    {selectArticles.map(
                                                        (item) => (
                                                            <SelectItem
                                                                key={item.id}
                                                                value={String(
                                                                    item.id,
                                                                )}
                                                                className="capitalize"
                                                            >
                                                                {
                                                                    item.article_name
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={editErrors.article_id}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <div className="mt-4 flex gap-4">
                                    <div className="w-full">
                                        <Label className="text-md mt-4 mb-2 block text-sm">
                                            Amount (Php)
                                        </Label>
                                        <Input
                                            type="number"
                                            min={0}
                                            step="any"
                                            value={editData.purchase_amount}
                                            onChange={(e) =>
                                                setEditData({
                                                    ...editData,
                                                    purchase_amount:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                        <InputError
                                            message={editErrors.purchase_amount}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>

                                <Button
                                    variant="default"
                                    type="submit"
                                    className="mt-8 w-full"
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
