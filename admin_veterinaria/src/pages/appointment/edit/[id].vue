<script setup>

const route = useRoute('appointment-edit-id');
const form = ref({
    date_appointment: null,
    time: null,
    amount: 0,
    method_payment: 'EFECTIVO',
    amount_add: 0,
    state: 1,
})
const warning = ref(null);
const success = ref(null);
const error_exists = ref(null);
const method_payments = ref([
    "EFECTIVO",
    "TRANSFERENCIA",
    "TARJETA",
    "BTC"
]);
const veterinarie_time_availability = ref([]);
const segment_time_veterinaries = ref([]);
const selected_segment_times = ref([]);
const veterinarie_id = ref(null);
const reason = ref(null);
const appointment_selected = ref(null);
const filter = async () => {
    try {
        if(!form.value.date_appointment){
            warning.value = "Es necesario ingresar un fecha";
            return ;
        }
        let data = {
            date_appointment: form.value.date_appointment,
            hour: form.value.time,
        }
        const resp =  await $api('/appointments/filter-availability',{
            method: 'POST',
            body:data,
            onResponseError({response}){
                console.log(response);
                error_exists.value = response._data.error;
            }
        })
        console.log(resp);
        warning.value = null;
        veterinarie_time_availability.value = resp.veterinarie_time_availability;
    } catch (error) {
        console.log(error);
    }

}
const selectedSegmentHour = (veterinarie_time,segment_time_group) => {
    veterinarie_time.segment_times = segment_time_group.segment_times;
    selected_segment_times.value = [];
    segment_time_veterinaries.value = [];
    console.log(selected_segment_times.value);
}
const reset = () => {
    form.value.date_appointment = null;
    form.value.time = null;
    veterinarie_time_availability.value = [];
    segment_time_veterinaries.value = [];
    selected_segment_times.value = [];
}
const addSelectedSegmentTime = (veterinarie_time,segment_time) => {

    let INDEX = selected_segment_times.value.findIndex(item => item.veterinarie_id == veterinarie_time.id && item.segment_time_id == segment_time.veterinarie_schedule_hour_id);
    if(INDEX != -1){
        selected_segment_times.value.splice(INDEX,1);
    }else{
        selected_segment_times.value.push({
            veterinarie_id: veterinarie_time.id,
            segment_time_id: segment_time.veterinarie_schedule_hour_id,
        });
    }
    veterinarie_id.value = veterinarie_time.id;
    selected_segment_times.value = selected_segment_times.value.filter((item) => {
        return item.veterinarie_id == veterinarie_time.id;
    });
    segment_time_veterinaries.value = segment_time_veterinaries.value.filter((item) => {
        return item.indexOf(veterinarie_time.id+"-") != -1;
    })
    console.log(selected_segment_times.value);
}
const fieldsClean = () => {
    form.value.date_appointment = null;
    form.value.time = null;
    // form.value.amount = 0;
    // form.value.method_payment = 'EFECTIVO';
    // form.value.amount_add = 0;
    veterinarie_time_availability.value = [];
    segment_time_veterinaries.value = [];
    selected_segment_times.value = [];
    // select_pet.value = null;
}
const update = async() => {
    try {
        warning.value = null;error_exists.value = null;success.value = null;
        if(form.value.date_appointment){
            if(selected_segment_times.value.length == 0){
                warning.value = "Es necesario asignarle un horario a la cita medica";
                return;
            }
            // warning.value = "El campo de fecha es requerido";
            // return;
        }
        if(!reason.value){
            warning.value = "Es requerido digitar una razon para la atención de la mascota";
            return;
        }
        if(!select_pet.value){
            warning.value = "Es requerido seleccionar una mascota";
            return;
        }
        if(!form.value.amount){
            warning.value = "Es requerido ingresar el costo de la cita medica";
            return;
        }
        // if(!form.value.amount_add){
        //     warning.value = "Es requerido ingresar un adelanto del costo de la cita medica";
        //     return;
        // }
        // if(parseInt(form.value.amount_add) > parseInt(form.value.amount)){
        //     warning.value = "El monto de adelanto no puede ser mayor al costo de la cita";
        //     return;
        // }
        // let STATE_PAY = 1;//PENDIENTE
        // if(form.value.amount > form.value.amount_add){
        //     STATE_PAY = 2;//PARCIAL
        // }
        // if(form.value.amount == form.value.amount_add){
        //     STATE_PAY = 3;//COMPLETO
        // }
        let data = {
            veterinarie_id: veterinarie_id.value,
            pet_id: select_pet.value.id,
            // date_appointment: form.value.date_appointment,
            reason: reason.value,
            amount: form.value.amount,
            // state_pay: STATE_PAY,
            // method_payment: form.value.method_payment,
            // adelanto: form.value.amount_add,
            selected_segment_times: selected_segment_times.value,
            state: form.value.state,
        }
        if(form.value.date_appointment){
            data.date_appointment = form.value.date_appointment;
        }
        const resp =  await $api('/appointments/'+route.params.id,{
            method: 'PATCH',
            body:data,
            onResponseError({response}){
                console.log(response);
                error_exists.value = response._data.error;
            }
        })
        console.log(resp);
        if(resp.message == 403) {
            warning.value = resp.message_text;
        }else{
            success.value = "La cita medica se ha editado correctamente";
            show();
        }
        // setTimeout(() => {
        //     success.value = null;
        //     warning.value = null;
        //     error_exists.value = null;
            fieldsClean()
        // }, 1500);
    } catch (error) {
        console.log(error);
    }
}
// CODIGO PARA LA BUSQUEDA DEL PACIENTE(MASCOTA)
const loading = ref(false)
const search = ref()
const select_pet = ref(null)
const items = ref([])
const querySelections = async (query) => {
  loading.value = true

  // Simulated ajax query
  setTimeout(async () => {
    // items.value = states.filter(state => (state || '').toLowerCase().includes((query || '').toLowerCase()))
    const resp = await $api("/appointments/search-pets/"+query,{
        method: 'GET',
        onResponseError({response}){
            console.log(response);
            error_exists.value = response._data.error;
        }
    })
    console.log(resp);
    items.value = resp.pets;
    loading.value = false
  }, 500)
}
watch(search, query => {
    if(query &&  query.length > 1){
        querySelections(query)
    }else{
        items.value = [];
    }
//    query && query !== select.value && querySelections(query)
})
// FIN DE LA BUSQUEDA DEL PACIENTE
definePage({
    meta: {
        permisssion: 'edit_appointment'
    },
})

