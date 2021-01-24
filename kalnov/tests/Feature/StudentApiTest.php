<?php

namespace Tests\Feature;

use App\Models\Student;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StudentApiTest extends TestCase
{
    public function testShouldReturnStudentById()
    {
        $studentCount = 10;
        $students = Student::factory()->count($studentCount)->create();

        $id = $students[5]->id;

        $response = $this->get("api/students/$id");

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'id' => $id
            ]);
    }

    public function testShouldReturnNullStudentWithIdNotExists()
    {
        $response = $this->get("api/students/0");

        $response
            ->assertStatus(200);
    }
}
