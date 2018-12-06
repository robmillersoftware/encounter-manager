package com.rmiller;

import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONObject;
import org.json.JSONException;
import android.util.Log;
import org.apache.cordova.CallbackContext;
import android.support.v4.content.LocalBroadcastManager;
import android.content.Intent;
import android.content.Context;
import android.os.Bundle;

public class NearbyConnectionLifecycleCb extends ConnectionLifecycleCallback {
  private final NearbyPayloadCb payloadCallback;
  private ConnectionsClient connectionsClient;
  private CallbackContext callback;
  private Context context;

  public NearbyConnectionLifecycleCb(Context context, ConnectionsClient client) {
    this.connectionsClient = client;
    this.context = context;
    payloadCallback = new NearbyPayloadCb(context);
  }

  /**
  * Sets the callback to be exeuted when a new connection is made
  */
  public void setCallback(CallbackContext cb) {
    this.callback = cb;
  }

  @Override
  public void onConnectionInitiated(String endpointId, ConnectionInfo connectionInfo) {
    Log.d("NearbyPlugin", "Connection initiated from endpoint: " + endpointId + ", name: "
      + connectionInfo.getEndpointName() + ", auth: " + connectionInfo.getAuthenticationToken()
      + ", isIncoming: " + connectionInfo.isIncomingConnection());

    this.connectionsClient.acceptConnection(endpointId, payloadCallback);

    NearbyPayload payload = new NearbyPayload(null, endpointId, NearbyPayload.PayloadTypes.JOIN);
    /*PluginResult result = new PluginResult(Status.OK, payload.toJSON());
    result.setKeepCallback(true);

    this.callback.sendPluginResult(result);*/
    final Intent intent = new Intent("connection");
    Bundle b = new Bundle();
    b.putString("payload", payload.toJSON());
    intent.putExtras(b);

    LocalBroadcastManager.getInstance(this.context).sendBroadcastSync(intent);
  }

  @Override
  public void onConnectionResult(String endpointId, ConnectionResolution resolution) {
    final Intent intent = new Intent("connection");
    Bundle b = new Bundle();
    NearbyPayload payload = null;

    switch(resolution.getStatus().getStatusCode()) {
      case ConnectionsStatusCodes.STATUS_OK:
        Log.d("NearbyPlugin", "Connection to endpoint " + endpointId + " was successful.");
        payload = new NearbyPayload(null, endpointId, NearbyPayload.PayloadTypes.CONNECTED);
        /*result = new PluginResult(Status.OK, payload.toJSON());
        result.setKeepCallback(true);
        this.callback.sendPluginResult(result);*/
        break;
      case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
        Log.d("NearbyPlugin", "Connection rejected");
        return;
      case ConnectionsStatusCodes.STATUS_ERROR:
        Log.d("NearbyPlugin", "There was an error connecting to endpoint " + endpointId);
        /*result = new PluginResult(Status.OK, "remove");
        result.setKeepCallback(true);
        this.callback.sendPluginResult(result);*/
        break;
      case ConnectionsStatusCodes.STATUS_ALREADY_CONNECTED_TO_ENDPOINT:
        Log.d("NearbyPlugin", "Already connected to endpoint " + endpointId);
        /*result = new PluginResult(Status.OK, "keep");
        result.setKeepCallback(true);
        this.callback.sendPluginResult(result);*/
        break;
    }

    if (payload != null) {
      b.putString("payload", payload.toJSON());
      intent.putExtras(b);

      LocalBroadcastManager.getInstance(this.context).sendBroadcastSync(intent);
    }
  }

  @Override
  public void onDisconnected(String endpointId) {
    Log.d("NearbyPlugin", "Disconnected from endpoint: " + endpointId);
    NearbyPayload payload = new NearbyPayload(null, endpointId, NearbyPayload.PayloadTypes.LEAVE);
    /*PluginResult result = new PluginResult(Status.OK, payload.toJSON());
    result.setKeepCallback(true);

    this.callback.sendPluginResult(result);*/
    final Intent intent = new Intent("connection");
    Bundle b = new Bundle();
    b.putString("payload", payload.toJSON());
    intent.putExtras(b);
    LocalBroadcastManager.getInstance(this.context).sendBroadcastSync(intent);
  }
};
