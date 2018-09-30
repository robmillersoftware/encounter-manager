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

  /**
  * Sets the callback to be exeuted when a new connection is made
  */
  public void setHandler(CallbackContext cb) {
    this.callback = cb;
  }

  @Override
  public void onConnectionInitiated(String endpointId, ConnectionInfo connectionInfo) {
    Log.d("NearbyPlugin", "Connection initiated from endpoint: " + endpointId + ", name: "
      + connectionInfo.getEndpointName() + ", auth: " + connectionInfo.getAuthenticationToken()
      + ", isIncoming: " + connectionInfo.isIncomingConnection());

    this.connectionsClient.acceptConnection(connectionInfo.getEndpointName(), payloadCallback);

    NearbyPayload connection = new NearbyPayload(null, endpointId, NearbyPayload.PayloadTypes.JOIN);
    PluginResult result = new PluginResult(Status.OK, connection.toJSON());
    result.setKeepCallback(true);
    this.callback.sendPluginResult(result);
  }

  @Override
  public void onConnectionResult(String endpointId, ConnectionResolution resolution) {
    PluginResult result;

    switch(resolution.getStatus().getStatusCode()) {
      case ConnectionsStatusCodes.STATUS_OK:
        Log.d("NearbyPlugin", "Connection to endpoint " + endpointId + " was successful.");
        break;
      case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
        Log.d("NearbyPlugin", "Connection rejected");
        break;
      case ConnectionsStatusCodes.STATUS_ERROR:
        Log.d("NearbyPlugin", "There was an error connecting to endpoint " + endpointId);
        result = new PluginResult(Status.OK, "remove");
        this.callback.sendPluginResult(result);
        break;
      case ConnectionsStatusCodes.STATUS_ALREADY_CONNECTED_TO_ENDPOINT:
        Log.d("NearbyPlugin", "Already connected to endpoint " + endpointId);
        result = new PluginResult(Status.OK, "keep");
        this.callback.sendPluginResult(result);
        break;
    }
  }

  @Override
  public void onDisconnected(String endpointId) {
    Log.d("NearbyPlugin", "Disconnected from endpoint: " + endpointId);
    NearbyPayload payload = new NearbyPayload(null, endpointId, NearbyPayload.PayloadTypes.LEAVE);
    PluginResult result = new PluginResult(Status.OK, payload.toJSON());
    this.callback.sendPluginResult(result);
  }
};
