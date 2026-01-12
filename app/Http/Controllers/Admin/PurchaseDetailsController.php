<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PurchaseDetails;
use App\Models\Supplier;
use App\Models\Article;
use Illuminate\Http\Request;

class PurchaseDetailsController extends Controller
{
   public function getPurchaseDetailsTable(Request $request)
    {
        $query = PurchaseDetails::with([
            'mode:id,mode_abbreviation',
            'supplier:id,supplier_name',
            'article:id,article_name',
        ]);

        /**
         * ⭐ Determine sorting column
         */
        $sortColumn = match ($request->category) {
            'purchase_date' => 'purchase_date',
            'purchase_date_issued' => 'purchase_date_issued',
            default => 'created_at'
        };

        /**
         * ⭐ Apply date filter ONLY if both start & end are passed
         */
        if ($request->start_date && $request->end_date) {
            $query->whereBetween($sortColumn, [
                $request->start_date,
                $request->end_date
            ]);
        }

        /**
         * ⭐ Order by selected column (always ASC — change to DESC if needed)
         */
        $query->orderBy($sortColumn, 'asc');

        /**
         * ⭐ Paginate (15 rows)
         */
        return response()->json(
            $query->paginate(15)
        );
    }


    public function createPurchaseDetail(Request $request)
    {
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

    public function updatePurchaseDetail(Request $request, $id)
    {
        $purchaseDetail = PurchaseDetails::findOrFail($id);

        $validatedData = $request->validate([
            'mode_id' => 'required|exists:mode_of_procurements,id',
            'purchase_number' => 'required|string',
            'purchase_date' => 'required|date',
            'purchase_date_issued' => 'required|date',
            'supplier_id' => 'required|exists:suppliers,id',
            'article_id' => 'required|exists:articles,id',
            'purchase_amount' => 'required|numeric',
        ]);

        $purchaseDetail->update($validatedData);

        return response()->json([
            'data' => $validatedData,
            'message' => 'Purchase detail updated successfully'
        ]);
    }

    public function removePurchaseDetail($id)
    {
        $purchaseDetail = PurchaseDetails::findOrFail($id);
        $purchaseDetail->delete();

        return response()->json([
            'message' => 'Purchase detail removed successfully'
        ]);
    }
}
