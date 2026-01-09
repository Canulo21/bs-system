<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ModeOfProcurement;
use Illuminate\Http\Request;

class ModeOfProcurementController extends Controller
{
    //
    public function getModeOfProcurementTable() {
        $table = ModeOfProcurement::orderBy('mode_name', 'asc')->get();

        return response()->json([
            'data' => $table
        ]);
    }


    public function createProcurement(Request $request) {
        $procurement = $request->validate([
            'mode_name' => 'required|string|unique:mode_of_procurements,mode_name',
            'mode_abbreviation' => 'required|string|unique:mode_of_procurements,mode_abbreviation',
        ]);

        ModeOfProcurement::create($procurement);

        return response()->json([
            'data' => $procurement,
            'message' => 'Procurement created successfully'
        ]);
    }

    public function updateProcurement(Request $request, $id) {
        $procurement = ModeOfProcurement::findOrFail($id);

        $validatedData = $request->validate([
            'mode_name' => 'required|string|unique:mode_of_procurements,mode_name,' . $procurement->id,
            'mode_abbreviation' => 'required|string|unique:mode_of_procurements,mode_abbreviation,' . $procurement->id,
        ]);

        $procurement->update($validatedData);

        return response()->json([
            'data' => $procurement,
            'message' => 'Procurement updated successfully'
        ]);
    }

    public function removeProcurement(Request $request, $id) {
        $procurement = ModeOfProcurement::findOrFail($id);
        $procurement->delete();

        return response()->json([
            'message' => 'Procurement removed successfully'
        ]);
    }
}
