<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGroupsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('groups', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->integer('number');
            $table->date('year_range');
            $table->foreign('year_range')->references('start')->on('year_ranges');
            $table->foreignId('major_id')->constrained('majors');
            $table->foreignId('previous_group_id')->nullable()->constrained();
            $table->integer('year');
            $table->date('last_exam_date')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('groups');
    }
}
