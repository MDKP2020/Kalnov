<?php

namespace Tests\Feature;

use App\Models\Major;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class MajorApiTest extends TestCase
{
    public function testShouldReturnAllMajors()
    {
        Major::factory()->count(10)->create();

        $response = $this->get('api/majors');

        $response
            ->assertStatus(200)
            ->assertJsonCount(10);
    }
}
