<script setup>
const props = defineProps({
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
  rolSelected: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:isDialogVisible", "addRole"]);

const dialogVisibleUpdate = (val) => {
  emit("update:isDialogVisible", val);
};

const warning = ref(null);
const success = ref(null);
const error_exists = ref(null);
const role_selected = ref(null);

const deleted = async () => {
  try {
    const resp = await $api("/role/" + role_selected.value.id, {
      method: "DELETE",
      onResponseError({ response }) {
        console.log(response);
        error_exists.value = response._data.error;
      },
    });
    console.log(resp);
    success.value = "El rol se ha eliminado correctamente";
    setTimeout(() => {
      emit("addRole", true);
      emit("update:isDialogVisible", false);
    }, 1000);
  } catch (error) {
    console.log(error);
    error_exists.value = error;
  }
};

onMounted(() => {
  role_selected.value = props.rolSelected;
  console.log(role_selected.value);
});
</script>

<template>
  <VDialog
    :model-value="props.isDialogVisible"
    max-width="750"
    @update:model-value="dialogVisibleUpdate"
  >
    <VCard class="refer-and-earn-dialog pa-3 pa-sm-11">
      <!-- 👉 dialog close btn -->
      <DialogCloseBtn
        variant="text"
        size="default"
        @click="emit('update:isDialogVisible', false)"
      />

      <VCardText class="pa-5">
        <div class="mb-6">
          <h4 class="text-h4 text-center mb-2" v-if="role_selected">
            Deleted Role : {{ role_selected.id }}
          </h4>
          <!-- <p class="text-sm-body-1 text-center">
            Supported payment methods
          </p> -->
        </div>
        <p v-if="role_selected">
          ¿Estas seguro de eliminar el ROL "{{ role_selected.name }}"?
        </p>
        <VAlert type="error" class="mt-3" v-if="error_exists">
          <strong>En el servidor hubo un error al guardar</strong>
        </VAlert>
        <VAlert type="warning" class="mt-3" v-if="success">
          <strong>{{ success }}</strong>
        </VAlert>
      </VCardText>
      <VCardText class="pa-5">
        <VBtn color="error" class="mb-4" @click="deleted()"> Eliminar </VBtn>
      </VCardText>
    </VCard>
  </VDialog>
</template>

<style lang="scss">
.refer-link-input {
  .v-field--appended {
    padding-inline-end: 0;
  }

  .v-field__append-inner {
    padding-block-start: 0.125rem;
  }
}
</style>
