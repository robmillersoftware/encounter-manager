package com.rmiller;

import org.json.JSONObject;
import org.json.JSONException;
import android.util.Log;

public class NearbyPayload {
  public enum PayloadTypes {
    MESSAGE,
    JOIN,
    LEAVE,
    ROUTING,
    BROADCAST,
    DISCOVERED
  };

  public String message;
  public String src;
  public String dest;
  public String type;

  public NearbyPayload(String message, String src, String dest, int type) {
    this.message = message;
    this.src = src;
    this.dest = dest;
    this.type = type;
  }

  public String toJSON() {
    JSONObject obj = new JSONObject();

    try {
      if (this.type != PayloadTypes.BROADCAST) {
        obj.put("message", this.message);
        obj.put("src", this.src);
        obj.put("dest", this.dest);
        obj.put("type", this.type);
      } else {
        obj.put("m", this.message);
        obj.put("s", this.src);
        obj.put("type", this.type);
      }
    } catch (JSONException e) {
      Log.d("NearbyPlugin", "Error converting NearbyPayload: " + e.getMessage());
    }

    return obj.toString();
  }

  public JSONObject toPluginResult() {
    JSONObject rtn = new JSONObject();

    try {
      obj.put("message", this.message);
      obj.put("src", this.src);
      obj.put("dest", this.dest);
      obj.put("type", this.type);
    } catch (JSONException e) {
      Log.d("NearbyPlugin", "Error creating JSONObject: " + e.getMessage());
    }

    return rtn;
  }
}
