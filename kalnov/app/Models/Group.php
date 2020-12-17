<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Group extends Model
{
    use HasFactory;

    public static function newGroup($number, $year, $studyYear, $studyYearType, $previousGroupId, $majorId) {
        $group = new Group();

        $group->number = $number;
        $group->year = $year;
        $group->majorId = $majorId;
        // TODO провалидировать создание группы
        $group->saveOrFail();
    }

    public static function getAllByYearAndStudyYear($year, $studyYear, $studyYearType) {
        return Group::where('year_range', $year)->where('study_year', $studyYear)->where('study_year_type', $studyYearType)->get();
    }

    public function moveToNextYear() {
        // TODO создать и вернуть новую группу
    }
}
