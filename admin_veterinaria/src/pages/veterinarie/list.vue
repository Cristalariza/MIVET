<script setup>
import { isPermission } from '@/utils/constants';

    // import data from '@/views/js/datatable'
    const data = ref([]);
    const router = useRouter()
    const headers = [
        {
            title: 'ID',
            key: 'id',
        },
        {
            title: 'Avatar',
            key: 'imagen',
        },
        {
            title: 'Nombre y apellido',
            key: 'full_name',
        },
        {
            title: 'Rol',
            key: 'role_name',
        },
        {
            title: 'Correo',
            key: 'email',
        },
        {
            title: 'Telefono',
            key: 'phone',
        },
        {
            title: 'Documento',
            key: 'document_full',
        },
        {
            title: 'Op',
            key: 'action',
        },
    ]
    const avatarText = value => {
        if (!value)
            return ''
        const nameArray = value.split(' ')
        
        return nameArray.map(word => word.charAt(0).toUpperCase()).join('')
    }
    const searchQuery = ref(null);
    const staff_selected_deleted = ref(null);
    const isDeleteStaffDialogVisible = ref(false);

    const list = async () => {
        const resp =  await $api('/veterinaries?search='+(searchQuery.value ? searchQuery.value : ''),{
            method: 'GET',
            onResponseError({response}){
              console.log(response);
            }
        })
        console.log(resp);

        data.value = resp.veterinaries.data;
    }

    const deleteUser = (User) => {
        let INDEX = data.value.findIndex((user) => user.id == User.id);
        if(INDEX != -1){
            data.value.splice(INDEX,1);
        }
    }

    const editItem = (item) => {
        router.push({name: 'veterinarie-edit-id',params: {id: item.id}});
    }

    const deleteItem = (item) => {
        isDeleteStaffDialogVisible.value = true;
        staff_selected_deleted.value = item;
    }

    onMounted(() => {
        list();
    })
    watch(isDeleteStaffDialogVisible, (event) => {
        console.log(event);
        if(event == false){
            staff_selected_deleted.value = null;
        }
    })
    definePage({
        meta: {
            permisssion: 'list_veterinary'
        },
    })
</script>

<template>
    <div>
        <VCard title="🧑‍⚕️ Veterinarios">
            <VCardText class="d-flex flex-wrap gap-4">
                <div class="d-flex align-center">
                <!-- 👉 Search  -->
                <VTextField
                    v-model="searchQuery"
                    placeholder="Search Staff"
                    style="inline-size: 300px;"
                    density="compact"
                    class="me-3"
                    @keyup.enter="list"
                />
                </div>
    
                <VSpacer />
    
                <div class="d-flex gap-x-4 align-center">
                    <VBtn
                        color="primary"
                        prepend-icon="ri-add-line"
                        v-if="isPermission('register_veterinary')"
                        @click="router.push({name: 'veterinarie-add'})"
                    >
                        Add Veterinarie
                    </VBtn>
                </div>
            </VCardText>

            <VDataTable
                :headers="headers"
                :items="data"
                :items-per-page="5"
                class="text-no-wrap"
            >
                <template #item.id="{ item }">
                <span class="text-h6">{{ item.id }}</span>
                </template>
                
                <template #item.imagen="{ item }">
                    <div class="d-flex align-center">
                        <VAvatar
                        size="32"
                        :color="item.avatar ? '' : 'primary'"
                        :class="item.avatar ? '' : 'v-avatar-light-bg primary--text'"
                        :variant="!item.avatar ? 'tonal' : undefined"
                        >
                        <VImg
                            v-if="item.avatar"
                            :src="item.avatar"
                        />
                            <span
                                v-else
                                class="text-sm"
                                >{{ avatarText(item.full_name) }}</span>
                           
                        </VAvatar> 
                        <!-- <div class="d-flex flex-column ms-3">
                        <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.fullName }}</span>
                        <small>{{ item.post }}</small>
                        </div> -->
                    </div>
                </template>
                <template #item.document_full="{ item }">
                    <div class="d-flex align-center">
                        <div class="d-flex flex-column ms-3">
                            <span class="d-block font-weight-medium text-high-emphasis text-truncate">{{ item.n_document }}</span>
                            <small>{{ item.type_document }}</small>
                        </div>
                    </div>
                </template>
                
                <template #item.action="{ item }">
                    <div class="d-flex gap-1">
                      <IconBtn
                        size="small"
                        v-if="isPermission('edit_veterinary')"
                        @click="editItem(item)"
                      >
                        <VIcon icon="ri-pencil-line" />
                      </IconBtn>
                      <IconBtn
                        size="small"
                        v-if="isPermission('delete_veterinary')"
                        @click="deleteItem(item)"
                      >
                        <VIcon icon="ri-delete-bin-line" />
                      </IconBtn>
                    </div>
                    </template>
            </VDataTable>

            <DeleteVeterinarioDialog v-if="staff_selected_deleted" :userSelected="staff_selected_deleted" @deleteUser="deleteUser" v-model:is-dialog-visible="isDeleteStaffDialogVisible" />
        
        </VCard>


    </div>
</template>