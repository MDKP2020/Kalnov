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

    public static function store(string $startDate) {
        $yearRange = new YearRange;

        if($startDate != null)
            $yearRange->setAttribute('start', $startDate);
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
