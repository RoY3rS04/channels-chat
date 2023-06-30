<?php

use App\Http\Controllers\Api\AuthenticatedUserController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('login', [AuthenticatedUserController::class, 'store']);

Route::middleware('auth:sanctum')->group(function() {
    Route::get('channels', [ChannelController::class, 'index']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('messages', [MessageController::class, 'store']);

    Route::get('channels/{receiver}', [MessageController::class, 'index']);
});
