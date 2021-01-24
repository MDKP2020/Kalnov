<?php


namespace App\Models\Dto;
use App\Models\Group;
use DateTime;
use Illuminate\Support\Collection;
use Spatie\DataTransferObject\DataTransferObject;

class GroupDto extends DataTransferObject
{
    public ?string $lastExamDate;
    public int $id;
    public string $createdAt;
    public string $updatedAt;
    public Collection $students;

    public static function fromGroup(Group $group): GroupDto {
        return new self([
            'id' => $group->getAttribute('id'),
            'lastExamDate' => $group->getAttribute('last_exam_date'),
            'students' => $group->getStudents(null),
            'createdAt' => $group->getAttribute('created_at')->format(DateTime::ISO8601),
            'updatedAt' => $group->getAttribute('updated_at')->format(DateTime::ISO8601)
        ]);
    }
}
