import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { AIMessage,HumanMessage,SystemMessage } from "@langchain/core/messages";

const ollamaLlm = new ChatOllama({
    baseUrl: "http://localhost:11434", // Default value
    model: "mymodel",
    numCtx: 4096
});

export async function summarizeMessage(messages,language){
    var messagesReturn = []
    for(const message of messages){
        if(message.content.length > 4000 && message.role!="system"){
            var content = await summarize(message.content,language)
            messagesReturn.push({role:message.role,content:content});
        }else{
            messagesReturn.push(message);
        }
    }
    return messagesReturn;
}

async function summarize(text,language){
    var res = await ollamaLlm.invoke([
        new SystemMessage({ content:"Extract the information about places, people, bands, groups or past events, write it in "+language+" return just the importants parts do not include anything by your own." }),
        new HumanMessage({ content: "Summarize this text: "+text }),
      ]);  
    return res.content;
}