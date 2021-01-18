<?php

namespace App\Exceptions;

use Exception;

class InvalidYearStart extends Exception
{
    /**
     * Render the exception as an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function render($request)
    {
        return response(['error' => 'Invalid year range start'], 400);
    }
}
