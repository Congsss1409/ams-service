<?php

use Illuminate\Support\Facades\Route;

// This route will catch all web requests and return the 'app' view.
// This is where our React application will be loaded.
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');