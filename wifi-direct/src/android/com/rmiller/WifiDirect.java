package com.rmiller;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;
import android.app.Activity;
import android.content.Context;
import android.content.IntentFilter;
import android.net.wifi.WpsInfo;
import android.net.wifi.p2p.WifiP2pConfig;
import android.net.wifi.p2p.WifiP2pDevice;
import android.net.wifi.p2p.WifiP2pManager;
import android.net.wifi.p2p.WifiP2pManager.DnsSdTxtRecordListener;
import android.net.wifi.p2p.WifiP2pManager.DnsSdServiceResponseListener;
import android.net.wifi.p2p.WifiP2pManager.ActionListener;
import android.net.wifi.p2p.WifiP2pManager.Channel;
import android.net.wifi.p2p.WifiP2pManager.ChannelListener;
import android.net.wifi.p2p.WifiP2pGroup;
import android.net.wifi.p2p.nsd.WifiP2pDnsSdServiceInfo;
import android.net.wifi.p2p.nsd.WifiP2pDnsSdServiceRequest;
import android.util.Log;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

/**
 * A Cordova plugin that wraps the Wifi P2P Android API
 * @author Rob Miller
 * @author robmillersoftware@gmail.com
 **/
public class WifiDirect extends CordovaPlugin implements ChannelListener {
  protected static final String TAG = "WifiDirect";

  public boolean isWifiP2pEnabled = false;

