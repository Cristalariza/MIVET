<?php

namespace App\Models;

use Carbon\Carbon;
use App\Models\Pets\Pet;
use App\Models\Appointment\Appointment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MedicalRecord extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable = [
        "veterinarie_id",
        "pet_id",
        "event_type",
        "event_date",
        "appointment_id",
        "vaccination_id",
        "surgerie_id",
        "notes",
    ];

    public function setCreatedAtAttribute($value)
    {
    	date_default_timezone_set('America/Lima');
        $this->attributes["created_at"]= Carbon::now();
    }

    public function setUpdatedAtAttribute($value)
    {
    	date_default_timezone_set("America/Lima");
        $this->attributes["updated_at"]= Carbon::now();
    }

    public function veterinarie(){
        return $this->belongsTo(User::class,"veterinarie_id");
    }

    public function pet(){
        return $this->belongsTo(Pet::class,"pet_id");
    }

    public function appointment(){
        return $this->belongsTo(Appointment::class,"appointment_id");
    }
}
