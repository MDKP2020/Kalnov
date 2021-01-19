<?php

namespace Tests\Feature;

use App\Models\StudyYear;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

        $response->assertStatus(400);
    }

    // POST: /study_years
    public function testShouldNotCreateStudyYearWithNullableType()
    {
        $response = $this->post('api/study_years', [
            'year' => 2021,
            'type' => null
        ]);

        $response->assertStatus(400);
    }

    // POST: /study_years
    public function testShouldNotCreateStudyYearWithNotValidType()
    {
        $response = $this->post('api/study_years', [
            'year' => 2021,
            'type' => 'invalid'
        ]);

        $response->assertStatus(400);
    }

    // POST: /study_years
    public function testShouldNotCreateStudyYearInvalidDateFormat()
    {
        $response = $this->post('api/study_years', [
            'year' => 'invalid',
            'type' => 'master'
        ]);

        $response->assertStatus(400);
    }

    // POST: /study_years
    public function testShouldNotCreateStudyYearLess1900()
    {
        $response = $this->post('api/study_years', [
            'year' => 1899,
            'type' => 'master'
        ]);

        $response->assertStatus(400);
    }

    // POST: /study_years
    public function testShouldCreateStudyYear()
    {
        $year = 1;
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

    // GET: /study_years
    public function testShouldReturnAll() {
        $count = 10;

        StudyYear::factory()->count($count)->create();

        $response = $this->get('api/study_years');

        $response
            ->assertStatus(200)
            ->assertJsonCount($count);
    }

    // GET: /study_years
    public function testShouldReturnMasterType() {
        $count = 10;

        $studyYears = StudyYear::factory()->count($count)->create();
        $expectedMasterCount = $studyYears->filter(function ($value) {
           return $value['type'] === 'master';
        })->count();

        $response = $this->json('GET', 'api/study_years', [
            'type' => 'master'
        ]);

        $response
            ->assertStatus(200)
            ->assertJsonCount($expectedMasterCount);
    }

    // GET: /study_years
    public function testShouldValidateInvalidType() {
        $count = 10;

        $studyYears = StudyYear::factory()->count($count)->create();
        $expectedMasterCount = $studyYears->filter(function ($value) {
            return $value['type'] === 'master';
        })->count();

        $response = $this->json('GET', 'api/study_years', [
            'type' => 'invalid'
        ]);

        $response->assertStatus(422);
    }

    // GET: /study_years/types
    public function testShouldReturnTypesOrderByAsc() {
        StudyYear::factory()->create([
           'type' => 'master'
        ]);
        StudyYear::factory()->create([
            'type' => 'bachelor'
        ]);
        StudyYear::factory()->create([
            'type' => 'bachelor'
        ]);

        $response = $this->get('api/study_years/types');

        $response
            ->assertStatus(200)
            ->assertExactJson([
                'bachelor',
                'master'
            ]);
    }
}
