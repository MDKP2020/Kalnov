<?php

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

// API групп
