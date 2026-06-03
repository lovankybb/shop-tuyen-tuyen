package com.washinggod.tuyenshop.util;

import java.util.Map;

public interface SignatureService {

    public String buildQuery(Map<String, String> params);

    public String hmacSHA512(String key, String data);

    public String hmacSHA256(String key, String data);

    public String buildHashData(Map<String, String> params);
}
