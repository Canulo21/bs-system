import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { PurchaseDetail } from '../../types';

export default function PurchaseTable() {
    const [datas, setDatas] = useState<PurchaseDetail[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/purchase-table');
                const getTable = response.data.data;
                setDatas(getTable);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="w-full p-4">
            <h1 className="mb-4 text-xl font-bold tracking-wide uppercase">
                Purchase Details Table
            </h1>
            <Table>
                <TableCaption>A list of purchase details.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Sr No.</TableHead>
                        <TableHead>MOP</TableHead>
                        <TableHead>P.O. No.</TableHead>
                        <TableHead>P.O. Date</TableHead>
                        <TableHead>Date Issued</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Article/Ordered</TableHead>
                        <TableHead className="text-right">
                            Amount(PHP)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {datas.map((data, i) => (
                        <TableRow key={i}>
                            <TableCell className="font-medium">
                                {i + 1}
                            </TableCell>
                            <TableCell className="font-bold tracking-widest italic">
                                {data.mode?.mode_abbreviation}
                            </TableCell>
                            <TableCell>{data.purchase_number}</TableCell>
                            <TableCell>{data.purchase_date}</TableCell>
                            <TableCell>{data.purchase_date_issued}</TableCell>
                            <TableCell className="text-md font-bold tracking-widest capitalize italic">
                                {data.supplier?.supplier_name}
                            </TableCell>
                            <TableCell className="font-bold tracking-widest capitalize italic">
                                {data.article?.article_name}
                            </TableCell>
                            <TableCell className="text-right">
                                {new Intl.NumberFormat('en-PH', {
                                    style: 'currency',
                                    currency: 'PHP',
                                }).format(data.purchase_amount)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
