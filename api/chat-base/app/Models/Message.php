<?php

namespace App\Models;

use App\Events\MessageCreated;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'channel_id',
        'sender_id',
        'message'
    ];

//    protected $dispatchesEvents = [
//        'created' => MessageCreated::class,
//    ];

    public function channel(): BelongsTo {
        return $this->belongsTo(Channel::class);
    }

    public function sender(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
