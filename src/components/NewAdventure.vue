<script setup>
import { ref } from 'vue';
var emit = defineEmits(['createAdventure'])
var settings = ref("");
var language = ref("");
var ip = ref("");
var model = ref("");
function createAdventure(){
    emit("createAdventure",settings.value,language.value,ip.value,model.value)
}
</script>
<template>
    <div class="content" id="newAdventureWindow">            
        <div class="ui form">
            <div class="field">
                <label>Settings:</label>
                <textarea v-model="settings"></textarea>
            </div>
            <div class="field">
                <label>Idioma:</label>
                <input type="text" v-model="language">
            </div>
            <div class="ui horizontal divider">Configuración de la IA</div>
            <div class="field">
                <label>Ip servidor IA:</label>
                <input type="text" v-model="ip">
            </div>
            <div class="field">
                <label>Modelo:</label>
                <input type="text" v-model="model">
            </div>
            <button class="ui teal button" @click="createAdventure">Empezar aventura</button>
        </div>
    </div>
</template>