<?php


namespace App\Models;


use App\Exceptions\InvalidYearStart;
use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class YearRange extends Model
{
    protected $table = 'year_ranges';

    public static function store(Request $request) {
        $yearRange = new YearRange;
        $start = $request->input('start');

        if(start != null)
            $yearRange->start = $start;
        else
            throw new InvalidYearStart();

        $yearRange->saveOrFail();
    }

    public function next() {
        $yearRangeStart = new DateTime($this->start);
        $year = $yearRangeStart->format('Y');

        return YearRange::whereRaw('date_part(\'year\', start) = ?', [intval($year) + 1])->get();
    }
}
