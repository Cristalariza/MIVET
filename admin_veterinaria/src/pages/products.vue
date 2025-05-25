<template>
    <div>
      <VRow>
        <VCol
          sm="6"
          cols="12"
        >
          <VCard title="Nueva vista 🙌">
            <div class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row">
              <div
                  class="ma-auto pa-5 border-e"
              >
                <VImg
                  width="137"
                  height="176"
                  src="https://demos.pixinvent.com/materialize-vuejs-admin-template/demo-1/assets/2-xjy_pXoW.png"
                />
              </div>
              <div>
                <VCardItem>
                  <VCardTitle>Apple iPhone 11 Pro</VCardTitle>
                </VCardItem>
        
                <VCardText>
                  Apple iPhone 11 Pro smartphone. Announced Sep 2019. Features 5.8″ display Apple A13 Bionic
                </VCardText>
              </div>
            </div>
          </VCard>
        </VCol>

        <VCol
          sm="6"
          cols="12"
        >
          <VCard class="px-4 py-4">
            <VRow>
              <VCol
                cols="12"
              >
                  <VTextField
                    label="Regular"
                    placeholder="Placeholder Text"
                  />
              </VCol>

              <VCol
                cols="12"
              >
                <VTextarea
                  label="Default"
                  placeholder="Placeholder Text"
                />
              </VCol>

              <VCol
                cols="12"
              >
                <VSelect
                  :items="items"
                  label="Standard"
                  placeholder="Select Item"
                  eager
                />
              </VCol>
              <VCol
                cols="12"
              >
              <VBtn color="primary">
                Primary
              </VBtn>
            </VCol>
            </VRow>
          </VCard>
        </VCol>
      </VRow>

    </div>
</template>
<script setup>

const items = [
  'Foo',
  'Bar',
  'Fizz',
  'Buzz',
]

// definePage({
//   meta: {
//     not_autenticacion: false,
//   },
// })
</script>