<script setup>
import { ref } from 'vue';
var emit = defineEmits(['loadAdventure'])
var adventureFile = ref(null);
function uploadFile(){
    let rawFile;
    const file = document.querySelector('input[type=file]').files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
        rawFile = reader.result;
        adventureFile.value = rawFile;
    }
    reader.readAsText(file);
}
function loadAdventure(){
    var loaded = JSON.parse(adventureFile.value);
    emit("loadAdventure",loaded);
}
</script>
<template>
    <div class="content" id="newAdventureWindow">            
        <div class="ui form">
            <div class="field">
                    <label>Aventura</label>
                    <input type="file" accept=".json" @change="uploadFile()">
                </div>            
            <button class="ui teal button" @click="loadAdventure">Cargar aventura</button>
        </div>
    </div>
</template>