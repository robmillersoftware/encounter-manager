package com.rmiller;

import org.json.JSONObject;
import org.json.JSONException;
import android.util.Log;

public class NearbyPayload {
  public String payload;
  public String src;
  public String dest;
  public String type;

  public NearbyPayload(String payload, String src, String dest, String type) {
    this.payload = payload;
    this.src = src;
    this.dest = dest;
    this.type = type;
  }

  public String toJSON() {
    JSONObject obj = new JSONObject();

    try {
      obj.put("payload", this.payload);
      obj.put("src", this.src);
      obj.put("dest", this.dest);
      obj.put("type", this.type);
    } catch (JSONException e) {
      Log.d("NearbyPlugin", "Error converting NearbyPayload: " + e.getMessage());
    }

    return obj.toString();
  }
}
