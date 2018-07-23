package com.gorhaf.it.controller;

import com.gorhaf.it.entities.UserInfo;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.websocket.server.PathParam;
import java.io.FileInputStream;
import java.io.InputStream;
import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class PermissionInfoController {

    @GetMapping("/users")
    public List<UserInfo> userInfos(@PathParam("name") String name) {
        System.out.println(name);
        System.out.println("call userInfos");
        List<UserInfo> result = new ArrayList<>();
        int size = StringUtils.isEmpty(name) ? 10 : 3;
        for (int i = 0; i < size; i++) {
            UserInfo userInfo = new UserInfo();
            userInfo.setId(BigInteger.valueOf(i));
            userInfo.setGmtCreate(Timestamp.from(Instant.now()));
            userInfo.setGmtModified(Timestamp.from(Instant.now()));
            userInfo.setUserName("Tom" + i);
            userInfo.setPassword("123456");
            result.add(userInfo);
        }
        return result;
    }

    @PostMapping("/userInfo")
    public UserInfo save(@RequestBody UserInfo userInfo) {
        System.out.println("call save");
        userInfo.setId(BigInteger.valueOf(10));
        System.out.println(userInfo);
        return userInfo;
    }

    @DeleteMapping("/userInfo/{id}")
    public Map<String, Object> delete(@PathVariable("id") BigInteger id) {
        System.out.println("call delete");
        System.out.println(id);
        Map<String, Object> result = new HashMap<>();
        result.put("status", "ok");
        return result;
    }

    @PutMapping("/userInfo")
    public UserInfo update(@RequestBody UserInfo userInfo) {
        System.out.println("call update");
        System.out.println(userInfo);
        userInfo.setGmtModified(Timestamp.from(Instant.now()));
        userInfo.setUserName("update");
        userInfo.setPassword("666666");
        return userInfo;
    }

    /**
     * 简易下载
     *
     * @return 回显结果
     */
    @GetMapping("/download")
    public ResponseEntity<byte[]> download() {
        InputStream in;
        ResponseEntity<byte[]> re = null;
        try {
            in = new FileInputStream(new ClassPathResource("static/abc.txt").getFile());
            byte[] body = new byte[in.available()];
            in.read(body);
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment;filename=abc.txt");
            HttpStatus status = HttpStatus.OK;
            re = new ResponseEntity<>(body, headers, status);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return re;
    }

    @PostMapping("/upload/file")
    public Map<String, Object> uploadFile(@RequestParam("file") MultipartFile file) {
        System.out.println("fileName: " + file.getOriginalFilename());
        Map<String, Object> result = new HashMap<>();
        result.put("ok", true);
        return result;
    }

}
