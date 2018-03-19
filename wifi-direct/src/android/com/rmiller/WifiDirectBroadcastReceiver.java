package com.rmiller;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.NetworkInfo;
import android.net.wifi.p2p.WifiP2pDevice;
import android.net.wifi.p2p.WifiP2pDeviceList;
import android.net.wifi.p2p.WifiP2pInfo;
import android.net.wifi.p2p.WifiP2pManager;
import android.net.wifi.p2p.WifiP2pManager.Channel;
import android.net.wifi.p2p.WifiP2pManager.PeerListListener;
import android.util.Log;
import org.json.JSONArray;
import org.json.JSONException;
import java.util.ArrayList;
import java.util.List;
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

    private WifiP2pManager.ConnectionInfoListener connectionInfo = info -> {
        this.info = info;

        // After the group negotiation, we assign the group owner as the file
        // server. The file server is single threaded, single connection server
        // socket.
        if (info.groupFormed && info.isGroupOwner) {
            new FileServerAsyncTask(this.wifidirect.getActivity());
        } else if (info.groupFormed) {
            Log.d(WifiDirect.TAG, "Not group owner");
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

            // UI update to indicate wifi p2p status.
            int state = intent.getIntExtra(WifiP2pManager.EXTRA_WIFI_STATE, -1);
            if (state == WifiP2pManager.WIFI_P2P_STATE_ENABLED) {
                // Wifi Direct mode is enabled
                this.wifidirect.isWifiP2pEnabled = true;
            } else {
                this.wifidirect.isWifiP2pEnabled = false;
            }
        } else if (WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION.equals(action)) {

            // request available peers from the wifi p2p manager. This is an
            // asynchronous call and the calling activity is notified with a
            // callback on PeerListListener.onPeersAvailable()
            if (this.manager != null) {
                this.manager.requestPeers(channel, peerListListener);
            }
        } else if (WifiP2pManager.WIFI_P2P_CONNECTION_CHANGED_ACTION.equals(action)) {

            if (this.manager == null) {
                return;
            }

            NetworkInfo networkInfo = (NetworkInfo) intent
                    .getParcelableExtra(WifiP2pManager.EXTRA_NETWORK_INFO);

            if (networkInfo.isConnected()) {
                // we are connected with the other device, request connection
                // info to find group owner IP
                this.manager.requestConnectionInfo(channel, connectionInfo);
            }
        } else if (WifiP2pManager.WIFI_P2P_THIS_DEVICE_CHANGED_ACTION.equals(action)) {
            //Not sure what to do here
        }
    }
}
