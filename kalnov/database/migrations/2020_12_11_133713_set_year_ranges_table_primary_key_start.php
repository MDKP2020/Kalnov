<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetYearRangesTablePrimaryKeyStart extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('year_ranges', function($table) {
            $table->dropPrimary('year_ranges_id_start_primary');
        });

        Schema::table('year_ranges', function($table) {
            $table->primary('start');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}
