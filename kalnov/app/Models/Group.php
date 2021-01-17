<?php

namespace App\Models;

use App\Exceptions\InvalidNextYearTransfer;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Group extends Model
{
    use HasFactory;

    public static function newGroup($number, $studyYearType, $majorId) {
        $group = new Group();

        // Расчёт учебного года
        $currentYear = Carbon::now()->format('YYYY-MM-dd');

        $group->setAttribute('number', $number);
        $group->setAttribute('year_range', new YearRange($currentYear));
        $group->setAttribute('study_year', 1);
        $group->setAttribute('major_id', $majorId);
        $group->setAttribute('study_year_type', $studyYearType);
        // TODO провалидировать создание группы
        $group->saveOrFail();
    }

    private static function findAllByYearAndStudyYear($year, $studyYear, $studyYearType) {
        return Group::
            join('majors', 'groups.major_id', '=', 'majors.id')
            ->select(
                'groups.id',
                'groups.created_at',
                'groups.updated_at',
                'number',
                'majors.name',
                'year_range',
                'previous_group_id',
                'last_exam_date',
                'study_year',
                'study_year_type'
            )
            ->whereRaw('date_part(\'year\', year_range) = ?', [$year])->where('study_year', $studyYear)->where('study_year_type', $studyYearType);
    }

    public static function getAllByYearAndStudyYear($year, $studyYear, $studyYearType) {
        return Group::findAllByYearAndStudyYear($year, $studyYear, $studyYearType)->get()->groupBy('name');
    }

    public static function get($year, $studyYearType, $studyYear, $number) {
        return Group::findAllByYearAndStudyYear($year, $studyYear, $studyYearType)->where('number', $number)->get();
    }

    public function moveToNextYear() {
        $studyYear = $this->getAttribute('study_year');
        // Невозможно осуществить перевести с последнего курса
        if($studyYear < 4 && time() < $this->getAttribute('last_exam_date')->getTimestamp()) {
            $nextYearGroup = new Group();

            $nextYearGroup->setAttribute('previous_group_id', $this->id);
            $nextYearGroup->setAttribute('number', $this->number);
            $nextYearGroup->setAttribute('study_year', $studyYear + 1);
            $nextYearGroup->setAttribute('study_year_type', $this->getAttribute('study_year_type'));
            $nextYearGroup->setAttribute('major_id', $this->getAttribute('major_id'));

            $currentYear = YearRange::find($this->getAttribute('year_range'));
            $nextYearGroup->setAttribute('year_range', $currentYear->next());

            $this->enrollAll($this->getStudents(null));
        }
        else
            throw new InvalidNextYearTransfer();
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
            ->whereRaw('concat(last_name, \' \', "name", \' \', middle_name) ~* ?', [$searchName])
            ->get();
    }

    private function enroll($studentId) {
        DB::table('students_to_groups')->insert([
            'group_id' => $this->id,
            'student_id' => $studentId
        ]);
    }

    // Зачисление списка студентов
    private function enrollAll($students) {
        DB::table('students_to_groups')->insert(
            $students->map(function($student) {
                return ['group_id' => $this->id, 'student_id' => $student->getAttribute('id')];
            })->toArray()
        );
    }

    private function expel(string $expelReason) {
        DB::table('students_to_groups')->where('group_id', '=', $this->getAttribute('id'))->update([
            'expel_reason' => $expelReason
        ]);
    }

    public function expelAtStudyEnd() {
        $expelReason = "Отчислен в связи с окончанием обучения";
        if($this->canBeExpelled()) {
            $this->expel($expelReason);
        }
    }

    public function isBachelor() {
        return $this->getAttribute('study_year_type') == 'bachelor';
    }

    public function isMaster() {
        return $this->getAttribute('study_year_type') == 'master';
    }

    public function canBeExpelled() {
        return
            $this->isBachelor() && $this->getAttribute('study_year') == 4
            || $this->isMaster() && $this->getAttribute('study_year') == 2;
    }
}
