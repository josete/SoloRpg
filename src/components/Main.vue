<script setup>
var emit = defineEmits(['newAdventure','loadAdventure'])
function newAdventure(){
    emit("newAdventure");
}
function loadAdventure(){
    emit("loadAdventure");
}
</script>
<template>
    <div id="mainWindow">
        <div class="">
            <button class="ui massive teal button" @click="newAdventure">Nueva aventura</button>
            <button class="ui massive teal button" @click="loadAdventure">Cargar aventura</button>
        </div>
    </div>
</template>