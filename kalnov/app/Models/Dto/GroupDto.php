<?php


namespace App\Models\Dto;
use App\Models\Group;
use Spatie\DataTransferObject\DataTransferObject;

class GroupDto extends DataTransferObject
{
    public string $major_name;
    public int $group_number;
    public string $last_exam_date;
    public int $id;
    public string $study_year_type;
    public int $study_year;
    public string $createdAt;
    public string $updatedAt;

    public static function fromGroup(Group $group): GroupDto {
        return new self([
            'id' => $group->getAttribute('id'),
            'major_name' => $group->getMajorName(),
            'last_exam_date' => $group->getAttribute('last_exam_date'),
            'group_number' => $group->getAttribute('number'),
            'study_year_type' => $group->getAttribute('study_year_type'),
            'study_year' => $group->getAttribute('study_year'),
            'created_at' => $group->getAttribute('created_at'),
            'updated_at' => $group->getAttribute('updated_at')
        ]);
    }
}
