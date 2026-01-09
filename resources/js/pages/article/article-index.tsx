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

import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';

import { Pencil, Plus, Trash2 } from 'lucide-react';

import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import InputError from '../../components/input-error';
import { Input } from '../../components/ui/input';
import { Article } from '../../types';

export default function ArticleIndex() {
    const [paginationData, setPaginationData] = useState<Article[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(
        null,
    );

    // Add form
    const { data, setData, errors, setError, clearErrors } = useForm({
        article_name: '',
    });

    // Edit form
    const {
        data: editData,
        setData: setEditData,
        errors: editErrors,
        setError: setEditError,
        clearErrors: clearEditErrors,
    } = useForm({
        article_name: '',
    });

    // Fetch articles with pagination and optional search
    const fetchData = async (page: number = 1, search: string = '') => {
        try {
            const response = await fetch(
                `/articles-table/data?page=${page}&search=${search}`,
            );
            const data = await response.json();

            setPaginationData(data.data);
            setCurrentPage(data.current_page);
            setLastPage(data.last_page);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    };

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch data whenever page or debounced search changes
    useEffect(() => {
        fetchData(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch]);

    // Add new article
    const handleAddArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        clearErrors();

        try {
            const res = await axios.post('/article/create', {
                article_name: data.article_name,
            });
            await fetchData(1, debouncedSearch);

            setData({ article_name: '' });

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

    // Open edit modal and load selected article
    const handleUpdateArticle = (id: number) => {
        const record = paginationData.find((d) => d.id === id);
        if (!record) return;

        setSelectedArticle(record);
        setEditData({ article_name: record.article_name });
        clearEditErrors();
        setIsEditDialogOpen(true);
    };

    // Submit edited article
    const submitUpdateArticle = async () => {
        if (!selectedArticle) return;

        try {
            const res = await axios.put(
                `/article/update/${selectedArticle.id}`,
                editData,
            );
            await fetchData(currentPage, debouncedSearch);

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: res.data.message,
                showConfirmButton: false,
                timer: 1500,
            });

            setIsEditDialogOpen(false);
            setSelectedArticle(null);
        } catch (err: any) {
            setEditError(err.response.data.errors);
        }
    };

    // Delete article
    const handleDeleteArticle = (id: number) => {
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
                    const res = await axios.delete(`/article/remove/${id}`);
                    await fetchData(currentPage, debouncedSearch);

                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: res.data.message,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                } catch (err) {
                    console.error('Error deleting article:', err);
                }
            }
        });
    };

    return (
        <div className="h-full overflow-y-auto px-4 pb-4">
            {/* Header + Add + Search */}
            <div className="sticky top-0 z-20 bg-background pt-4 pb-2">
                <h1 className="mb-2 text-xl font-bold tracking-wide uppercase">
                    Article/Ordered
                </h1>
                <div className="flex gap-4">
                    {/* Search */}
                    <Input
                        type="text"
                        placeholder="Search by Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {/* Add Dialog */}
                    <Dialog>
                        <DialogTrigger className="flex items-center gap-2 rounded-lg bg-indigo-600 px-3 text-sm font-bold text-white hover:opacity-80">
                            <Plus /> Add
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Add New Article/Ordered
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddArticle}>
                                <Label className="text-md mt-4 mb-2 block text-sm">
                                    Article Name
                                </Label>
                                <Input
                                    type="text"
                                    placeholder="eg: ABC's Equipment"
                                    minLength={5}
                                    value={data.article_name}
                                    onChange={(e) =>
                                        setData({
                                            ...data,
                                            article_name: e.target.value,
                                        })
                                    }
                                />
                                <InputError
                                    message={errors.article_name}
                                    className="mt-2"
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

            {/* Articles Table */}
            <Table className="mt-2">
                <TableCaption>A list of Article/Ordered.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[90px]">No.</TableHead>
                        <TableHead>Article Name</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginationData.map((item, i) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                {(currentPage - 1) * 10 + i + 1}
                            </TableCell>
                            <TableCell className="capitalize">
                                {item.article_name}
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
                                                handleUpdateArticle(item.id)
                                            }
                                        >
                                            <Pencil /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() =>
                                                handleDeleteArticle(item.id)
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

            {/* Pagination */}
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
                        <DialogTitle>Edit Article/Ordered</DialogTitle>
                    </DialogHeader>
                    {selectedArticle && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                submitUpdateArticle();
                            }}
                        >
                            <Label className="mt-4 mb-2 block text-sm">
                                Article Name
                            </Label>
                            <Input
                                type="text"
                                placeholder="eg: ABC's Equipment"
                                value={editData.article_name}
                                onChange={(e) =>
                                    setEditData({
                                        ...editData,
                                        article_name: e.target.value,
                                    })
                                }
                            />
                            <InputError
                                className="mt-1"
                                message={editErrors.article_name}
                            />

                            <div className="mt-8 flex flex-col-reverse gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                        setIsEditDialogOpen(false);
                                        setSelectedArticle(null);
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
