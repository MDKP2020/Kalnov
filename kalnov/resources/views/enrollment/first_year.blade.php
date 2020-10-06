@extends('layout')

@section('content')
    <h1>Зачисление на первый курс {{ $degree_level == 'bachelor' ? 'бакалавриата' : 'магистратуры' }}</h1>
@endsection
