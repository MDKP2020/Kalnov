<?php

namespace App\Models;

use App\Exceptions\InvalidStudyYearTypeException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;

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
    }
}
