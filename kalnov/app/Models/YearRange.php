<?php


namespace App\Models;


use DateTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;

class YearRange extends Model
{
    use HasFactory, Notifiable;

    protected $table = 'year_ranges';

    public static function store(Request $request) {
        $yearRange = new YearRange;
        $yearRange->start = $request->input('start');

        $yearRange->saveOrFail();
    }

    public function next() {
        $yearRangeStart = new DateTime($this->start);
        $year = $yearRangeStart->format('Y');

        return YearRange::whereRaw('date_part(\'year\', start) = ?', [intval($year) + 1])->get();
    }
}
