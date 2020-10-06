<?php

use App\Http\Controllers\EnrollmentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->name('home_page');

Route::get('/db', function () {
    $results = DB::select(DB::raw('SELECT NOW() AS end_time'));
    return $results[0]->end_time;
})->name('db');

Route::get('/enroll/{degree}', [EnrollmentController::class, 'enroll'])->name('enroll');
Route::get('/expel', [EnrollmentController::class, 'expel'])->name('expel');
Route::get('/transfer/{group}', [EnrollmentController::class, 'transfer'])->name('transfer');
