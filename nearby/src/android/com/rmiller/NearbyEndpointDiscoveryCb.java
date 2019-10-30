package com.rmiller;

import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.apache.cordova.CordovaWebView;
import org.json.JSONObject;
import org.json.JSONException;
import android.util.Log;
import java.util.Iterator;
import org.apache.cordova.CallbackContext;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.content.LocalBroadcastManager;

public class NearbyEndpointDiscoveryCb extends EndpointDiscoveryCallback {
  private CallbackContext callback;
  private Context context;

  public NearbyEndpointDiscoveryCb(Context context) {
    this.context = context;
  }

  /**
  * Sets the callback to be executed when a new endpoint is discovered
  */
  public void setCallback(CallbackContext cb) {
    this.callback = cb;
  }

  @Override
  public void onEndpointFound(String endpointId, DiscoveredEndpointInfo discoveredEndpointInfo) {
    Log.d("NearbyPlugin", "Discovered endpoint: " + endpointId + ", name: " + discoveredEndpointInfo.getEndpointName()
      + ", service: " + discoveredEndpointInfo.getServiceId());

    NearbyPayload payload = new NearbyPayload(discoveredEndpointInfo.getEndpointName(), endpointId, NearbyPayload.PayloadTypes.DISCOVERED);
    /*PluginResult result = new PluginResult(Status.OK, payload.toJSON());
    result.setKeepCallback(true);

    this.callback.sendPluginResult(result);*/
    final Intent intent = new Intent("discovery");
    Bundle b = new Bundle();
    b.putString("detail", payload.toJSON());
    intent.putExtras(b);
    LocalBroadcastManager.getInstance(this.context).sendBroadcastSync(intent);
  }

  @Override
  public void onEndpointLost(String endpointId) {
    Log.d("NearbyPlugin", "Lost endpoint: " + endpointId);
    NearbyPayload payload = new NearbyPayload(null, endpointId, NearbyPayload.PayloadTypes.BROADCAST);
    /*PluginResult result = new PluginResult(Status.OK, payload.toJSON());
    result.setKeepCallback(true);

    this.callback.sendPluginResult(result);*/
    final Intent intent = new Intent("connection");
    Bundle b = new Bundle();
    b.putString("detail", payload.toJSON());
    intent.putExtras(b);
    LocalBroadcastManager.getInstance(this.context).sendBroadcastSync(intent);
  }
};
