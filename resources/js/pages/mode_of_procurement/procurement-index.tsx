import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import Swal from 'sweetalert2';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';

import { Pencil, Plus, Trash2 } from 'lucide-react';

import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import InputError from '../../components/input-error';
import { Input } from '../../components/ui/input';
import { ModeOfProcurement } from '../../types';

export default function ProcurementIndex() {
    const [datas, setDatas] = useState<ModeOfProcurement[]>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    const [selectedProcurement, setSelectedProcurement] =
        useState<ModeOfProcurement | null>(null);

    // Create form
    const { data, setData, errors, setError, clearErrors } = useForm({
        mode_name: '',
        mode_abbreviation: '',
    });

    // Edit form
    const {
        data: editData,
        setData: setEditData,
        errors: editErrors,
        setError: setEditError,
        clearErrors: clearEditErrors,
    } = useForm({
        mode_name: '',
        mode_abbreviation: '',
    });

    const fetchData = async (search: string = '') => {
        try {
            const response = await fetch(
                `/mode-of-procurement-table?search=${search}`,
            );
            const data = await response.json();
            setDatas(data.data);
        } catch (error) {
            console.error('Error fetching mode of procurement:', error);
        }
    };

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        fetchData(debouncedSearch);
    }, [debouncedSearch]);

    const handleAddModeOfProcurement = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        try {
            const res = await axios.post('/mode-of-procurement/create', data);
            await fetchData();

            setData({
                mode_name: '',
                mode_abbreviation: '',
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

    // CLICK EDIT → load data & open dialog
    const handleUpdateProcurement = (id: number) => {
        const record = datas.find((d) => d.id === id);
        if (!record) return;

        setSelectedProcurement(record);
        setEditData({
            mode_name: record.mode_name,
            mode_abbreviation: record.mode_abbreviation,
        });

        clearEditErrors();
        setIsEditDialogOpen(true);
    };

    // SUBMIT EDIT
    const submitUpdateProcurement = async () => {
        if (!selectedProcurement) return;

        try {
            const res = await axios.put(
                `/mode-of-procurement/update/${selectedProcurement.id}`,
                editData,
            );

            await fetchData();

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
            });

            setIsEditDialogOpen(false);
            setSelectedProcurement(null);
            clearEditErrors();
        } catch (err: any) {
            setEditError(err.response.data.errors);
        }
    };

    const handleDeleteProcurement = (id: number) => {
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
                        `/mode-of-procurement/remove/${id}`,
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
                    Mode of Procurement
                </h1>
                <div className="flex gap-4">
                    <Input
                        type="text"
                        placeholder="Search by Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Dialog>
                        <DialogTrigger className="flex items-center gap-2 rounded-lg bg-green-600 px-3 text-sm font-bold text-white hover:opacity-80">
                            <Plus /> Add
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Add New Mode Of Procurement
                                </DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleAddModeOfProcurement}>
                                <Label className="mt-4 mb-2 block text-sm">
                                    Mode of Procurement Name
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="eg: Direct Contracting"
                                    value={data.mode_name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            mode_name: e.target.value,
                                        })
                                    }
                                />
                                <InputError
                                    className="mt-1"
                                    message={errors.mode_name}
                                />

                                <Label className="mt-4 mb-2 block text-sm">
                                    Abbreviation
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="eg: DC"
                                    value={data.mode_abbreviation}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            mode_abbreviation: e.target.value,
                                        })
                                    }
                                />
                                <InputError
                                    className="mt-1"
                                    message={errors.mode_abbreviation}
                                />

                                <Button
                                    type="submit"
                                    variant="default"
                                    className="mt-8 w-full"
                                >
                                    Save
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Table className="mt-2">
                <TableCaption>A list of all Mode of Procurement.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[70px]">No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>ABBr</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {datas.map((data, i) => (
                        <TableRow key={i}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell className="capitalize">
                                {data.mode_name}
                            </TableCell>
                            <TableCell className="uppercase">
                                {data.mode_abbreviation}
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
                                                handleUpdateProcurement(data.id)
                                            }
                                        >
                                            <Pencil /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDeleteProcurement(data.id)
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

            {/* EDIT MODAL */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Mode of Procurement</DialogTitle>
                    </DialogHeader>

                    {selectedProcurement && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitUpdateProcurement();
                            }}
                        >
                            <Label className="mt-4 mb-2 block text-sm">
                                Mode of Procurement Name
                            </Label>
                            <Input
                                type="text"
                                placeholder="eg: Direct Contracting"
                                value={editData.mode_name}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        mode_name: e.target.value,
                                    })
                                }
                            />
                            <InputError
                                className="mt-1"
                                message={editErrors.mode_name}
                            />

                            <Label className="mt-4 mb-2 block text-sm">
                                Abbreviation
                            </Label>
                            <Input
                                type="text"
                                placeholder="eg: DC"
                                value={editData.mode_abbreviation}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        mode_abbreviation: e.target.value,
                                    })
                                }
                            />
                            <InputError
                                className="mt-1"
                                message={editErrors.mode_abbreviation}
                            />

                            <div className="mt-8 flex flex-col-reverse gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        setSelectedProcurement(null);
                                        clearEditErrors();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="default"
                                    className="w-full"
                                >
                                    Update
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
