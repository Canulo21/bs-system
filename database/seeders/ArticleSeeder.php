<?php

namespace Database\Seeders;

use App\Models\Article;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $articles = [
            [
                'article_name' => 'Office Equipment',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'article_name' => 'Radialogy',
                'created_at' => now(),
                'updated_at' => now(),
            ],
             [
                'article_name' => 'Medical Equipment',
                'created_at' => now(),
                'updated_at' => now(),
             ],
              [
                'article_name' => 'Laboratory Supplies',
                'created_at' => now(),
                'updated_at' => now(),
              ],
               [
                'article_name' => 'Catering',
                'created_at' => now(),
                'updated_at' => now(),
               ],
                [
                'article_name' => 'Oxygen ',
                'created_at' => now(),
                'updated_at' => now(),
            ]
            ];
            Article::insert($articles);
    }
}
