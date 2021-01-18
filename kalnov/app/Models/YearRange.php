<?php


namespace App\Models;


use App\Exceptions\InvalidYearStart;
use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;

class YearRange extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'year_ranges';

    public static function create(string $startDate) {
        $yearRange = new YearRange();
        $yearRange->setAttribute('start', $startDate);

        return $yearRange;
    }

    public static function store(string $startDate) {
        if($startDate != null) {
            $yearRange = YearRange::create($startDate);
            return $yearRange->saveOrFail();
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
