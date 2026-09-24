<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::get('/storage/{path}', function ($path) {
    if (!Storage::disk('public')->exists($path)) {
        abort(404);
    }
    $file = Storage::disk('public')->get($path);
    $mime = Storage::disk('public')->mimeType($path);
    return response($file, 200)->header('Content-Type', $mime);
})->where('path', '.*');