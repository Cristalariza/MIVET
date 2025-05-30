<?php

namespace App\Http\Controllers\MedicalRecord;

use Illuminate\Http\Request;
use App\Models\MedicalRecord;
use App\Http\Controllers\Controller;
use App\Models\Appointment\Appointment;
use App\Http\Resources\MedicalRecord\Calendar\MedicalRecordCalendarResource;
use App\Http\Resources\MedicalRecord\Calendar\MedicalRecordCalendarCollection;

class MedicalRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function calendar(Request $request){

        $medical_records = MedicalRecord::orderBy("id","desc")->get();

        return response()->json([
            "calendars" => MedicalRecordCalendarCollection::make($medical_records),
        ]);
    }
    public function update_aux(Request $request, string $id)
    {
        $medical_record = MedicalRecord::findOrFail($id);
        if($medical_record->appointment_id){
            $medical_record->appointment->update([
                "state" => $request->state,
            ]);
        }
        if($medical_record->vaccination_id){
            $medical_record->vaccination->update([
                "state" => $request->state,
            ]);
        }
        $medical_record->update([
            "notes" => $request->notes,
        ]);
        return response()->json([
            "event" => MedicalRecordCalendarResource::make($medical_record),
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
