<?php

use App\Exceptions\InvalidNextYearTransfer;
use App\Models\Group;
use App\Models\StudyYear;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\YearRange;

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
    return YearRange::find($id);
});

Route::post('/years', function(Request $request) {
    return YearRange::store($request);
});

// API курсов обучения
Route::post('/study_years', function(Request $request) {
    return StudyYear::store($request);
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

    return Group::getAllByYearAndStudyYear($year, $studyYear, $studyYearType);
});

Route::post('/groups', function(Request $request) {
    return Group::newGroup(
        $request->input('number'),
        $request->input('year'),
        $request->input('studyYear'),
        $request->input('studyYearType'),
        $request->input('previousGroupId'),
        $request->input('majorId')
    );
});

Route::post('/groups/nextYear', function(Request $request) {
    // TODO валидация корректности времени перевода группы

    $group = Group::get(
        $request->input('year'),
        $request->input('studyYearType'),
        $request->input('studyYear'),
        $request->input('number')
    );

    if(time() < $group->getAttribute('last_exam_date')->getTimestamp())
        return $group->moveToNextYear();
    else
        throw new InvalidNextYearTransfer();
});
