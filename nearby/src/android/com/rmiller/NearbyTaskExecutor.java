package com.rmiller;

import java.util.List;

public interface NearbyTaskExecutor {
  public void startAdvertising(String broadcast);
  public void stopAdvertising();
  public void startDiscovery();
  public void stopDiscovery();
  public void sendMessage(List<String> endpoints, String payload);
  public void connect(String endpoint);
  public void disconnectFromEndpoint(String endpoint);
  public void setServiceId(String id);
  public void disconnectFromAllEndpoints();
}