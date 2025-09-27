package com.plango.auth.controller;

import java.io.File;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LogController {

    @Value("${logging.file.path:logs}")
    private String logDirectory;

    private static final String LOG_FILE_PATH = "logs/application.log";
    private static final int CHAR_COUNT = 200000;

    @GetMapping("/")
    public String index() {
        return "index";
    }

    @GetMapping(value = "/api/log", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> getLatestLogSnippet() {
        File logFile = new File(LOG_FILE_PATH);
        if (!logFile.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Log file not found.");
        }

        try (RandomAccessFile raf = new RandomAccessFile(logFile, "r")) {
            long fileLength = raf.length();
            int readSize = (int) Math.min(CHAR_COUNT, fileLength);

            // Position the pointer to read the last 'readSize' characters
            raf.seek(fileLength - readSize);

            byte[] bytes = new byte[readSize];
            raf.readFully(bytes);

            String logSnippet = new String(bytes, StandardCharsets.UTF_8);
            return ResponseEntity.ok(logSnippet);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error reading log file: " + e.getMessage());
        }
    }
}
