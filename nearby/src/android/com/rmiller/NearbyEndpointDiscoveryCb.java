package com.rmiller;

import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONObject;
import org.json.JSONException;
import android.util.Log;
import java.util.Iterator;
import org.apache.cordova.CallbackContext;

public class NearbyEndpointDiscoveryCb extends EndpointDiscoveryCallback {
  private CallbackContext callback;
  private String identifier;

  /**
  * Sets the callback to be executed when a new endpoint is discovered
  */
  public void setHandler(CallbackContext cb) {
    this.callback = cb;
  }

  @Override
  public void onEndpointFound(String endpointId, DiscoveredEndpointInfo discoveredEndpointInfo) {
    Log.d("NearbyPlugin", "Discovered endpoint: " + endpointId + ", name: " + discoveredEndpointInfo.getEndpointName()
      + ", service: " + discoveredEndpointInfo.getServiceId());

    JSONObject payloadJson = null;
    JSONObject idJson = null;

    try {
      JSONObject endpointJson = new JSONObject(discoveredEndpointInfo.getEndpointName());
      Iterator<String> keys = endpointJson.keys();

      while( keys.hasNext() ) {
        String id = keys.next();
        String value = endpointJson.getString(id);

        idJson = new JSONObject(id);
        idJson.put("e", endpointId);

        payloadJson = new JSONObject();
        payloadJson.put(id, value);
      }
    } catch(JSONException e) {
      Log.d("NearbyPlugin", "Error getting identifier from endpoint: " + e.getMessage());
    }

    if (idJson == null) {
      Log.e("NearbyPlugin", "Unable to parse remote identifier from key: " + payloadJson.toString());
    } else {
      NearbyPayload payload = new NearbyPayload(payloadJson.toString(),
        idJson.toString(), this.identifier, "CAMPAIGN");

      PluginResult result = new PluginResult(Status.OK, payload.toJSON());
      result.setKeepCallback(true);
      callback.sendPluginResult(result);
    }
  }

  @Override
  public void onEndpointLost(String endpointId) {
    Log.d("NearbyPlugin", "Lost endpoint: " + endpointId);
  }
};
