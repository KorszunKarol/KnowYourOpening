package chess_debiut.opening;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

public class OpeningSerializer extends JsonSerializer<Opening> {

    @Override
    public void serialize(Opening opening, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException {
        jsonGenerator.writeStartObject();
        jsonGenerator.writeNumberField("id", opening.getId());
        jsonGenerator.writeStringField("name", opening.getName());
        jsonGenerator.writeStringField("moveSequence", opening.getMoveSequence());
        jsonGenerator.writeStringField("description", opening.getDescription());
        jsonGenerator.writeStringField("playerSide", opening.getPlayerSide());
        String formattedDate = opening.getCreationDate().format(DateTimeFormatter.ISO_LOCAL_DATE);
        jsonGenerator.writeStringField("creationDate", formattedDate);
        jsonGenerator.writeStringField("createdBy", opening.getCreatedBy().getUsername());

        jsonGenerator.writeEndObject();
    }
}
