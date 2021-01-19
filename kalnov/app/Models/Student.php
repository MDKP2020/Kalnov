<?php

namespace App\Models;

use App\Exceptions\BadRequestException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class Student extends Model
{
    use HasFactory;

    public function edit($firstName, $lastName, $middleName) {
        $nameValidationRules = [ 'string', 'nullable' ];

        $validator = Validator::make(['name' => $firstName, 'last_name' => $lastName, 'middle_name' => $middleName], [
            'name' => $nameValidationRules,
            'last_name' => $nameValidationRules,
            'middle_name' => $nameValidationRules
        ]);

        $wasEdited = false;

        if($validator->fails())
            throw new BadRequestException($validator->errors());

        if($firstName != null) {
            $this->setAttribute('name', $firstName);
            $wasEdited = true;
        }

        if($lastName != null) {
            $this->setAttribute('last_name', $lastName);
            $wasEdited = true;
        }

        if($middleName != null) {
            $this->setAttribute('middle_name', $middleName);
            $wasEdited = true;
        }

        if($wasEdited)
            $this->save();
    }
}
