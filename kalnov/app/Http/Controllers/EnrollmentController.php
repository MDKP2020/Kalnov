<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function enroll($degree_level) {
        return view('enrollment.first_year', ['degree_level' => $degree_level]);
    }

    public function expel(Request $request) {
        $student = $request->query('student');
        return view('enrollment.expel', ['student' => $student]);
    }

    public function transfer($group) {
        return view('enrollment.transfer', ['group' => $group]);
    }
}
