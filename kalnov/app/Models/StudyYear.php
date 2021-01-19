<?php

namespace App\Models;

use App\Exceptions\InvalidStudyYearData;
use App\Exceptions\InvalidStudyYearTypeException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

/**
 * Class StudyYear
 *
 * @package App\Models
 * @mixin Builder
 */
class StudyYear extends Model
{
    use HasFactory, Notifiable;

    public static function isTypeValid(string $type) {
        return strcasecmp('bachelor', $type) == 0 || strcasecmp('master', $type) == 0;
    }

    public static function store ($type, $year) {
        $validator = Validator::make(['type' => $type, 'year' => $year], [
            'type' => [ 'required', 'in:bachelor,master' ],
            'year' => [ 'required', 'integer', 'min:1', 'max:4' ]
        ]);

        if($validator->fails())
            throw new InvalidStudyYearData($validator->errors());

        $studyYear = new StudyYear();
        $studyYear->setAttribute('year', $year);
        $studyYear->setAttribute('type', $type);

        return $studyYear->saveOrFail();
    }

    public static function getAllByType(string $type) {
        return StudyYear::where('type', $type)->orderBy('year')->get();
    }

    public static function getTypes() {
        return StudyYear::distinct()->orderBy('type')->get(['type'])->map(function($item) {
            return $item['type'];
        });
    }
}
