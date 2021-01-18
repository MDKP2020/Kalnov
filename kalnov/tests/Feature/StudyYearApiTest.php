<?php

namespace Tests\Feature;

use DateTime;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StudyYearApiTest extends TestCase
{
    use RefreshDatabase;

    // POST: /study_years
    public function testShouldNotCreateStudyYearWithNullableYear()
    {
        $response = $this->post('api/study_years', [
            'year' => null,
            'type' => 'master'
        ]);

        $response->assertSessionHasErrors(['year']);
    }

    // POST: /study_years
    public function testShouldNotCreateStudyYearWithNullableType()
    {
        $response = $this->post('api/study_years', [
            'year' => 2021,
            'type' => null
        ]);

        $response->assertSessionHasErrors(['type']);
    }

    // POST: /study_years
    public function testShouldNotCreateStudyYearWithNotValidType()
    {
        $response = $this->post('api/study_years', [
            'year' => 2021,
            'type' => 'invalid'
        ]);

        $response->assertSessionHasErrors(['type']);
    }

    // POST: /study_years
    public function testShouldNotCreateStudyYearInvalidDateFormat()
    {
        $response = $this->post('api/study_years', [
            'year' => 'invalid',
            'type' => 'master'
        ]);

        $response->assertSessionHasErrors(['year']);
    }

    // POST: /study_years
    public function testShouldNotCreateStudyYearLess1900()
    {
        $response = $this->post('api/study_years', [
            'year' => 1899,
            'type' => 'master'
        ]);

        $response->assertSessionHasErrors(['year']);
    }

    // POST: /study_years
    public function testShouldCreateStudyYear()
    {
        $year = 2021;
        $type = 'bachelor';

        $response = $this->post('api/study_years', [
            'year' => $year,
            'type' => $type
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('study_years', [
            'year' => $year,
            'type' => $type
        ]);
    }
}
