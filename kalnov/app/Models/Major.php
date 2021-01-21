<?php

namespace App\Models;

use App\Exceptions\BadRequestException;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\MessageBag;

class Major extends Model
{
    use HasFactory;

    public static function getAll() {
        return Major::all();
    }

    public static function alreadyExists($name, $acronym) {
        return Major::where('name', '=', $name)->orWhere('acronym', '=', $acronym)->exists();
    }

    public static function newMajor($name, $acronym) {
        $validator = Validator::make(['name' => $name, 'acronym' => $acronym], [
            'name' => ['required', 'string', 'max:50'],
            'acronym' => ['required', 'string', 'min:1', 'max:10'],
        ]);

        if($validator->fails())
            throw new BadRequestException($validator->errors());

        if (self::alreadyExists($name, $acronym))
            throw new BadRequestException(new MessageBag(['error' => 'Such major already exists']));

        $major = new Major();
        $major->setAttribute('name', $name);
        $major->setAttribute('acronym', $acronym);
        $major->saveOrFail();
    }
}
