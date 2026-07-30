package com.musiccatalog.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        for (HttpMessageConverter<?> converter : restTemplate.getMessageConverters()) {
            if (converter instanceof MappingJackson2HttpMessageConverter jsonConverter) {
                List<MediaType> supportedMediaTypes = new ArrayList<>(jsonConverter.getSupportedMediaTypes());
                supportedMediaTypes.add(MediaType.valueOf("text/javascript;charset=utf-8"));
                supportedMediaTypes.add(MediaType.valueOf("text/javascript"));
                supportedMediaTypes.add(MediaType.valueOf("application/javascript"));
                jsonConverter.setSupportedMediaTypes(supportedMediaTypes);
            }
        }
        return restTemplate;
    }
}
