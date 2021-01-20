<?php

namespace App\Exceptions;

use Exception;

class InvalidNextYearTransfer extends Exception
{
    /**
     * Render the exception as an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function render($request)
    {
        return response(['error' => 'Cannot transfer group to next year: you can move group to next year only after the end of last exam'], 400);
    }
}
