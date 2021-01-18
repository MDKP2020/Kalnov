<?php

namespace App\Models;

use App\Exceptions\GroupAlreadyExists;
use App\Exceptions\InvalidNextYearTransfer;
use App\Exceptions\ResourceNotFound;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Group extends Model
{
    use HasFactory;

    public static function newGroup($number, $studyYearType, $majorId) {
        $group = new Group();

        // Расчёт учебного года
        $currentYear = Carbon::now()->format('YYYY-MM-dd');

        $suchGroupExists = DB::table('groups')
                ->where('number', '=', $number)
                ->where('major_id', '=', $majorId)
                ->where('study_year_type', '=', $studyYearType)
                ->exists();

        if($suchGroupExists)
            throw new GroupAlreadyExists();

        $group->setAttribute('number', $number);
        $group->setAttribute('year_range', YearRange::create($currentYear));
        $group->setAttribute('study_year', 1);
        $group->setAttribute('major_id', $majorId);
        $group->setAttribute('study_year_type', $studyYearType);
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
    private function enrollAll($studentsIds) {
        DB::table('students_to_groups')->insert(
            $studentsIds->map(function($studentId) {
                return ['group_id' => $this->id, 'student_id' => $studentId];
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

    public function enrollStudents($students) {
        $groupExists = Group::where('id', '=', $this->id)->exists();
        throw_unless($groupExists, new ResourceNotFound("Group with id = $this->id not found"));

        DB::transaction(function($students) {
            $studentsIds = new Collection();

            foreach ($students as $student) {
                $studentId = Student::insertGetId([
                    'name' => $student['name'],
                    'middle_name' => $student['middleName'],
                    'last_name' => $student['lastName']
                ]);

                $studentsIds->add($studentId);
            }

            $this->enrollAll($studentsIds);
        });
    }

    public function getMajorName() : string {
        return DB::table('majors')->get('acronym')->where('id', $this->getAttribute('major_id'));
    }
}
