<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/purchase-table', [App\Http\Controllers\Admin\PurchaseDetailsController::class, 'getPurchaseDetailsTable']);

    Route::get('/suppliers-table/data', [App\Http\Controllers\Admin\SuppliersController::class, 'getSuppliersTable']);
    Route::post('/supplier/create', [App\Http\Controllers\Admin\SuppliersController::class, 'createSupplier']);
    Route::delete('/supplier/remove/{id}', [App\Http\Controllers\Admin\SuppliersController::class, 'removeSupplier']);

    Route::get('/articles-table/data', [App\Http\Controllers\Admin\ArticlesController::class, 'getArticlesTable']);
    Route::post('/article/create', [App\Http\Controllers\Admin\ArticlesController::class, 'createArticle']);
    Route::delete('/article/remove/{id}', [App\Http\Controllers\Admin\ArticlesController::class, 'removeArticle']);

    Route::get('/mode-of-procurement-table', [App\Http\Controllers\Admin\ModeOfProcurementController::class, 'getModeOfProcurementTable']);
    Route::post('/mode-of-procurement/create', [App\Http\Controllers\Admin\ModeOfProcurementController::class, 'createProcurement']);
    Route::put('/mode-of-procurement/update/{id}', [App\Http\Controllers\Admin\ModeOfProcurementController::class, 'updateProcurement']);
    Route::delete('/mode-of-procurement/remove/{id}', [App\Http\Controllers\Admin\ModeOfProcurementController::class, 'removeProcurement']);
    
});

require __DIR__.'/settings.php';
