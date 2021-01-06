<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\YearRange;

class YearApiTests extends TestCase
{
    use RefreshDatabase;

    const YearRangeEntityCount = 3;

    // GET: /years
    public function testShouldReturnAllYearRanges()
    {
        YearRange::factory()->count(self::YearRangeEntityCount)->create();

        $response = $this->get('api/years');

        $response
            ->assertStatus(200)
            ->assertJsonCount(self::YearRangeEntityCount);
    }

    // GET: /years/{id}
    public function testShouldReturnYearRangesById() {
        $yearRanges = YearRange::factory()->count(self::YearRangeEntityCount)->create();

        $requestId = $yearRanges[0]['id'];

        $response = $this->get('api/years/' . $requestId);

        $response
            ->assertStatus(200)
            ->assertJsonPath('id', $requestId);
    }

    // GET: /years/{id}
    public function testShouldReturnNotFoundByNotExistingId() {
        YearRange::factory()->count(self::YearRangeEntityCount)->create();

        $requestId = 0; // equals not exists

        $response = $this->get('api/years/' . $requestId);

        $response->assertNotFound();
    }
}
