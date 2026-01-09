<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    //
    protected $fillable = [
        'article_name',
    ];

    public function purchaseDetails()
    {
        return $this->hasMany(PurchaseDetails::class, 'article_id', 'id');
    }
}
