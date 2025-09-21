package com.example.Email_writer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;
import java.util.Objects;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;
    @Value("${gemini.api.url}")
    private String geminiApiurl;

    @Value("${gemini.api.key}")
    private String geminiApikey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailReq){
        //Build the prompt(input to backend gemini API)
        String prompt = buildPrompt(emailReq);

        //craft a req(req is supposed to be in certain format)
        Map<String, Object> requestBody = Map.of("contents",new Object[]{
                Map.of("parts",new Object[]{
                    Map.of("text",prompt)
                })
        });

        //Do req and get response(making an api call we are using webClient-way to do api req )
        String response = webClient.post()
                .uri(geminiApiurl + "?key=" + geminiApikey)   // attach API key here
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();


        // Extract and return the response
        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try{
            ObjectMapper mapper = new ObjectMapper();//tool from jackson library helps workign with json data
                                                    //it converts json data to java object and vice versa
            JsonNode rootNode = mapper.readTree(response);//readTree converts the json response into tree like
                                                    // structure and it represented as JsonNode and using rootNode we can traverse through tree
            return rootNode.path("candidates").get(0)
                    .path("content")
                    .path("parts").get(0)
                    .path("text")
                    .asText();
        }
        catch (Exception e){
            return "Error proccesing process: "+ e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailReq) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a professional email reply for the following email content. Please don't add the subject line.");
        if(emailReq.getTone()!=null && !emailReq.getTone().isEmpty()){
            prompt.append("Use a ").append(emailReq.getTone()).append(" tone.");
        }
        prompt.append("\nOriginal email: \n").append(emailReq.getContent());
        return prompt.toString();
    }
}
