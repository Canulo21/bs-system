<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseDetails extends Model
{
    //
    protected $fillable = [
        'purchase_number',
        'purchase_date',
        'purchase_date_issued',
        'purchase_amount',

        'mode_id',
        'supplier_id',
        'article_id',
    ];

    public function mode()
    {
        return $this->belongsTo(ModeOfProcurement::class, 'mode_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    } 

    public function article()
    {
        return $this->belongsTo(Article::class, 'article_id');
    }
}
