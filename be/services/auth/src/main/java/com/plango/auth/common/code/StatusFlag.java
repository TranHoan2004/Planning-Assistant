package  com.plango.auth.common.code;

import lombok.Getter;

@Getter
public enum StatusFlag {
    SUCCESS("success"),
    ERROR("error");

    private final String value;

    StatusFlag(String value) {
        this.value = value;
    }

}
