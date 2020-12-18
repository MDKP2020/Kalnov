<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class SetStudentsToGroupsPrimaryKey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('students_to_groups', function (Blueprint $table) {
            $table->primary(['student_id', 'group_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('students_to_groups', function (Blueprint $table) {
            $table->dropPrimary('students_to_groups_student_id_group_id_primary');
        });
    }
}
