<script setup>
import { ref } from 'vue';
import { summarizeMessage } from './functions';
import utf8 from 'utf8';
import download from 'downloadjs';
const props = defineProps(['optionsData']);
$(document).ready(function() {
    $('#actionSelector').dropdown();
    initIA();
});
var messages = [];
function initIA(){
    $("#adventureText").text("");    
    if(props.optionsData!=undefined && props.optionsData.messages==undefined){
        messages.push({role:"system",content:props.optionsData.masterPrompt});
        if(props.optionsData.settings.length==0){
            messages.push({role:"user",content:"Start the adventure"});
        }else{
            messages.push({role:"user",content:"Before start let me introduce the world for the adventure: "+props.optionsData.settings+" Now start the adventure, remember to speak in "+props.optionsData.language+", dont repeat the description of the world"});
        }
        sendToIA();
    }else if(props.optionsData!=undefined && props.optionsData.messages!=undefined){
        messages = props.optionsData.messages;
        var count = 0;
        for(var message of messages){
            if(message.role != "system"){
                if(count>0){
                    if(message.role == "assistant"){
                        $("#adventureText").append(message.content+"<br>");
                    }else{
                        var parts = message.content.split(";");
                        if(parts.length > 1){
                            if(parts[0] == "describe"){
                                $("#adventureText").append("<b>Describe: "+parts[1]+"</b><br>");
                            }else if(parts[0] == "say"){
                                $("#adventureText").append("<b>\""+parts[1]+"\"</b><br>");
                            }else if(parts[0] == "execute"){
                                $("#adventureText").append("<b>"+parts[2]+" ("+parts[1]+")</b><br>");
                            }
                        }else{
                            $("#adventureText").append("<b>"+message.content+"</b><br>");
                        }
                    }
                }
                count++;
            }
        }
    }
}
var action = ref("");
var actionSuccess = ref("");
var messageToSay = ref("");
var messageToSend = ref("");
var describeMessage = ref("");
function setActionSuccess(success){
    actionSuccess.value = success;
}
function executeAction(){
    messages.push({role:"user",content:"execute;"+actionSuccess.value+";"+action.value});
    $("#adventureText").append("<br><b>"+action.value+" ("+actionSuccess.value+")</b><br>");
    sendToIA();
}
function say(){
    messages.push({role:"user",content:"say;"+messageToSay.value});
    $("#adventureText").append("<br><b>\""+messageToSay.value+"\"</b><br>");
    sendToIA();
}
function describe(){
    messages.push({role:"user",content:"describe;"+describeMessage.value});
    $("#adventureText").append("<br><b>Describe: "+describeMessage.value+"</b><br>");
    sendToIA();
}
function sendMessage(){
    messages.push({role:"user",content:messageToSend.value});
    $("#adventureText").append("<br><b>"+messageToSend.value+"</b><br>");
    sendToIA();
}
async function sendToIA(){
    var message = "";
    $("#adventureTextDiv").addClass("loading");
    messages = await summarizeMessage(messages,props.optionsData.language);
    $.ajax({
        type: "post",
        contentType: "application/json",
        url: props.optionsData.url, 
        crossDomain: true,
        data:JSON.stringify({
            model:props.optionsData.model,
            messages: messages,
            "options":{
                "temperature": 0.7,
                "num_ctx": 4096
            }
    }),
    xhr: function(){
        var xhr = new XMLHttpRequest();
        xhr.onprogress = function(event) {
            if (event.currentTarget.responseText) {
                $("#adventureTextDiv").removeClass("loading");
                var partialResponse = event.currentTarget.responseText;
                var lines = partialResponse.split('\n');
                try{                    
                    var parsedData = JSON.parse(lines[lines.length-2]);       
                    $("#adventureText").append(parsedData.message.content);
                    message += parsedData.message.content;
                }catch(error){
                    console.log(lines);
                }
            }   
        }
        return xhr;
    },
    success: function(result){
        messages.push({role:"assistant",content:message});        
    }});
}
function saveAdventure(){
    var adventureData = {url:props.optionsData.url,model:props.optionsData.model,language:props.optionsData.language}
    var messagesUTF8 = []
    for(var message of messages){
        var obj = {role:message.role}
        var content = utf8.encode(message.content);
        obj["content"] = content;
        messagesUTF8.push(obj);
    }
    adventureData['messages']=messagesUTF8;
    download(JSON.stringify(adventureData), "Adventure.json", "application/json");
}
</script>
<template>
    <div id="adventureWindow" class="content">
        <div class="ui form actionsForm">
            <div class="fields">
                <div class="six wide field">
                    <input type="text" v-model="action" placeholder="Acción a ejecutar">
                </div>        
                <div class="two wide field">
                    <div class="ui selection dropdown" id="actionSelector">
                        <input type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Ejecución</div>
                        <div class="menu">
                            <div class="item" @click="setActionSuccess('excellent')">Excelente</div>
                            <div class="item" @click="setActionSuccess('good')">Bien</div>
                            <div class="item" @click="setActionSuccess('bad')">Mal</div>
                            <div class="item" @click="setActionSuccess('fatal')">Fatal</div>
                        </div>
                    </div>
                </div>        
                <div class="two wide field">                        
                    <button class="ui button" @click="executeAction">Ejecutar</button>
                </div>
            </div>            
            <div class="fields">
                <div class="six wide field">
                    <input type="text" v-model="messageToSay" placeholder="Algo para decir">
                </div>                
                <div class="two wide field">                        
                    <button class="ui button" @click="say">Decir</button>
                </div>
            </div>
            <div class="fields">
                <div class="six wide field">
                    <input type="text" v-model="describeMessage" placeholder="Describeme algo">
                </div>                
                <div class="two wide field">                        
                    <button class="ui button" @click="describe">Describir</button>
                </div>
            </div>
            <div class="fields">
                <div class="six wide field">
                    <input type="text" v-model="messageToSend" placeholder="Hacer cualquier otra cosa">
                </div>                
                <div class="two wide field">                        
                    <button class="ui button" @click="sendMessage">Enviar</button>
                </div>
            </div>
            <button class="ui teal button" @click="saveAdventure">Guardar partida</button>
            <div class="ui divider"></div>            
        </div>
        <div class="ui scrolling basic segment" id="adventureTextDiv">
            <p id="adventureText"></p>
        </div>
    </div>
</template>