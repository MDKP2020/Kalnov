<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\YearRange;

class YearApiTests extends TestCase
{
    use RefreshDatabase;

    const YearRangeEntityCount = 3;

    public function test()
    {
        YearRange::factory()->count(self::YearRangeEntityCount)->create();

        $response = $this->get('api/years');

        $response->assertStatus(200);
        $response->assertJsonCount(self::YearRangeEntityCount);
    }
}
