<?php

namespace Database\Seeders;

use App\Models\PurchaseDetails;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PurchaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $purchase_details = [
            [
                'mode_id' => 1,
                'purchase_number' => '24-0526',
                'purchase_date' => '2025-12-12',
                'purchase_date_issued' =>'2025-12-12',
                'supplier_id' => 1,
                'article_id' => 1,
                'purchase_amount' => 1212.00,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'mode_id' => 2,
                'purchase_number' => '25-123',
                'purchase_date' => '2025-12-12',
                'purchase_date_issued' => '2025-12-12',
                 'supplier_id' => 2,
                'article_id' => 2,
                'purchase_amount' => 1000.00,
                'created_at' => now(),
                'updated_at' => now(),
            ]
            ];
            PurchaseDetails::insert($purchase_details);
    }
}
 