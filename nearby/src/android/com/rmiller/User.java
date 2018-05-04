package com.rmiller;

import android.arch.persistence.room.Entity;
import android.arch.persistence.room.ColumnInfo;
import android.arch.persistence.room.PrimaryKey;
import android.support.annotation.NonNull;
import android.util.Log;
import org.json.JSONObject;
import org.json.JSONException;

@Entity
public class User {
  @PrimaryKey
  @NonNull
  @ColumnInfo(name = "uuid")
  private String uuid;

  @ColumnInfo(name = "username")
  private String username;

  @ColumnInfo(name = "endpoint_id")
  private String endpointId;

  public void setUuid(String id) {
    this.uuid = id;
  }

  public String getUuid() {
    return this.uuid;
  }

  public void setUsername(String name) {
    this.username = name;
  }

  public String getUsername() {
    return this.username;
  }

  public void setEndpointId(String id) {
    this.endpointId = id;
  }

  public String getEndpointId() {
    return this.endpointId;
  }

  public String getIdentifierJson() {
    JSONObject rtn = new JSONObject();

    try {
      rtn.put("n", this.username);
      rtn.put("i", this.uuid);
      rtn.put("e", this.endpointId);
    } catch (JSONException e) {
      Log.d("NearbyPlugin", "Error creating JSON identifier: " + e.getMessage());
    }

    return rtn.toString();
  }

  public void parseIdentifierJson(String json) {
    try {
      JSONObject identifier = new JSONObject(json);
      this.uuid = identifier.getString("i");
      this.username = identifier.getString("n");
      this.endpointId = identifier.getString("e");
    } catch (JSONException e) {
      Log.d("NearbyPlugin", "Error parsing JSON identifier = " + json + ". Error is: " + e.getMessage());
    }
  }
}
