<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user.
     */
    public function index()
    {
        $user = Auth::user();
        $notifications = $user->notifications()->orderBy('created_at', 'desc')->get();
        return response()->json($notifications);
    }

    /**
     * Get only the unread notifications for the authenticated user.
     */
    public function unread()
    {
        $user = Auth::user();
        $unreadNotifications = $user->unreadNotifications()->orderBy('created_at', 'desc')->get();
        return response()->json($unreadNotifications);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead($id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->find($id);

        // FIX: Manually update the read_at timestamp instead of calling a method.
        if ($notification && is_null($notification->read_at)) {
            $notification->read_at = now();
            $notification->save();
        }

        return response()->json(['message' => 'Notification marked as read.']);
    }

    /**
     * Mark all unread notifications as read for the authenticated user.
     */
    public function markAllAsRead()
    {
        $user = Auth::user();
        // FIX: Use a query to update all unread notifications at once.
        $user->unreadNotifications()->update(['read_at' => now()]);
        return response()->json(['message' => 'All notifications marked as read.']);
    }

    /**
     * Delete a specific notification.
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $notification = $user->notifications()->find($id);

        if ($notification) {
            $notification->delete();
            return response()->json(['message' => 'Notification deleted successfully.']);
        }

        return response()->json(['message' => 'Notification not found.'], 404);
    }

    /**
     * Clear all notifications for the authenticated user.
     */
    public function clearAll()
    {
        $user = Auth::user();
        $user->notifications()->delete();
        return response()->json(['message' => 'All notifications cleared.']);
    }

    /**
     * Send a broadcast notification to all users. (Admin Only)
     */
    public function sendBroadcast(Request $request)
    {
        $request->validate(['message' => 'required|string|max:255']);

        $users = User::all();
        foreach ($users as $user) {
            $user->notifications()->create([
                'type' => 'broadcast',
                'message' => $request->message,
            ]);
        }

        return response()->json(['message' => 'Broadcast notification sent to all users.']);
    }
}
