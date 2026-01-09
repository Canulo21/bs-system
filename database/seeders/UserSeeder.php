<?php

namespace Database\Seeders;

use App\Models\User;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $users_data = [
            [
                'name' => 'Jhon Carlo Canulo',
                'email' => 'canulodev21@gmail.com',
                'password' => Hash::make('canulo2121'),
            ],
            ];
        User::insert($users_data);
    }
}
