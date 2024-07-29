package chess_debiut.user_opening;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class UserOpeningSerializer extends JsonSerializer<UserOpening> {
    @Override
    public void serialize(UserOpening userOpening, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("opening", userOpening.getOpening().getId());
        jsonGenerator.writeNumberField("correct", userOpening.getCorrect());
        jsonGenerator.writeNumberField("incorrect", userOpening.getIncorrect());
        long daysBetween = ChronoUnit.DAYS.between(userOpening.getLastTrained(), LocalDate.now());
        jsonGenerator.writeNumberField("lastTrained", daysBetween);
        jsonGenerator.writeEndObject();
    }
}
