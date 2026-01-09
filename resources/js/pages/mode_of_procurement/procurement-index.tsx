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

    const { data, setData, errors, setError, clearErrors } = useForm({
        mode_name: '',
        mode_abbreviation: '',
    });

    const fetchData = async () => {
        try {
            const response = await fetch('/mode-of-procurement-table');
            const data = await response.json();
            setDatas(data.data);
        } catch (error) {
            console.error('Error fetching mode of procurement:', error);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        fetchData();
    }, []);

    const handleAddModeOfProcurement = async (e: React.FormEvent) => {
        e.preventDefault();

        setError({
            mode_name: '',
            mode_abbreviation: '',
        });

        const payload = {
            mode_name: data.mode_name,
            mode_abbreviation: data.mode_abbreviation,
        };

        try {
            const res = await axios.post(
                '/mode-of-procurement/create',
                payload,
            );
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

            clearErrors();
        } catch (err: any) {
            setError(err.response.data.errors);
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
                    <Input type="text" placeholder="Search by Name" />
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
                                <Label className="text-md mt-4 mb-2 block text-sm">
                                    Mode of Procurement Name
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="eg: Direct Contracting"
                                    minLength={5}
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

                                <Label className="text-md mt-4 mb-2 block text-sm">
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
                        <TableHead className="w-[50px]">No.</TableHead>
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
                                        <DropdownMenuItem>
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
        </div>
    );
}
