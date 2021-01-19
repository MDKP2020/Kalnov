<?php


namespace App\Models;


use App\Exceptions\InvalidYearStart;
use Carbon\Carbon;
use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;

class YearRange extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'year_ranges';

    public static function build(string $startDate) {
        $yearRange = new YearRange();
        $yearRange->setAttribute('start', $startDate);

        return $yearRange;
    }

    public static function store(string $startDate) {
        if($startDate != null) {
            $yearRange = YearRange::build($startDate);
            return $yearRange->saveOrFail();
        }
        else
            throw new InvalidYearStart();
    }

    public function next() {
        $yearRangeStart = new DateTime($this->start);
        $year = $yearRangeStart->format('Y');

        $nextYear = YearRange::whereRaw('date_part(\'year\', start) = ?', [intval($year) + 1]);
        if($nextYear->exists())
            return $nextYear->first()->start;
        else {
            $nextYearDate = Carbon::createFromFormat('Y-m-d', $this->start);
            $nextYearDate->year += 1;
            $nextYear = self::build($nextYearDate->format('Y-m-d'));

            $nextYear->save();

            return $nextYear->start;
        }
    }
}
