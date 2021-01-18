<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Support\MessageBag;
use Throwable;

class InvalidStudentsEnrollmentData extends Exception
{
    public MessageBag $errors;

    public function __construct(MessageBag $errors, $message = "", $code = 0, Throwable $previous = null)
    {
        parent::__construct($message, $code, $previous);
        $this->errors = $errors;
    }

    /**
     * Render the exception as an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function render($request)
    {
        return response(['errors' => $this->errors->jsonSerialize()], 400);
    }
}
