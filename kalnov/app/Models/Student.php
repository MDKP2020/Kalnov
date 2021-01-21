<?php

namespace App\Models;

use App\Exceptions\BadRequestException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\MessageBag;

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

    public function transferToGroup($previousGroupId, $newGroupId) {
        $validator = Validator::make(['previousGroupId' => $previousGroupId, 'newGroupId' => $newGroupId], [
            'previousGroupId' => ['required', 'integer'],
            'newGroupId' => ['required', 'integer'],
        ]);

        $previousGroup = Group::findOrFail($previousGroupId);

        $newGroup = Group::findOrFail($newGroupId);

        $canTransferToNewGroup =
            $newGroup->getAttribute('study_year') == $previousGroup->getAttribute('study_year') &&
            $newGroup->getAttribute('year_range') == $previousGroup->getAttribute('year_range') &&
            $newGroup->getAttribute('study_year_type') == $previousGroup->getAttribute('study_year_type');

        if ($validator->fails())
            throw new BadRequestException($validator->errors());

        if ($canTransferToNewGroup)
            StudentRecord::where('student_id', $this->getAttribute('id'))
                ->where('group_id', $previousGroupId)
                ->update(['group_id' => $newGroupId]);
        else
            throw new BadRequestException(new MessageBag([error => 'Can not transfer student to such group: not the same year range or study year']));
    }
}
