<?php

namespace App\Helpers\Api;

use App\Models\Group;
use Illuminate\Http\Request;

function getGroup(Request $request) {
    return Group::get(
        $request->input('year'),
        $request->input('studyYearType'),
        $request->input('studyYear'),
        $request->input('number')
    );
}
