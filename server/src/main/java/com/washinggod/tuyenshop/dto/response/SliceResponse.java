package com.washinggod.tuyenshop.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SliceResponse<T> {
    List<T> data;
    boolean hasNext;
    int pageSize;
}

