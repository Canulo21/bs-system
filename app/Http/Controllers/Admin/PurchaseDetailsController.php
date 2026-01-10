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

    public function createPurchaseDetail(Request $request) {
        $purchaseDetail = $request->validate([
            'mode_id' => 'required|exists:mode_of_procurements,id',
            'purchase_number' => 'required|string',
            'purchase_date' => 'required|date',
            'purchase_date_issued' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'article_id' => 'required|exists:articles,id',
            'purchase_amount' => 'required|numeric',
        ]);

        PurchaseDetails::create($purchaseDetail);

        return response()->json([
            'data' => $purchaseDetail,
            'message' => 'Purchase detail created successfully'
        ]);
    }

    public function removePurchaseDetail($id) {
        $purchaseDetail = PurchaseDetails::findOrFail($id);
        $purchaseDetail->delete();

        return response()->json([
            'message' => 'Purchase detail removed successfully'
        ]);
    }
}
