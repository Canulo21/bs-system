<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    //
    protected $fillable = [
        'supplier_name',
    ];

    public function purchaseDetails()
    {
        return $this->hasMany(PurchaseDetails::class, 'supplier_id', 'id');
    }
}
