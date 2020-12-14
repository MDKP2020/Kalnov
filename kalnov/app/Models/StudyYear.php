<?php

namespace App\Models;

use App\Exceptions\InvalidStudyYearTypeException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Class StudyYear
 *
 * @package App\Models
 * @mixin Builder
 */
class StudyYear extends Model
{
    use HasFactory;

    public static function store (Request $request) {
        $studyYear = new StudyYear();
        $studyYear->year = $request->input('year');
        $studyType = $request->input('type');
        if(strcasecmp('bachelor', $studyType) == 0 || strcasecmp('master', $studyType) == 0)
            $studyYear->type = $studyType;
        else throw new InvalidStudyYearTypeException();

        $studyYear->saveOrFail();
    }

    public static function getAllByType(string $type) {
        return StudyYear::where('type', $type)->orderBy('year')->get();
    }

    public static function getTypes() {
        return StudyYear::distinct()->get(['type']);
    }
}
