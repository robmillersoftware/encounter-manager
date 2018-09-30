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

    NearbyPayload payload = new NearbyPayload(discoveredEndpointInfo.getEndpointName(), endpointId, NearbyPayload.PayloadTypes.DISCOVERED);
    PluginResult result = new PluginResult(Status.OK, payload.toJSON());
    result.setKeepCallback(true);
    callback.sendPluginResult(result);
  }

  @Override
  public void onEndpointLost(String endpointId) {
    Log.d("NearbyPlugin", "Lost endpoint: " + endpointId);
    NearbyPayload payload = new NearbyPayload(null, endpointId, NearbyPayload.PayloadTypes.BROADCAST);
    PluginResult result = new PluginResult(Status.OK, payload.toJSON());
    result.setKeepCallback(true);
    callback.sendPluginResult(result);
  }
};
