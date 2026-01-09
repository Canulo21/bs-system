<?php

namespace Database\Seeders;

use App\Models\ModeOfProcurement;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ModeOfProcurementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $mode_procurements = [
            [
                'mode_name' => 'Small Value Procurement',
                'mode_abbreviation' => 'SVP',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'mode_name' => 'Direct Contracting',
                'mode_abbreviation' => 'DC',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'mode_name' => 'Public Bidding',
                'mode_abbreviation' => 'PB',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'mode_name' => 'Limited Source Bidding',
                'mode_abbreviation' => 'LSB',
                'created_at' => now(),
                'updated_at' => now(),
            ]
            ];
            ModeOfProcurement::insert($mode_procurements);

    }
}
