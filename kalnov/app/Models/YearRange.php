<?php


namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

class YearRange extends Model
{
    protected $table = 'year_ranges';

    public static function store(Request $request) {
        $yearRange = new YearRange;
        $yearRange->start = $request->input('start');

        $yearRange->saveOrFail();
    }
}
