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
        ])->paginate(15);


        return response()->json($table);

    }

    public function removePurchaseDetail($id) {
        $purchaseDetail = PurchaseDetails::findOrFail($id);
        $purchaseDetail->delete();

        return response()->json([
            'message' => 'Purchase detail removed successfully'
        ]);
    }
}
