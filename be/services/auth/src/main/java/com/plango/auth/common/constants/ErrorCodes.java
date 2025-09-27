package com.plango.auth.common.constants;

public class ErrorCodes {
    /**
     * An unexpected error occurred
     */
    public static final String COM_001 = "COM_001";
    /**
     * Method not allowed
     */
    public static final String COM_002 = "COM_002";
    /**
     * Data not found
     */
    public static final String COM_003 = "COM_003";
    /**
     * Validation error
     */
    public static final String COM_004 = "COM_004";
    /**
     * Resource not found
     */
    public static final String COM_005 = "COM_005";
    /**
     * Duplicated data
     */
    public static final String COM_006 = "COM_006";

    // Authentication error codes
    /**
     * Email or password is incorrect
     */
    public static final String AUT_001 = "AUT_001";
    /**
     * Invalid token
     */
    public static final String AUT_002 = "AUT_002";
    /**
     * Token has expired
     */
    public static final String AUT_003 = "AUT_003";
    /**
     * User does not have permission
     */
    public static final String AUT_004 = "AUT_004";

    /**
     * User with the given email already exists (registration error)
     */
    public static final String REG_001 = "REG_001";
}