const show = async() => {
    try {
        const resp = await $api("/appointments/"+route.params.id,{
            method: 'GET',
            onResponseError({response}){
                console.log(response);
                error_exists.value = response._data.error;
            }
        })
        console.log(resp);
        appointment_selected.value = resp.appointment;
        reason.value = appointment_selected.value.reason;
        form.value.amount = appointment_selected.value.amount;
        form.value.state = appointment_selected.value.state;
        select_pet.value = appointment_selected.value.pet;
        veterinarie_id.value = appointment_selected.value.veterinarie_id;
    } catch (error) {
        console.log(error);
    }
}
onMounted(() => {
    show();
})
</script>
<template>
    <div>
        <VCardText class="pa-5">
            <div class="mb-1">
            <h4 class="text-h4 text-center mb-1">
                Edit Appointment 👩‍💻 : #{{ route.params.id }}
            </h4>
            </div>
        </VCardText>

        <VCard title="🔎 Busqueda:" class="pa-4">
            <VRow>
                <VCol cols="4">
                    <AppDateTimePicker
                        v-model="form.date_appointment"
                        label="Fecha de la cita"
                        :config="{ minDate: 'today',disable: [
                            (date) => {
                                // Deshabilita sábados (6) y domingos (0)
                                return date.getDay() === 0 || date.getDay() === 6;
                            },
                        ]}"
                    />
                </VCol>
                <VCol cols="3">
                    <AppDateTimePicker
                        v-model="form.time"
                        label="Hora de la cita"
                        :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
                    />
                </VCol>
                <VCol cols="3">
                    <VBtn
                        color="info"
                        class="mx-1"
                        prepend-icon="ri-search-2-line"
                        @click="filter()"
                    >
                    </VBtn>
                    <VBtn
                        color="secondary"
                        class="mx-1"
                        prepend-icon="ri-restart-line"
                        @click="reset()"
                    >
                    </VBtn>
                </VCol>
            </VRow>
        </VCard>

        <VAlert type="warning" class="mt-3" v-if="warning">
        <strong>{{ warning }}</strong>
        </VAlert>
        <VAlert type="error" class="mt-3" v-if="error_exists">
        <strong>En el servidor hubo un error al guardar</strong>
        </VAlert>
        <VAlert type="success" class="mt-3" v-if="success">
        <strong>{{ success }}</strong>
        </VAlert>

        <VCard title="📅 Disponibilidad:" class="pa-4 mt-4">
            <VRow>
                <VCol cols="8">
                    <VTable>
                      <thead>
                        <tr>
                            <th class="text-uppercase">
                            Veterinario
                            </th>
                            <th class="text-uppercase">
                            Tiempos activos
                            </th>
                            <th class="text-uppercase">
                            Segmentos de tiempos
                            </th>
                        </tr>
                      </thead>

                      <tbody>
                        {{ segment_time_veterinaries }}
                        <template v-for="(veterinarie_time, index) in veterinarie_time_availability" :key="index">
                            <tr>
                                <td>
                                    {{ veterinarie_time.full_name }}
                                </td>
                                <td>
                                    <ul>
                                        <li v-for="(segment_time_group, index) in veterinarie_time.segment_time_groups" :key="index" style="list-style: none;">
                                            <VBtn
                                                color="success"
                                                class="mx-1"
                                                prepend-icon="ri-file-add-line"
                                                variant="text"
                                                @click="selectedSegmentHour(veterinarie_time,segment_time_group)"
                                            >
                                            </VBtn>
                                            {{ segment_time_group.hour_format}}({{ segment_time_group.count_availability }})</li>
                                    </ul>
                                </td>
                                <td>
                                    <ul>
                                        <li v-for="(segment_time, index) in veterinarie_time.segment_times" :key="index" style="list-style: none;">
                                            <VCheckbox
                                            v-if="!segment_time.check"
                                            @click="addSelectedSegmentTime(veterinarie_time,segment_time)"
                                            v-model="segment_time_veterinaries"
                                            :label="segment_time.schedule_hour.hour_start_format+' '+segment_time.schedule_hour.hour_end_format"
                                            :value="veterinarie_time.id+'-'+segment_time.veterinarie_schedule_hour_id"
                                            />
                                            <label for="" style="font-weight: bold;" v-if="segment_time.check">{{ segment_time.schedule_hour.hour_start_format+' '+segment_time.schedule_hour.hour_end_format }}</label>
                                        </li>
                                        <!-- 
                                        <li style="list-style: none;">
                                            <VCheckbox
                                            label="10:15 AM 10:30 AM"
                                            />
                                        </li>
                                        <li style="list-style: none;">
                                            <VCheckbox
                                            label="10:30 AM 10:45 AM"
                                            />
                                        </li>
                                        <li style="list-style: none;">
                                            <VCheckbox
                                            label="10:45 AM 11:00 AM"
                                            />
                                        </li> -->
                                    </ul>
                                </td>
                            </tr>
                        </template>
                      </tbody>
                    </VTable>
                </VCol>
                <VCol cols="5">
                    <VTextarea
                        v-model="reason"
                        label="Razon de la cita:"
                        placeholder="Text"
                    />
                </VCol>
            </VRow>
        </VCard>
        <VCard title="⏱️ Horario de la Cita:" v-if="appointment_selected" class="pa-4 mt-4">
            <VRow>
                <VCol cols="3">
                    <VSelect
                        :items="[
                            {
                                name: 'Pendiente',
                                id: 1,
                            },
                            {
                                name: 'Cancelado',
                                id: 2,
                            },
                            {
                                name: 'Atendido',
                                id: 3,
                            }
                        ]"
                        v-model="form.state"
                        label="Estado de la cita"
                        item-title="name"
                        item-value="id"
                        :disabled="appointment_selected.state == 2 || appointment_selected.state == 3 ? true : false"
                        placeholder="Select Estado"
                        eager
                    />
                </VCol>
                <VCol cols="8"
                >
                    <VTable>
                      <thead>
                        <tr>
                            <th class="text-uppercase">
                            Veterinario
                            </th>
                            <th class="text-uppercase">
                            Dia de la cita
                            </th>
                            <th class="text-uppercase">
                            Horario de atención
                            </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr>
                            <td>
                                {{ appointment_selected.veterinarie.full_name }}
                            </td>
                            <td>
                                {{ appointment_selected.date_appointment }}
                            </td>
                            <td>
                                <ul>
                                    <template v-for="(schedule, index) in appointment_selected.schedules" :key="index">
                                        <li>
                                            <label for="" style="font-weight: bold;">{{ schedule.schedule_hour.hour_start_format+' '+schedule.schedule_hour.hour_end_format }}</label>
                                        </li>
                                    </template>
                                </ul>
                            </td>
                        </tr>
                      </tbody>
                    </VTable>
                </VCol>
            </VRow>
        </VCard>
        <VCard title="🐶 Paciente:" class="pa-4 mt-4">
            <VRow>
                <VCol cols="4">
                    <VAutocomplete
                        v-model="select_pet"
                        v-model:search="search"
                        :loading="loading"
                        :items="items"
                        item-title="name"
                        item-value="id"
                        return-object
                        placeholder="Ingresa información de la mascota"
                        label="¿Quien es la mascotita?"
                        variant="underlined"
                        :menu-props="{ maxHeight: '200px' }"
                    />
                </VCol>
                <VCol cols="2" v-if="select_pet">
                    <label for="">Especie: {{ select_pet.specie }}</label>
                    <br>
                    <label for="">Raza: {{ select_pet.breed }}</label>
                </VCol>
                <VCol cols="3" v-if="select_pet">
                    <label for="">Nombre y Apellido: {{ select_pet.owner.first_name+ ' ' + select_pet.owner.last_name }}</label>
                    <br>
                    <label for="">Telefono: {{ select_pet.owner.phone }}</label>
                    <br>
                    <label for="">Documento: {{ select_pet.owner.n_document }}</label>
                </VCol>
            </VRow>
        </VCard>
        <VCard title="💵 Pagos:" class="pa-4 mt-4">
            <VRow>
                <VCol cols="4">
                    <VTextField
                        label="Costo de la cita:"
                        type="number"
                        placeholder="Example: 100"
                        v-model="form.amount"
                        />
                </VCol>
            </VRow>
        </VCard>

        <VCardText class="pa-5 py-0 text-end">
            <VBtn color="primary" class="mb-4" @click="update()">
            Editar
            </VBtn>
        </VCardText>
    </div>
</template>