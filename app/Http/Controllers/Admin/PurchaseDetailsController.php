<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PurchaseDetails;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseDetailsController extends Controller
{   
    //

    public function getPurchaseDetailsTable() {
       $table = PurchaseDetails::with([
            'mode:id,mode_abbreviation',
            'supplier:id,supplier_name',
            'article:id,article_name',
        ])->get();


        return response()->json([
            'data' => $table
        ]);

    }
}
