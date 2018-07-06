package com.rmiller;

import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONObject;
import org.json.JSONException;
import android.util.Log;
import org.apache.cordova.CallbackContext;

public class NearbyConnectionLifecycleCb extends ConnectionLifecycleCallback {
  private final NearbyPayloadCb payloadCallback = new NearbyPayloadCb();
  private ConnectionsClient connectionsClient;
  private CallbackContext callback;

  public NearbyConnectionLifecycleCb(ConnectionsClient client) {
    this.connectionsClient = client;
  }

  public void setCallbackContext(CallbackContext cb) {
    this.callback = cb;
  }

  @Override
  public void onConnectionInitiated(String endpointId, ConnectionInfo connectionInfo) {
    Log.d("NearbyPlugin", "Connection initiated from endpoint: " + endpointId + ", name: "
      + connectionInfo.getEndpointName() + ", auth: " + connectionInfo.getAuthenticationToken()
      + ", isIncoming: " + connectionInfo.isIncomingConnection());

    try {
      this.connectionsClient.acceptConnection(connectionInfo.getEndpointName(), payloadCallback);

      JSONObject user = new JSONObject(connectionInfo.getEndpointName());
      user.put("e", endpointId);
      PluginResult result = new PluginResult(Status.OK, user);
      result.setKeepCallback(true);
      this.callback.sendPluginResult(result);
    } catch (JSONException ex) {
      Log.e("NearbyPlugin", "JSON Exception: " + ex.getMessage());
    }
  }

  @Override
  public void onConnectionResult(String endpointId, ConnectionResolution resolution) {
    switch(resolution.getStatus().getStatusCode()) {
      case ConnectionsStatusCodes.STATUS_OK:
        Log.d("NearbyPlugin", "Connection to endpoint " + endpointId + " was successful.");
        break;
      case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
        Log.d("NearbyPlugin", "Connection rejected");
        break;
      case ConnectionsStatusCodes.STATUS_ERROR:
        Log.d("NearbyPlugin", "There was an error connecting to endpoint " + endpointId);
        break;
    }
  }

  @Override
  public void onDisconnected(String endpointId) {
    Log.d("NearbyPlugin", "Disconnected from endpoint: " + endpointId);
  }
};
