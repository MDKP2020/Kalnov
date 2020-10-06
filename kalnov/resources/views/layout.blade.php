<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Учёт студентов</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"/>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href={{ route('home_page') }}><b>Деканат</b></a>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" href={{ route('expel', ['student' => 'Иванов Иван Иванович']) }}>Отчислить студента</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="" id="enrollmentDropdown" data-toggle="dropdown">
                        Зачисление студентов
                    </a>
                    <div class="dropdown-menu" aria-labelledby="enrollmentDropdown" aria-haspopup="true" aria-expanded="false">
                        <a class="dropdown-item" href={{ route('enroll', ['degree' => 'bachelor']) }}>Зачисление на 1 курс бакалавриата</a>
                        <a class="dropdown-item" href={{ route('enroll', ['degree' => 'magistracy']) }}>Зачисление на 1 курс магистратуры</a>
                    </div>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="" id="transferDropdown" data-toggle="dropdown">
                        Перевод на курс
                    </a>
                    <div class="dropdown-menu" aria-labelledby="transferDropdown" aria-haspopup="true" aria-expanded="false">
                        <a class="dropdown-item" href={{ route('transfer', ['group' => '167']) }}>167</a>
                        <a class="dropdown-item" href={{ route('transfer', ['group' => '267']) }}>267</a>
                        <a class="dropdown-item" href={{ route('transfer', ['group' => '367']) }}>367</a>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
    <div class="container">
        @yield('content')
    </div>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
</body>
</html>
