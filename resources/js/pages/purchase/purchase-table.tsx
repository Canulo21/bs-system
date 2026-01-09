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

import axios from 'axios';
import { ArrowUpDown, Download, Pencil, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import InputError from '../../components/input-error';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { PurchaseDetail } from '../../types';

export default function PurchaseTable() {
    const [paginationData, setPaginationData] = useState<PurchaseDetail[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

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
                            <form>
                                <div>
                                    <div className="flex gap-4">
                                        <div className="w-1/2">
                                            <Label className="text-md mt-4 mb-2 block text-sm">
                                                M.O.P
                                            </Label>
                                            <Select>
                                                <SelectTrigger className="w-full uppercase">
                                                    <SelectValue placeholder="M.O.P" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            M.O.P
                                                        </SelectLabel>
                                                        <SelectItem
                                                            value="dc"
                                                            className="uppercase"
                                                        >
                                                            dc
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="pb"
                                                            className="uppercase"
                                                        >
                                                            pb
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-1/2">
                                            <Label className="text-md mt-4 mb-2 block text-sm">
                                                P.O No.
                                            </Label>
                                            <Input
                                                type="text"
                                                placeholder="P.O No."
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
                                            />
                                        </div>
                                        <div className="w-1/2">
                                            <Label className="text-md mt-4 mb-2 block text-sm">
                                                Date Issued
                                            </Label>
                                            <Input
                                                type="date"
                                                placeholder="date"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-4">
                                        <div className="w-full">
                                            <Label className="text-md mt-4 mb-2 block text-sm">
                                                Supplier Name
                                            </Label>
                                            <Select>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder="Supplier Name" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Supplier Name
                                                        </SelectLabel>
                                                        <SelectItem
                                                            value="FJ-JD Trading"
                                                            className="capitalize"
                                                        >
                                                            FJ-JD Trading
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="Variance Trading Corporation"
                                                            className="capitalize"
                                                        >
                                                            Variance Trading
                                                            Corporation
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-4">
                                        <div className="w-full">
                                            <Label className="text-md mt-4 mb-2 block text-sm">
                                                Article/Ordered
                                            </Label>
                                            <Select>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue placeholder="Article Name" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>
                                                            Article Name
                                                        </SelectLabel>
                                                        <SelectItem
                                                            value="Office Equipment"
                                                            className="capitalize"
                                                        >
                                                            Office Equipment
                                                        </SelectItem>
                                                        <SelectItem
                                                            value="Medical Equipment"
                                                            className="capitalize"
                                                        >
                                                            Medical Equipment
                                                        </SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
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
                                            />
                                        </div>
                                    </div>

                                    <InputError className="mt-2" />
                                    <Button
                                        variant="default"
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
                                        <DropdownMenuItem>
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
        </div>
    );
}
