package com.plango.auth.common.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class LogWrapper {
    private static final Logger logger = LoggerFactory.getLogger(LogWrapper.class);

    private LogWrapper() {
        // Private constructor to prevent instantiation
    }

    private static Logger getLogger() {
        StackTraceElement[] stackTraces = Thread.currentThread().getStackTrace();
        for (StackTraceElement stackTrace : stackTraces) {
            String className = stackTrace.getClassName();
            if (!className.equals(LogWrapper.class.getName()) && !className.equals(Thread.class.getName())) {
                return LoggerFactory.getLogger(className);
            }
        }
        return logger;
    }

    private static String format(String format, Object... values) {
        return String.format(format, values);
    }

    public static boolean isDebugEnabled() {
        return getLogger().isDebugEnabled();
    }

    public static void debug(String message) {
        getLogger().debug(message);
    }

    public static void debug(String format, Object... values) {
        debug(format(format, values));
    }

    public static void info(String message) {
        getLogger().info(message);
    }

    public static void info(String format, Object... values) {
        info(format(format, values));
    }

    public static void warn(String message) {
        getLogger().warn(message);
    }

    public static void warn(String format, Object... values) {
        warn(format(format, values));
    }

    public static void error(String message) {
        getLogger().error(message);
    }

    public static void error(String message, Throwable throwable) {
        getLogger().error(message, throwable);
    }

    public static void error(Throwable throwable) {
        getLogger().error(throwable.getMessage(), throwable);
    }
}
