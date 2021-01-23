<?php

namespace App\Models;

use App\Exceptions\BadRequestException;
use App\Exceptions\GroupAlreadyExists;
use App\Exceptions\InvalidNewGroupData;
use App\Exceptions\InvalidNextYearTransfer;
use App\Exceptions\ResourceNotFound;
use Composer\DependencyResolver\Rule;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\MessageBag;

class Group extends Model
{
    use HasFactory;

    public static function newGroup($number, $studyYearType, $majorId, $yearRange, $studyYear) {
        $group = new Group();

        $year = Carbon::now();
        $year->year = $yearRange;
        $yearStart = YearRange::whereRaw('date_part(\'year\', start) = ?', [$yearRange])->first()->start;

        $validator = Validator::make([ 'number' => $number, 'studyYearType' => $studyYearType, 'majorId' => $majorId , 'studyYear' => $studyYear], [
            'number' => ['required', 'integer'],
            'studyYearType' => ['required', 'in:bachelor,master'],
            'majorId' => ['required', 'exists:majors,id'],
            'studyYear' => ['required', \Illuminate\Validation\Rule::in([1, 2, 3, 4])],
        ]);

        if($validator->fails())
            throw new InvalidNewGroupData($validator->errors());

        if(self::alreadyExists($number, $majorId, $studyYearType, $yearStart, $studyYear))
            throw new GroupAlreadyExists();

        // Расчёт учебного года
        $currentStudyYear = Carbon::now();
        $currentStudyYear->month = 9;
        $currentStudyYear->day = 1;

        $currentTime = Carbon::now();
        $currentStudyYearEnd = Carbon::now();
        $currentStudyYearEnd->day = 1;
        $currentStudyYearEnd->month = 8;

        if($currentTime->lt($currentStudyYearEnd))
            $currentStudyYear->year -=1;

        $currentDate = $currentStudyYear->format('Y-m-d');

        $yearRangeExists = YearRange::where('start', $currentDate)->exists();
        if(!$yearRangeExists)
            $currentYearRange = YearRange::store($currentDate);

        $studyYear = 1;
        self::createStudyYearIfNotExists($studyYear, $studyYearType);

        $group->setAttribute('number', $number);
        $group->setAttribute('year_range', $yearStart);
        $group->setAttribute('study_year', $studyYear);
        $group->setAttribute('major_id', $majorId);
        $group->setAttribute('study_year_type', $studyYearType);
        $group->saveOrFail();
    }

    private static function createStudyYearIfNotExists($studyYear, $studyYearType) {
        $exists = DB::table('study_years')
            ->where('year', $studyYear)
            ->where('type', $studyYearType)
            ->exists();

        if (!$exists) {
            StudyYear::store($studyYearType, $studyYear);
        }
    }

    public static function findAllByYearAndStudyYear($year, $studyYear, $studyYearType) {
        return Group::
            join('majors', 'groups.major_id', '=', 'majors.id')
            ->select(
                'groups.id',
                'groups.created_at',
                'groups.updated_at',
                'number',
                'majors.name',
                'majors.acronym',
                'year_range',
                'previous_group_id',
                'last_exam_date',
                'study_year',
                'study_year_type'
            )
            ->whereRaw('date_part(\'year\', year_range) = ?', [$year])->where('study_year', $studyYear)->where('study_year_type', $studyYearType);
    }

    public static function getAllByYearAndStudyYear($year, $studyYear, $studyYearType) {
        return Group::findAllByYearAndStudyYear($year, $studyYear, $studyYearType)->get()->groupBy('acronym');
    }

    public static function get($year, $studyYearType, $studyYear, $number) {
        return Group::findAllByYearAndStudyYear($year, $studyYear, $studyYearType)->where('number', $number)->get();
    }

