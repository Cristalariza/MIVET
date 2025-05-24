<script setup>
import data from '@/views/js/datatable'

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'NAME', key: 'fullName' },
  { title: 'EMAIL', key: 'email' },
  { title: 'DATE', key: 'startDate' },
  { title: 'EXPERIENCE', key: 'experience' },
  { title: 'AGE', key: 'age' },
]

const searchQuery = ref(null);
const isAddRoleDialogVisible =ref(false);
</script>

<template>
    <div>
        <VCard title="Roles y Permisos">
            <VCardText class="d-flex flex-wrap gap-4">
        <div class="d-flex align-center">
          <!-- 👉 Search  -->
          <VTextField
            v-model="searchQuery"
            placeholder="Search Product"
            style="inline-size: 300px;"
            density="compact"
            class="me-3"
          />
        </div>

        <VSpacer />

        <div class="d-flex gap-x-4 align-center">

          <VBtn
            color="primary"
            prepend-icon="ri-add-line"
            @click="isAddRoleDialogVisible = !isAddRoleDialogVisible"
          >
            Add Role
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
             </VDataTable>
             <AddRoleDialog v-model:is-dialog-visible="isAddRoleDialogVisible" />
        </VCard>
         
       
    </div>
</template>
