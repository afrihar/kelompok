package id.dasawisma.kelompok.exception;

public class ApiRequestException extends RuntimeException {
  public ApiRequestException(String message) {
    super(message);
  }

  @SuppressWarnings("unused")
  public ApiRequestException(String message, Throwable cause) {
    super(message, cause);
  }
}