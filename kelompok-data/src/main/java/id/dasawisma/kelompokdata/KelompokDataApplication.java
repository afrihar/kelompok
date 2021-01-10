package id.dasawisma.kelompokdata;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

@SpringBootApplication
public class KelompokDataApplication {
  public static void main(String[] args) {
    ConfigurableApplicationContext applicationContext = SpringApplication.run(KelompokDataApplication.class, args);
    int exitCode = SpringApplication.exit(applicationContext, () -> 0);
    System.exit(exitCode);
  }
}