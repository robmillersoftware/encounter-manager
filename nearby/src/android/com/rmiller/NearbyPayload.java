package com.rmiller;

import org.json.JSONObject;
import org.json.JSONException;
import android.util.Log;

public class NearbyPayload {
  public enum PayloadTypes {
    MESSAGE(0),
    JOIN(1),
    LEAVE(2),
    BROADCAST(3),
    DISCOVERED(4),
    SYNC(5),
    CONNECTED(6);

    private Integer value;

    private PayloadTypes(Integer value) {
      this.value = value;
    }

    public Integer getValue() {
      return this.value;
    }
  }

  public final PayloadTypes[] payloadTypes = PayloadTypes.values();

  public String message;
  public String source;
  public String dest;
  public Integer type;

  public NearbyPayload(String json) {
    try {
      JSONObject obj = new JSONObject(json);
      this.message = obj.has("message") ? obj.getString("message") : null;
      this.source = obj.has("source") ? obj.getString("source") : null;
      this.dest = obj.has("dest") ? obj.getString("dest") : null;
      this.type = obj.has("type") ? obj.getInt("type"): null;
    } catch (JSONException e) {
      Log.e("NearbyPlugin", "Error creating NearbyPayload from json: " + e.getMessage());
    }
  }

  public NearbyPayload(String message, String source, PayloadTypes type) {
    this.message = message;
    this.source = source;
    this.type = type.getValue();
  }

  public String toJSON() {
    JSONObject obj = new JSONObject();

    try {
        obj.put("message", this.message);
        obj.put("source", this.source);
        obj.put("type", this.type);
    } catch (JSONException e) {
      Log.d("NearbyPlugin", "Error converting NearbyPayload: " + e.getMessage());
    }

    return obj.toString();
  }
}
