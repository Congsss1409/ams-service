<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail; // Import Mail facade
use App\Mail\TwoFactorAuthMail; // Import your new Mailable

class AuthController extends Controller
{
    /**
     * Handle a login request to the application.
     * This now initiates the 2FA process.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials.'], 401);
        }

        // Generate and save 2FA code
        $user->two_factor_code = rand(100000, 999999); // 6-digit code
        $user->two_factor_expires_at = now()->addMinutes(10);
        $user->save();

        // Send the code to the user's email
        try {
            Mail::to($user->email)->send(new TwoFactorAuthMail($user->two_factor_code));
        } catch (\Exception $e) {
            // Log the error and return a generic error message
            \Log::error("Mail sending failed: " . $e->getMessage());
            return response()->json(['message' => 'Could not send 2FA code. Please check mail configuration.'], 500);
        }

        return response()->json(['message' => 'A 2FA code has been sent to your email.']);
    }

    /**
     * Verify the 2FA code and issue an authentication token.
     */
    public function verifyTwoFactor(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'two_factor_code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (
            !$user ||
            $user->two_factor_code !== $request->two_factor_code ||
            now()->gt($user->two_factor_expires_at)
        ) {
            return response()->json(['message' => 'Invalid or expired 2FA code.'], 401);
        }

        // Clear the 2FA code after successful verification
        $user->two_factor_code = null;
        $user->two_factor_expires_at = null;
        $user->save();

        // Log the user in and create a token
        Auth::login($user);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('role'), // Eager load the role
        ]);
    }
    
    // ... (the rest of your AuthController methods: user, updateProfile, logout)
    
    public function user(Request $request)
    {
        return $request->user()->load('role');
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'suffix' => 'nullable|string|max:255',
            'personal_email' => 'nullable|string|email|max:255',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update($validator->validated());

        return response()->json(['message' => 'Profile updated successfully!', 'user' => $user]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.']);
    }
}