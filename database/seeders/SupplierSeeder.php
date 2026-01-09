<?php

namespace Database\Seeders;

use App\Models\Supplier;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $suppliers = [
            [
                'supplier_name' => 'FJ-JD Trading',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
              
                'supplier_name' => 'GB Prime Consumer Corp.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
              
                'supplier_name' => 'Gaisano Interpace Computer System',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
              
                'supplier_name' => 'Biosite Medical Instruments',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
              
                'supplier_name' => 'Variance Trading Corporation',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
              
                'supplier_name' => 'Bade\'s Medical Enterprises',
                'created_at' => now(),
                'updated_at' => now(),
            ]
            ];
            Supplier::insert($suppliers);
            
    }
}
