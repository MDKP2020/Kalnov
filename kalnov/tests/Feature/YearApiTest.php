<?php

namespace Tests\Feature;

use DateTime;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\YearRange;

class YearApiTest extends TestCase
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

    // GET: /years/{id}/next
    public function testShouldReturnNextYearRange() {
        $nextYear = '2021-01-01';

        $year = YearRange::factory()->create([
           'start' => new DateTime('2020-01-01')
        ]);
        YearRange::factory()->create([
            'start' => new DateTime($nextYear)
        ]);

        $id = $year['id'];
        $response = $this->get("api/years/$id/next");

        $response
            ->assertStatus(200)
            ->assertJsonFragment([
                'start' => $nextYear
            ]);
    }

    // GET: /years/{id}/next
    public function testShouldReturnNotFoundForNotExistingNextYear() {
        $year = YearRange::factory()->create([
            'start' => new DateTime('2020-01-01')
        ]);

        $id = $year['id'];
        $response = $this->get("api/years/$id/next");

        $response->assertNotFound();
    }

    // POST: /years
    public function testShouldCreateYearRange() {
        $startYear = '2021-01-01';

        $response = $this->post('api/years', ['start' => $startYear]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('year_ranges', [
           'start' => $startYear
        ]);
    }

    // POST: /years
    public function testShouldNotCreateYearRangeWithNullableStart() {
        $response = $this->post('api/years', ['start' => null]);

        $response->assertSessionHasErrors(['start']);
    }

    // POST: /years
    public function testShouldNotCreateYearRangeWithInvalidStartDateFormat() {
        $response = $this->post('api/years', ['start' => 'invalid']);

        $response->assertSessionHasErrors(['start']);
    }
}

