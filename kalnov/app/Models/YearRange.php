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

    public function __construct(string $startDate)
    {
        parent::__construct([]);
        $this->setAttribute('start', $startDate);
    }

    public static function store(string $startDate) {
        if($startDate != null) {
            $yearRange = new YearRange($startDate);
            $yearRange->saveOrFail();
        }
        else
            throw new InvalidYearStart();
    }

    public function next() {
        $yearRangeStart = new DateTime($this->start);
        $year = $yearRangeStart->format('Y');

        return YearRange::whereRaw('date_part(\'year\', start) = ?', [intval($year) + 1])->get();
    }
}
