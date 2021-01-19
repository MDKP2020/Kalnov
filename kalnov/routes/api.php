<?php

use App\Exceptions\InvalidNextYearTransfer;
use App\Exceptions\InvalidStudentsEnrollmentData;
use App\Exceptions\ResourceNotFound;
use App\Models\Group;
use App\Models\Student;
use App\Models\StudyYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\YearRange;
use App\Models\Major;
use Illuminate\Validation\ValidationException;
use function App\Helpers\Api\getGroup;
use Illuminate\Support\Facades\Validator;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

// API годов обучения

Route::get('/years', function() {
    return YearRange::all()->sortByDesc('start')->values()->all();
});

Route::get('/years/{id}', function($id) {
    $response = YearRange::find($id);

    if ($response == null) {
        abort(404);
    }

    return YearRange::find($id);
});

Route::get('/years/{id}/next', function($id) {
    $yearRange = YearRange::find($id);
    return $yearRange->next();
});

Route::post('/years', function(Request $request) {
    $request->validate([
       'start'=> 'required'
    ]);

    return YearRange::store($request->input('start'));
});

// API курсов обучения
Route::post('/study_years', function(Request $request) {
    return StudyYear::store($request->input('type'), $request->input('year'));
});

Route::get('/study_years', function(Request $request) {
    $type = $request->input('type');
    if($type == null)
        return StudyYear::all();
    else
        return StudyYear::getAllByType($type);
});

Route::get('/study_years/types', function() {
    return StudyYear::getTypes();
});

// API групп
Route::get('/groups', function(Request $request) {
    $year = $request->input('year');
    $studyYear = $request->input('studyYear');
    $studyYearType = $request->input('studyYearType');

    $validator = Validator::make($request->all(), [
        'year' => ['required', 'integer', 'min:1900'],
        'studyYear' => ['required', 'integer', 'min:1900'],
        'studyYearType' => ['required', 'in:bachelor,master'],
    ]);
    throw_if($validator->fails(), new ValidationException($validator));

    return Group::getAllByYearAndStudyYear($year, $studyYear, $studyYearType);
});

Route::post('/groups', function(Request $request) {
    $request->validate( [
        'number' => ['required', 'integer', 'min:1900'],
        'majorId' => ['required', 'integer', 'exists:majors,id'],
        'studyYearType' => ['required', 'in:bachelor,master'],
    ]);

    return Group::newGroup(
        $request->input('number'),
        $request->input('studyYearType'),
        $request->input('majorId')
    );
});

Route::post('/groups/nextYear', function(Request $request) {
    // TODO валидация корректности времени перевода группы

    $group = getGroup($request);
    $group->moveToNextYear();
});

Route::post('/groups/lastExamDate', function(Request $request) {
    $group = getGroup($request);
    $group->setLastExamDate($request->input('lastExamDate'));
});

Route::get('/groups/{id}/students', function(Request $request, $id) {
    $group = Group::find($id);

    return $group->getStudents($request->input('name'));
});

Route::patch('/groups/{id}/expel/studyEnd', function(Request $request, $id) {
    $group = Group::find($id);

    // TODO: возможно ли отчисление не с последнего курса?
    $group->expelAtStudyEnd();

});

Route::get('/groups/{id}', function(Request $request, $id) {
    $group = Group::find($id);

    return \App\Models\Dto\GroupDto::fromGroup($group);
});


Route::get('/groups/{id}', function(Request $request, $id) {
    $group = Group::find($id);

    return \App\Models\Dto\GroupDto::fromGroup($group);
});

Route::post('/groups/{id}/enrollment', function (Request $request, $id) {
    $studentsValidator = Validator::make($request->all(), [
        'students.*.name' => ['required', 'string'],
        'students.*.middleName' => ['required', 'string'],
        'students.*.lastName' => ['required', 'string']
    ]);

    if($studentsValidator->fails())
        throw new InvalidStudentsEnrollmentData($studentsValidator->errors());

    $group = Group::find($id);

    if ($group === null)
        throw new ResourceNotFound("Group with id = $id not found");

    $students = $request['students'];

    $group->enrollmentStudents($students);
});

// API студентов

Route::get('/students/{id}', function($id) {
    return Student::find($id);
});

// API специальностей

Route::get('/majors', function() {
    return Major::getAll();
});
