<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AuthenticatedUserController extends Controller
{
    function store(Request $request) {
        $data = $request->validate([
            'email' => ['required', 'email', Rule::exists(User::class)],
            'password' => 'required'
        ]);

        $user = User::query()->where('email', $data['email'])->first();


        if(! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => 'The password is invalid'
            ]);
        }

        $token = $user->createToken('APP');

        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken
        ]);
    }
}
