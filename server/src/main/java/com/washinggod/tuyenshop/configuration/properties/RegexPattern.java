package com.washinggod.tuyenshop.configuration.properties;
import java.util.regex.Pattern;

public class RegexPattern {
    public static final Pattern PASSWORD_REGEX =
            Pattern.compile(
                    "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#+-~])[A-Za-z\\d@$!%*?&#+-~]{8,}$");
    public static final Pattern USERNAME_REGEX = Pattern.compile("^[a-z0-9]+$");
}