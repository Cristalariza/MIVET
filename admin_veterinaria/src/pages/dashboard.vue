<template>
    <div>
        <VCard title="Dashboard para los indicadores gráficos" class="mb-6">
            <VCardText>
                Bienvenido al dashboard principal del sistema.
            </VCardText>
            <VCardText>
                <VBtn 
                    color="primary" 
                    @click="logout"
                    prepend-icon="ri-logout-box-line"
                >
                    Cerrar Sesión
                </VBtn>
            </VCardText>
        </VCard>

        <VRow>
            <VCol cols="12" md="6">
                <VCard title="Estadísticas Rápidas">
                    <VCardText>
                        Aquí puedes mostrar gráficos y estadísticas importantes.
                    </VCardText>
                </VCard>
            </VCol>
            <VCol cols="12" md="6">
                <VCard title="Accesos Rápidos">
                    <VCardText>
                        <VBtn 
                            to="/products" 
                            color="secondary" 
                            class="me-3"
                        >
                            Productos
                        </VBtn>
                        <VBtn 
                            to="/roles-y-permisos" 
                            color="info"
                        >
                            Roles y Permisos
                        </VBtn>
                    </VCardText>
                </VCard>
            </VCol>
        </VRow>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
    // Limpiar datos de autenticación
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Redirigir al login
    router.push('/login')
}

definePage({
  meta: {
    // Esta página requiere autenticación
  },
})
</script>