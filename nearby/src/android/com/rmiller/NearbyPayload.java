package com.rmiller;

import org.json.JSONObject;
import org.json.JSONException;
import android.util.Log;

public class NearbyPayload {
  public enum PayloadTypes {
    MESSAGE,
    JOIN,
    LEAVE,
    BROADCAST,
    DISCOVERED
  };

  public String message;
  public String src;
  public String dest;
  public PayloadTypes type;

  public NearbyPayload(String message, String src, PayloadTypes type) {
    this.message = message;
    this.src = src;
    this.type = type;
  }

  public String toJSON() {
    JSONObject obj = new JSONObject();

    try {
        obj.put("message", this.message);
        obj.put("source", this.src);
        obj.put("type", this.type.toString());
    } catch (JSONException e) {
      Log.d("NearbyPlugin", "Error converting NearbyPayload: " + e.getMessage());
    }

    return obj.toString();
  }
}
