<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

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

    private static function findAllByYearAndStudyYear($year, $studyYear, $studyYearType) {
        return Group::
            join('majors', 'groups.major_id', '=', 'majors.id')
            ->where('year_range', $year)->where('study_year', $studyYear)->where('study_year_type', $studyYearType);
    }

    public static function getAllByYearAndStudyYear($year, $studyYear, $studyYearType) {
        return Group::findAllByYearAndStudyYear($year, $studyYear, $studyYearType)->get()->groupBy('name');
    }

    public static function get($year, $studyYearType, $studyYear, $number) {
        return Group::findAllByYearAndStudyYear($year, $studyYear, $studyYearType)->where('number', $number)->get();
    }

    public function moveToNextYear() {
        // TODO создать и вернуть новую группу
    }

    public function setLastExamDate($date) {
        $this->setAttribute('last_exam_date', $date);
    }

    public function getStudents() {
        return DB::table('students_to_groups')->where('group_id', $this->getAttribute('id'))->get();
    }
}
