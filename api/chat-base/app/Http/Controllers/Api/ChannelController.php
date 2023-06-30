<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Channel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    //
    public function index():JsonResponse {

        return response()->json(Channel::query()->with('messages.sender')->get());
    }
}
