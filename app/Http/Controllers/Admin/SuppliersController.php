<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SuppliersController extends Controller
{
    //
    public function getSuppliersTable() {
        $table = Supplier::orderBy('supplier_name', 'asc')->paginate(100);

        return response()->json($table);
    }

    public function createSupplier(Request $request) {
        $supplier = $request->validate([
            'supplier_name' => 'required|string|unique:suppliers,supplier_name',
        ]);

        Supplier::create($supplier);

        return response()->json([
            'data' => $supplier,
            'message' => 'Supplier created successfully'
        ]);
    }

    public function updateSupplier(Request $request, $id) {
        $supplierData = $request->validate([
            'supplier_name' => 'required|string|unique:suppliers,supplier_name,' . $id,
        ]);

        $supplier = Supplier::findOrFail($id);
        $supplier->update($supplierData);

        return response()->json([
            'data' => $supplier,
            'message' => 'Supplier updated successfully'
        ]);
    }

    public function removeSupplier(Request $request, $id) {
        $supplier = Supplier::findOrFail($id);
        $supplier->delete();

        return response()->json([
            'message' => 'Supplier removed successfully'
        ]);
    }  
}
