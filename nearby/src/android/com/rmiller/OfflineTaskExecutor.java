package com.rmiller;

import android.util.Log;
import java.util.List;

public class OfflineTaskExecutor implements NearbyTaskExecutor {
    //This is a string that uniquely identifies the application as a whole. This allows users of an
  //application find each other
  protected String serviceId;
  protected Context context;

  public NearbyTaskExecutorImpl(Context context) {
    this.context = context;
  }

  public void startAdvertising(String broadcast) {
    Log.d(NearbyPlugin.TAG, "Called startAdvertising on offline task executor with: " + broadcast);
  }

  public void stopAdvertising() {
    Log.d(NearbyPlugin.TAG, "Called stopAdvertising on offline task executor.");
  }

  public void startDiscovery() {
    Log.d(NearbyPlugin.TAG, "Called startDiscovery on offline task executor.");
  }

  public void stopDiscovery() {
    Log.d(NearbyPlugin.TAG, "Called stopDiscovery on offline task executor.");
  }

  public void sendMessage(List<String> endpoints, String payload) {
    Log.d(NearbyPlugin.TAG, "Called sendMessage on offline task executor. Sending: " + payload + " to endpoints: " + String.join(", ", endpoints));
  }

  public void connect(String endpoint) {
    Log.d(NearbyPlugin.TAG, "Called connect on offline task executor with endpoint: " + endpoint);
  }

  public void disconnectFromEndpoint(String endpoint) {
    Log.d(NearbyPlugin.TAG, "Called disconnectFromEndpoint on offline task executor with endpoint: " + endpoint);
  }

  public void setServiceId(String id) {
    this.serviceId = id;
    Log.d(NearbyPlugin.TAG, "Called setServiceId on offline task executor with id: " + id);
  }

  public void disconnectFromAllEndpoints() {
    Log.d(NearbyPlugin.TAG, "Called disconnectFromAllEndpoints on offline task executor.");
  }
}