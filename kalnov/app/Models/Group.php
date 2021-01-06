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
            ->whereRaw('date_part(\'year\', year_range) = ?', [$year])->where('study_year', $studyYear)->where('study_year_type', $studyYearType);
    }

    public static function getAllByYearAndStudyYear($year, $studyYear, $studyYearType) {
        return Group::findAllByYearAndStudyYear($year, $studyYear, $studyYearType)->get()->groupBy('name');
    }

    public static function get($year, $studyYearType, $studyYear, $number) {
        return Group::findAllByYearAndStudyYear($year, $studyYear, $studyYearType)->where('number', $number)->get();
    }

    public function moveToNextYear() {
        // Невозможно осуществить перевести с последнего курса
        $studyYear = $this->getAttribute('study_year');
        if($studyYear < 4) {
            $nextYearGroup = new Group();

            $nextYearGroup->previousGroupId = $this->id;
            $nextYearGroup->number = $this->number;
            $nextYearGroup->setAttribute('study_year', $studyYear + 1);
            $nextYearGroup->setAttribute('study_year_type', $this->getAttribute('study_year_type'));
            $nextYearGroup->setAttribute('major_id', $this->getAttribute('major_id'));

            $currentYear = YearRange::find($this->getAttribute('year_range'));
            $nextYearGroup->setAttribute('year_range', $currentYear->next());
        }
    }

    public function setLastExamDate($date) {
        $this->setAttribute('last_exam_date', $date);
    }

    public function getStudents(?string $name) {
        $searchName = '';
        if($name != null)
            $searchName = $name;

        return DB::
            table('students_to_groups')->join('students', 'students_to_groups.student_id', '=', 'students.id')
            ->where('group_id', $this->getAttribute('id'))
            ->whereRaw('concat(last_name, "name", middle_name) ~* ?', [$searchName])
            ->get();
    }
}
