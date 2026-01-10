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
import { ArrowUpDown, Download, Pencil, Plus, Trash2 } from 'lucide-react';
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

    // for Select Input Options

    const fetchSelectArticles = async () => {
        try {
            const response = await axios.get('/articles-select');
            const data = await response.data;
            setSelectArticles(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const fetchSelectMOP = async () => {
        try {
            const response = await axios.get('/mode-of-procurement-select');
            const data = await response.data;
            setSelectMOP(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    const fetchSelectSuppliers = async () => {
        try {
            const response = await axios.get('/suppliers-select');
            const data = await response.data;
            setSelectSuppliers(data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    // end of select input options

    const fetchData = async (page: number = 1) => {
        try {
            const response = await fetch(`/purchase-table/data?page=${page}`);
            const data = await response.json();

            // Set suppliers and pagination info
            setPaginationData(data.data);
            setCurrentPage(data.current_page);
            setLastPage(data.last_page);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    useEffect(() => {
        fetchData(currentPage);
        fetchSelectArticles();
        fetchSelectMOP();
        fetchSelectSuppliers();
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
                try {
                    const res = await axios.delete(
                        `/purchase-detail/remove/${id}`,
                    );
                    await fetchData();
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } catch (err) {
                    console.error('Error deleting procurement:', err);
                }
            }
        });
    };

    // Add new purchase details
    const handleAddPurchaseDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        try {
            console.log('Form Data:', data);

            const res = await axios.post('/purchase-detail/create', {
                mode_id: data.mode_id,
                purchase_number: data.purchase_number,
                purchase_date: data.purchase_date,
                purchase_date_issued: data.purchase_date_issued,
                supplier_id: data.supplier_id,
                article_id: data.article_id,
                purchase_amount: data.purchase_amount,
            });
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
        } catch (err) {
            setError(err.response.data.errors);
        }
    };

    // Open edit modal and load selected article
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

    // Submit edited article
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
                <h1 className="mb-2 text-xl font-bold tracking-wide uppercase">
                    Purchase Details Table
                </h1>
                <div className="flex justify-end gap-4">
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
                                                message={errors.purchase_number}
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
                                                placeholder="date"
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
                                                message={errors.purchase_date}
                                                className="mt-2"
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <Label className="text-md mt-4 mb-2 block text-sm">
                                                Date Issued
                                            </Label>
                                            <Input
                                                type="date"
                                                placeholder="date"
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
                                                message={errors.purchase_date}
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
                                                message={errors.purchase_amount}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                    <InputError className="mt-2" />
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

                    <Select>
                        <SelectTrigger className="w-[160px]">
                            <ArrowUpDown />
                            <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Filter</SelectLabel>
                                <SelectItem value="defualt">Defualt</SelectItem>
                                <SelectItem value="Purchase Order Date">
                                    P.O Date
                                </SelectItem>
                                <SelectItem value="date issued">
                                    Date Issued
                                </SelectItem>
                                <SelectItem value="Supplier">
                                    Supplier
                                </SelectItem>
                                <SelectItem value="Article/Ordered">
                                    Article/Ordered
                                </SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
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

            {/* Pagination Controls */}
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

            {/* Edit Dialog */}
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
                                            placeholder="P.O No."
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
                                            placeholder="date"
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
                                            placeholder="date"
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
                                            message={editErrors.purchase_date}
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
                                            placeholder="Amount"
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

                                <InputError className="mt-2" />
                                <Button
                                    variant="default"
                                    type="submit"
                                    className="mt-8 w-full"
                                >
                                    Save
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
