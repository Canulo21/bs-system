<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('purchase_details', function (Blueprint $table) {
            $table->id();

            $table->foreignId('mode_id')
                   ->nullable()
                   ->constrained('mode_of_procurements')
                   ->nullOnDelete();

            $table->string('purchase_number');
            $table->date('purchase_date')->nullable();
            $table->date('purchase_date_issued')->nullable();

            $table->foreignId('supplier_id')
                   ->nullable()
                   ->constrained('suppliers')
                   ->nullOnDelete();

            $table->foreignId('article_id')
                   ->nullable()
                   ->constrained('articles')
                   ->nullOnDelete();


            $table->decimal('purchase_amount', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_details');
    }
};