    public function moveToNextYear() {
        $studyYear = $this->getAttribute('study_year');

        $groupLastExamDate = $this->getAttribute('last_exam_date');

        if($groupLastExamDate == null)
            throw new BadRequestException(new MessageBag([ 'last_exam_date' => 'Last exam date should not be null' ]));

        $lastExamDate = Carbon::createFromFormat('Y-m-d', $groupLastExamDate);

        if($studyYear < 4 && time() >= $lastExamDate->timestamp) {
            $nextYearGroup = new Group();

            $nextYearGroup->setAttribute('previous_group_id', $this->id);
            $nextYearGroup->setAttribute('number', $this->getAttribute('number'));
            $nextYearGroup->setAttribute('study_year', $studyYear + 1);
            $nextYearGroup->setAttribute('study_year_type', $this->getAttribute('study_year_type'));
            $nextYearGroup->setAttribute('major_id', $this->getAttribute('major_id'));

            $nextStudyYear = StudyYear::
                where('type', $this->getAttribute('study_year_type'))
                ->where('year', $studyYear + 1);

            if(!$nextStudyYear->exists()) {
                StudyYear::store(
                    $this->getAttribute('study_year_type'),
                    $studyYear + 1
                );
            }

            $currentYear = YearRange::where('start', $this->getAttribute('year_range'))->first();
            $nextYear = $currentYear->next();
            $nextYearGroup->setAttribute('year_range', $nextYear);

            $groupWasAlreadyMoved = Group::where('previous_group_id', $this->getAttribute('id'))->exists();

            if($groupWasAlreadyMoved)
                throw new GroupAlreadyExists();

            $nextYearGroup->save();

            $nextYearGroup->enrollAll($this->getActiveStudents(null)->map(function($student) {
                return $student->getAttribute('id');
            }));

            return $nextYearGroup->getAttribute('id');
        }
        else
            throw new InvalidNextYearTransfer();
    }

    public function setLastExamDate($date) {
        $yearRange = $this->getAttribute('year_range');
        $yearRangeStart = Carbon::createFromFormat('Y-m-d', $yearRange)->year;
        $yearRangeEnd = $yearRangeStart + 1;
        $newLastExamDateYear = Carbon::createFromFormat('Y-m-d', $date)->year;
        if ($newLastExamDateYear == $yearRangeEnd)
            $this->setAttribute('last_exam_date', $date);
        else
            throw new BadRequestException(
                new MessageBag(['last_exam_year' => 'Year of last exam date should be equal to last year of year range']));
    }

    public function getActiveStudents($name) {
        $searchName = '';
        if($name != null)
            $searchName = $name;

        return StudentRecord::join('students', 'students_to_groups.student_id', '=', 'students.id')
            ->where('group_id', $this->getAttribute('id'))
            ->where('expel_reason', null)
            ->whereRaw('concat(last_name, \' \', "name", \' \', middle_name) ~* ?', [$searchName])
            ->get();
    }

    public function getStudents(?string $name) {
        $searchName = '';
        if($name != null)
            $searchName = $name;

        return StudentRecord::join('students', 'students_to_groups.student_id', '=', 'students.id')
            ->where('group_id', $this->getAttribute('id'))
            ->whereRaw('concat(last_name, \' \', "name", \' \', middle_name) ~* ?', [$searchName])
            ->orderByRaw('concat(last_name, \' \', "name", \' \', middle_name)')
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
        $now = Carbon::now('utc')->toDateTimeString();

        StudentRecord::insert(
            $studentsIds->map(function($studentId) use ($now) {
                return [
                    'group_id' => $this->id,
                    'student_id' => $studentId,
                    'created_at' => $now,
                    'updated_at' => $now
                ];
            })->toArray()
        );
    }

    public function expelStudent(string $reason, $studentId) {
        StudentRecord::where('group_id', $this->getAttribute('id'))->where('student_id', $studentId)->update([
            'expel_reason' => $reason
        ]);
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

        DB::transaction(function() use ($students) {
            $studentsIds = new Collection();

            $now = Carbon::now('utc')->toDateTimeString();

            foreach ($students as $student) {
                $studentId = Student::insertGetId([
                    'name' => $student['name'],
                    'middle_name' => $student['middleName'],
                    'last_name' => $student['lastName'],
                    'gradebook_number' => $student['gradebookNumber'],
                    'created_at' => $now,
                    'updated_at' => $now
                ]);

                $studentsIds->add($studentId);
            }

            $this->enrollAll($studentsIds);
        });
    }

    public function getMajorName() : string {
        return DB::table('majors')->get('acronym')->where('id', $this->getAttribute('major_id'));
    }

    public function equals(Group $otherGroup) {
        return (
            $this->getAttribute('number') === $otherGroup->getAttribute('number')
            && $this->getAttribute('major_id') === $otherGroup->getAttribute('major_id')
            && $this->getAttribute('study_year_type') === $otherGroup->getAttribute('study_year_type')
            && $this->getAttribute('year_range') === $otherGroup->getAttribute('year_range')
            && $this->getAttribute('study_year') === $otherGroup->getAttribute('study_year')
        );
    }

    public static function alreadyExists($number, $major_id, $study_year_type, $year_range, $study_year) : bool {
        return DB::table('groups')
            ->where('number', '=', $number)
            ->where('major_id', '=', $major_id)
            ->where('study_year_type', '=', $study_year_type)
            ->where('year_range', '=', $year_range)
            ->where('study_year', '=', $study_year)
            ->exists();
    }
}
