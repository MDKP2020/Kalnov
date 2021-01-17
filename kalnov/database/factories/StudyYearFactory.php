<?php

namespace Database\Factories;

use App\Models\StudyYear;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class StudyYearFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = StudyYear::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'year' => $this->faker->numberBetween(1900, 2100),
            'type' => $this->faker->randomElement(['master', 'bachelor'])
        ];
    }
}