  private final IntentFilter intentFilter = new IntentFilter();
  private Channel channel;
  private WifiP2pManager manager;
  private WifiDirectBroadcastReceiver receiver;
  private boolean retryChannel = false;
  private final JSONObject services = new JSONObject();
  private CallbackContext servicesCallback = null;
  private String name;
  private Map<Integer, ArrayList<WifiP2pDnsSdServiceInfo>> localServices = new HashMap();
  private WifiP2pGroup group = null;

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);

    intentFilter.addAction(WifiP2pManager.WIFI_P2P_STATE_CHANGED_ACTION);
    intentFilter.addAction(WifiP2pManager.WIFI_P2P_PEERS_CHANGED_ACTION);
    intentFilter.addAction(WifiP2pManager.WIFI_P2P_CONNECTION_CHANGED_ACTION);
    intentFilter.addAction(WifiP2pManager.WIFI_P2P_THIS_DEVICE_CHANGED_ACTION);

    this.manager = (WifiP2pManager) cordova.getActivity().getSystemService(Context.WIFI_P2P_SERVICE);
    this.channel = this.manager.initialize(cordova.getActivity(), cordova.getActivity().getMainLooper(), null);

    Log.d(TAG, "Initializing WifiDirect");
  }

  @Override
  public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
    if(action.equals("discoverPeers")) {
      this.manager.discoverPeers(this.channel, new WifiP2pManager.ActionListener() {
        @Override
        public void onSuccess() {
          Log.d(TAG, "Successfully started peer discovery.");
        }

        @Override
        public void onFailure(int reasonCode) {
          Log.e(TAG, "Unable to initiate discovery of peers. Reason code = " + reasonCode);
        }
      });
    } else if(action.equals("subscribeToPeers")) {
      this.receiver.getPeers(callbackContext);
    } else if (action.equals("broadcast")) {
      if (args == null || args.length() == 0) {
        throw new JSONException("No arguments sent to broadcast");
      } else if (args.length() == 1) {
        this.broadcast(args.getString(0), null);
      } else {
        this.broadcast(args.getString(0), args.getString(1));
      }
    } else if (action.equals("subscribeToBroadcasts")) {
      this.subscribeToBroadcasts(callbackContext);
    } else if (action.equals("createGroup")) {
      this.createGroup(callbackContext);
    } else if (action.equals("joinGroup")) {
      Log.d(TAG, "WTF MOTHER FUCK");
      WifiP2pConfig config = new WifiP2pConfig();
      WpsInfo wps = new WpsInfo();
      wps.setup = WpsInfo.PBC;

      config.deviceAddress = args.getString(0);
      config.wps = wps;
      Log.d(TAG, "JOINING GROUP: " + args.getString(0));
      this.joinGroup(config, callbackContext);
    }
    return true;
  }

  /**
   * Creates a new Bonjour service and broadcasts a specified state and message
   * @param state This is an optional parameter that lets peers know the state of the application
   * @param data This string represents a message to be sent. WifiDirect treats this as a plain String
   *   Any parsing must be done on the client side
   */
  public void broadcast(String data, String state) {
    String actualState = (state == null || state.isEmpty()) ? "UNKNOWN" : state;

    BroadcastRecord record = new BroadcastRecord(actualState, data);
    WifiP2pDnsSdServiceInfo serviceInfo = WifiP2pDnsSdServiceInfo.newInstance("_test", "_presence._tcp", record.toMap());

    Integer broadcastType = 0;
    Boolean shouldRemove = false;

    try {
      JSONObject dataObj = new JSONObject(data);
      broadcastType = dataObj.getInt("type");
      shouldRemove = dataObj.getBoolean("shouldRemove");
    } catch(JSONException ex) {
      Log.e(TAG, "Error retrieving broadcast property: " + ex.getMessage());
    }

    if (!this.localServices.containsKey(broadcastType)) {
      this.localServices.put(broadcastType, new ArrayList<WifiP2pDnsSdServiceInfo>());
    } else if (shouldRemove && this.localServices.get(broadcastType).size() > 0) {
      this.manager.removeLocalService(this.channel, this.localServices.get(broadcastType).get(0), new ActionListener() {
        @Override
        public void onSuccess() {
          Log.d(TAG, "Successfully removed local service");
        }
        @Override
        public void onFailure(int code) {
          Log.d(TAG, "Failed to remove local service. Reason code is " + code);
        }
      });

      this.localServices.get(broadcastType).clear();
    }

    this.localServices.get(broadcastType).add(serviceInfo);
    this.manager.addLocalService(this.channel, serviceInfo, new ActionListener() {
      @Override
      public void onSuccess() {
        Log.d(TAG, "Successfully added wifi direct service");
      }

      @Override
      public void onFailure(int code) {
        Log.d(TAG, "Failed to add wifi direct service. Reason code is " + code);
      }
    });
  }

  public void setGroup(WifiP2pGroup group) {
    this.group = group;
  }

  private void subscribeToBroadcasts(CallbackContext callbackContext) {
    this.servicesCallback = callbackContext;

    DnsSdTxtRecordListener txtListener = new DnsSdTxtRecordListener() {
      @Override
      public void onDnsSdTxtRecordAvailable(String fullDomain, Map record, WifiP2pDevice device) {
        try {
          services.put(device.deviceAddress, new JSONObject(record));
        } catch(JSONException e) {
          Log.e(TAG, "Error adding service to JSON object: " + e.getMessage());
        }

        PluginResult result = new PluginResult(Status.OK, services);
        result.setKeepCallback(true);
        servicesCallback.sendPluginResult(result);
      }
    };

    DnsSdServiceResponseListener servListener = new DnsSdServiceResponseListener() {
      @Override
      public void onDnsSdServiceAvailable(String instanceName, String registrationType, WifiP2pDevice resourceType) {
        Log.d(TAG, "We got a service response instance = " + instanceName);
      }
    };

    this.manager.setDnsSdResponseListeners(this.channel, servListener, txtListener);

    WifiP2pDnsSdServiceRequest serviceRequest = WifiP2pDnsSdServiceRequest.newInstance();
    this.manager.addServiceRequest(this.channel, serviceRequest, new ActionListener() {
      @Override
      public void onSuccess() {
        Log.d(TAG, "Successfully added service request");
      }

      @Override
      public void onFailure(int code) {
        Log.d(TAG, "Failed to add service request. Reason code is " + code);
      }
    });

    this.manager.discoverServices(this.channel, new ActionListener() {
      @Override
      public void onSuccess() {
        Log.d(TAG, "Started Service Discovery");
      }

      @Override
      public void onFailure(int code) {
        Log.d(TAG, "Failed to start seBroadcastMessagervice discovery. Reason code is " + code);
      }
    });
  }

  public void joinGroup(WifiP2pConfig config, CallbackContext cb) {
    this.manager.connect(this.channel, config, new ActionListener() {
      @Override
      public void onSuccess() {
        // WiFiDirectBroadcastReceiver will notify us. Ignore for now.
        Log.d(TAG, "CONNECTING");
      }

      @Override
      public void onFailure(int reason) {
        Log.d(TAG, "Failed to connect to Wifi Direct service");
      }
    });
  }

  public void disconnect() {
    this.manager.removeGroup(this.channel, new ActionListener() {
      @Override
      public void onFailure(int reasonCode) {
        Log.d(TAG, "Disconnect failed. Reason :" + reasonCode);
      }

      @Override
      public void onSuccess() {
      }
    });
  }

  private void createGroup(CallbackContext cb) {
    this.receiver.groupCb = cb;
    this.manager.createGroup(this.channel, new WifiP2pManager.ActionListener() {
      @Override
      public void onSuccess() {
        Log.d(TAG, "Group created, ready to accept connections");
      }

      @Override
      public void onFailure(int reason) {
        Log.d(TAG, "Group creation failed. Reason code is " + reason);
      }
    });
  }

  public Activity getActivity() {
    return cordova.getActivity();
  }

  @Override
  public void onResume(boolean multitasking) {
    super.onResume(multitasking);
    Log.d(TAG, "Resuming WifiDirect activity");
    this.receiver = new WifiDirectBroadcastReceiver(this.manager, this.channel, this);
    cordova.getActivity().registerReceiver(this.receiver, this.intentFilter);
  }

  @Override
  public void onPause(boolean multitasking) {
    super.onPause(multitasking);
    Log.d(TAG, "Pausing WifiDirect activity");
    cordova.getActivity().unregisterReceiver(this.receiver);
  }

  @Override
  public void onChannelDisconnected() {
      // we will try once more
      if (this.manager != null && !this.retryChannel) {
          Log.i(TAG, "Channel lost. Trying again");
          this.retryChannel = true;
          this.manager.initialize(cordova.getActivity(), cordova.getActivity().getMainLooper(), this);
      } else {
          Log.e(TAG,"Severe! Channel is probably lost premanently. Try Disable/Re-Enable P2P.");
      }
  }

  private class BroadcastRecord {
    public String state = "";
    public String data;

    public BroadcastRecord(String state, String data) {
      this.state = state;
      this.data = data;
    }

    public Map<String, String> toMap() {
      Map<String, String> rtn = new HashMap();
      rtn.put("state", this.state);
      rtn.put("data", this.data);
      return rtn;
    }
  }
}
