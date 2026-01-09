<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModeOfProcurement extends Model
{
    //
    protected $fillable = [
        'mode_name',
        'mode_abbreviation',
    ];


    public function purchaseDetails()
    {
        return $this->hasMany(PurchaseDetails::class, 'mode_id', 'id');
    }
}
