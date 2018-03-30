package com.rmiller;

import org.apache.cordova.CallbackContext;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.NetworkInfo;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import android.net.wifi.p2p.WifiP2pDevice;
import android.net.wifi.p2p.WifiP2pDeviceList;
import android.net.wifi.p2p.WifiP2pInfo;
import android.net.wifi.p2p.WifiP2pGroup;
import android.net.wifi.p2p.WifiP2pManager;
import android.net.wifi.p2p.WifiP2pManager.Channel;
import android.net.wifi.p2p.WifiP2pManager.PeerListListener;
import android.net.wifi.p2p.WifiP2pManager.GroupInfoListener;
import android.net.wifi.WpsInfo;
import android.util.Log;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;
import java.util.ArrayList;
import java.util.List;
import java.net.InetAddress;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;

/**
 * A BroadcastReceiver that notifies of important wifi p2p events.
 */
public class WifiDirectBroadcastReceiver extends BroadcastReceiver {
    private WifiP2pManager manager;
    private Channel channel;
    private WifiDirect wifidirect;
    private WifiP2pInfo info;
    private CallbackContext callback = null;
    private WifiP2pGroup group;
    public CallbackContext groupCb;

    private List<WifiP2pDevice> peers = new ArrayList<>();
    private WifiP2pManager.PeerListListener peerListListener = peerList -> {
        peers.clear();
        peers.addAll(peerList.getDeviceList());
        if (peers.size() == 0) {
            Log.d(WifiDirect.TAG, "No devices found");
            return;
        }

        if (this.callback != null) {
          JSONArray json = new JSONArray();

          for (WifiP2pDevice device : peers) {
            json.put(device.toString());
          }

          PluginResult result = new PluginResult(Status.OK, json);
          result.setKeepCallback(true);
          this.callback.sendPluginResult(result);
        }
    };

    /**
     * @param manager WifiP2pManager system service
     * @param channel Wifi p2p channel
     * @param wifidirect wifidirect associated with the receiver
     */
    public WifiDirectBroadcastReceiver(WifiP2pManager manager, Channel channel,
            WifiDirect wifidirect) {
        super();
        this.manager = manager;
        this.channel = channel;
        this.wifidirect = wifidirect;
    }

    public void getPeers(CallbackContext cb) {
        this.callback = cb;
    }

    /*
     * (non-Javadoc)
     * @see android.content.BroadcastReceiver#onReceive(android.content.Context,
     * android.content.Intent)
     */
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        if (WifiP2pManager.WIFI_P2P_STATE_CHANGED_ACTION.equals(action)) {
            int state = intent.getIntExtra(WifiP2pManager.EXTRA_WIFI_STATE, -1);
            if (state == WifiP2pManager.WIFI_P2P_STATE_ENABLED) {
                // Wifi Direct mode is enabled
                this.wifidirect.isWifiP2pEnabled = true;
            } else {
                this.wifidirect.isWifiP2pEnabled = false;
            }
        } else if (WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION.equals(action)) {
            if (this.manager != null) {
                this.manager.requestPeers(channel, peerListListener);
            }
        } else if (WifiP2pManager.WIFI_P2P_CONNECTION_CHANGED_ACTION.equals(action)) {
          NetworkInfo networkInfo = intent.getParcelableExtra(WifiP2pManager.EXTRA_NETWORK_INFO);
          WifiP2pInfo wifiP2pInfo = intent.getParcelableExtra(WifiP2pManager.EXTRA_WIFI_P2P_INFO);

          if (networkInfo.isConnected()) {
            this.manager.requestConnectionInfo(channel, info -> {
              InetAddress groupOwnerAddress = info.groupOwnerAddress;

              // After the group negotiation, we can determine the group owner
              // (server).
              if (info.groupFormed) {
                manager.requestGroupInfo(channel, wifiP2pGroup -> {
                  if (wifiP2pGroup != null) {
                    JSONObject groupObj = new JSONObject();
                    try {
                      groupObj.put("isOwner", info.isGroupOwner);
                      groupObj.put("ownerAddress", wifiP2pGroup.getOwner().deviceAddress);
                      groupObj.put("ip", groupOwnerAddress.getHostAddress());
                      groupObj.put("ssid", wifiP2pGroup.getNetworkName());
                      groupObj.put("password", wifiP2pGroup.getPassphrase());
                    } catch(JSONException e) {
                      Log.d(WifiDirect.TAG, "JSON Error: " + e.getMessage());
                    }

                    if (groupCb != null) {
                      PluginResult result = new PluginResult(Status.OK, groupObj);
                      result.setKeepCallback(true);
                      groupCb.sendPluginResult(result);
                    }

                    Log.d(WifiDirect.TAG, "Group is created. SSID is " + wifiP2pGroup.getNetworkName());
                  }
                });
              }
            });
          }
        } else if (WifiP2pManager.WIFI_P2P_THIS_DEVICE_CHANGED_ACTION.equals(action)) {
            //Not sure what to do here
        }
    }
}
