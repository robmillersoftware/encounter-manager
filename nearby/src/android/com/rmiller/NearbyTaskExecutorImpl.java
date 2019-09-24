package com.rmiller;

import android.util.Log;
import java.util.List;
import java.io.UnsupportedEncodingException;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.Strategy;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.OnFailureListener;
import android.content.Context;

public class NearbyTaskExecutorImpl implements NearbyTaskExecutor {
  //This is a string that uniquely identifies the application as a whole. This allows users of an
  //application find each other
  protected String serviceId;
  protected ConnectionsClient connectionsClient;

  //This callback is executed when there is a change to a connection
  private NearbyConnectionLifecycleCb connectionLifecycleCallback;

  //This callback is executed when a new endpoint is discovered
  private NearbyEndpointDiscoveryCb endpointDiscoveryCallback;

  public NearbyTaskExecutorImpl(Context context) {
    this.connectionsClient = Nearby.getConnectionsClient(context);
    this.connectionLifecycleCallback = new NearbyConnectionLifecycleCb(context, connectionsClient);
    this.endpointDiscoveryCallback = new NearbyEndpointDiscoveryCb(context);
  }

  /**
  * Advertises the given broadcast message
  */
  public void startAdvertising(String broadcast) {
    this.connectionsClient.startAdvertising(broadcast, this.serviceId,
      this.connectionLifecycleCallback, new AdvertisingOptions(Strategy.P2P_CLUSTER))
    .addOnSuccessListener(new OnSuccessListener<Void>() {
      @Override
      public void onSuccess(Void unusedResult) {
        Log.d(NearbyPlugin.TAG, "Successfully started advertising: " + broadcast);
      }
    })
    .addOnFailureListener(new OnFailureListener() {
      @Override
      public void onFailure(Exception e) {
        Log.e(NearbyPlugin.TAG, "Unable to start advertising: " + e.getMessage());
      }
    });
  }

  public void stopAdvertising() {
    this.connectionsClient.stopAdvertising();
  }

  public void setServiceId(String id) {
    this.serviceId = id;
  }

  public void startDiscovery() {
    this.connectionsClient.startDiscovery(this.serviceId, this.endpointDiscoveryCallback,
      new DiscoveryOptions(Strategy.P2P_CLUSTER))
    .addOnSuccessListener(new OnSuccessListener<Void>() {
      @Override
      public void onSuccess(Void unusedResult) {
        Log.d(NearbyPlugin.TAG, "Successfully started discovery");
      }
    })
    .addOnFailureListener(new OnFailureListener() {
      @Override
      public void onFailure(Exception e) {
        Log.e(NearbyPlugin.TAG, "Unable to start service discovery: " + e.getMessage());
      }
    });
  }

  public void stopDiscovery() {
    this.connectionsClient.stopDiscovery();
  }

  public void sendMessage(List<String> endpoints, String payload) {
    try {
      this.connectionsClient.sendPayload(endpoints, Payload.fromBytes(payload.getBytes("UTF-8")));
    } catch (UnsupportedEncodingException ex) {
      Log.d(NearbyPlugin.TAG, "Unsupported UTF-8 encoding");
    }
  }

  public void connect(String endpoint) {
    this.connectionsClient.requestConnection(this.serviceId, endpoint, this.connectionLifecycleCallback);
  }

  public void disconnectFromEndpoint(String endpoint) {
    this.connectionsClient.disconnectFromEndpoint(endpoint);
  }

  public void disconnectFromAllEndpoints() {
    this.connectionsClient.stopAllEndpoints();
  }
}