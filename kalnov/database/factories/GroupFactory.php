<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Major;
use App\Models\StudyYear;
use App\Models\YearRange;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class GroupFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Group::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $studyYear = StudyYear::factory()->create();
        $yearRange = YearRange::factory()->create();

        return [
            'number' => $this->faker->numberBetween(1, 5),
            'year_range' => $yearRange->start,
            'major_id' => Major::factory(),
            'study_year' => $studyYear->year,
            'study_year_type' => $studyYear->type
        ];
    }
}
