<?php

namespace App\Models;

use App\Exceptions\BadRequestException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;

class Student extends Model
{
    use HasFactory;

    public function edit($firstName, $lastName, $middleName) {
        $nameValidationRules = [ 'required', 'string' ];

        $validator = Validator::make(['name' => $firstName, 'last_name' => $lastName, 'middle_name' => $middleName], [
            'name' => $nameValidationRules,
            'last_name' => $nameValidationRules,
            'middle_name' => $nameValidationRules
        ]);

        if($validator->fails())
            throw new BadRequestException($validator->errors());

        if($firstName != null)
            $this->setAttribute('name', $firstName);
        if($lastName != null)
            $this->setAttribute('last_name', $lastName);
        if($middleName != null)
            $this->setAttribute('middle_name', $middleName);

        $this->save();
    }
}
