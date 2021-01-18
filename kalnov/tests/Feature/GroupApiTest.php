<?php

namespace Tests\Feature;

use App\Models\Group;
use App\Models\Major;
use App\Models\StudyYear;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GroupApiTest extends TestCase
{
    use RefreshDatabase;

    // GET: /groups
    public function testShouldReturnGroups()
    {
        Group::factory()->count(10)->create();

        $response = $this->json('GET', 'api/groups', [
            'year' => 2020,
            'studyYear' => 2020,
            'studyYearType' => 'master'
        ]);

        $response->assertStatus(200);
    }

    // GET: /groups
    // TODO из-за того что мы используем Validator::Make и сами кидаем исключение не понятно как возвращать
    // TODO тот же ответ, что и при испрользовании request->validate()
    // TODO $response->assertSessionHasErrors() не работает
    public function testShouldValidateInvalidStudyYearType()
    {
        $response = $this->json('GET', 'api/groups', [
            'year' => 2020,
            'studyYear' => 2020,
            'studyYearType' => 'invalid'
        ]);

        $response->assertStatus(422);
    }

    // POST: /groups
    public function testShouldCreateGroupAndStudyYear() {
        $major = Major::factory()->create();

        $response = $this->post('api/groups', [
            'number' => 2020,
            'majorId' => $major->id,
            'studyYearType' => 'master'
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('study_years', [
            'year' => 1, 'type' => 'master'
        ]);

        $this->assertDatabaseHas('groups', [
           'number' => 2020, 'study_year_type' => 'master'
        ]);
    }

    // POST: /groups
    public function testShouldNotCreateGroupAndValidateInvalidStudyYearType() {
        $major = Major::factory()->create();

        $response = $this->post('api/groups', [
            'number' => 2020,
            'majorId' => $major->id,
            'studyYearType' => 'invalid'
        ]);

        $response->assertSessionHasErrors(['studyYearType']);
    }

    // POST: /groups
    public function testShouldNotCreateGroupAndValidateNotExistingMajorId() {
        $response = $this->post('api/groups', [
            'number' => 2020,
            'majorId' => 0,
            'studyYearType' => 'master'
        ]);

        $response->assertSessionHasErrors(['majorId']);
    }
}
