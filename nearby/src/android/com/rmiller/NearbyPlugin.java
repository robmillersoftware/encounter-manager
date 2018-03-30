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
import android.util.Log;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Set;
import java.io.UnsupportedEncodingException;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.Strategy;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.OnFailureListener;
import android.support.v4.app.ActivityCompat;
import android.Manifest;
import android.content.pm.PackageManager;

/**
 * A Cordova plugin that wraps the Wifi P2P Android API
 * @author Rob Miller
 * @author robmillersoftware@gmail.com
 **/
public class NearbyPlugin extends CordovaPlugin {
  protected static final String TAG = "NearbyPlugin";
  protected static final int REQUEST_CODE = 0;

  private Map<String, String> endpoints = new HashMap<String, String>();
  protected String userName;
  protected ConnectionsClient connectionsClient;

  //String that identifies the application
  protected String token;

  //JSON string that contains name and id fields
  protected String identifier;
  protected CallbackContext endpointCbContext;

  protected PayloadCallback payloadCallback = new PayloadCallback() {
    @Override
    public void onPayloadReceived(String endpointId, Payload payload) {
      switch(payload.getType()) {
        case Payload.Type.STREAM:
          break;
        case Payload.Type.FILE:
          break;
        case Payload.Type.BYTES:
          try {
            Log.d(TAG, "Got message: " + new String(payload.asBytes(), "UTF-8"));
          } catch (UnsupportedEncodingException e) {
            Log.e(TAG, "UTF-8 is unsupported");
          }
          break;
      }
    }

    @Override
    public void onPayloadTransferUpdate(String endpointId, PayloadTransferUpdate update) {

    }
  };

  private final ConnectionLifecycleCallback connectionLifecycleCallback = new ConnectionLifecycleCallback() {
    @Override
    public void onConnectionInitiated(String endpointId, ConnectionInfo connectionInfo) {
      Log.d(TAG, "Connection initiated from endpoint: " + endpointId + ", name: "
        + connectionInfo.getEndpointName() + ", auth: " + connectionInfo.getAuthenticationToken()
        + ", isIncoming: " + connectionInfo.isIncomingConnection());

      try {
        JSONObject user = new JSONObject(connectionInfo.getEndpointName());
        if (token.equals(user.getString("token"))) {
          connectionsClient.acceptConnection(endpointId, payloadCallback);
        }
      } catch (JSONException ex) {
        Log.e(TAG, "JSON Exception: " + ex.getMessage());
      }
    }

    @Override
    public void onConnectionResult(String endpointId, ConnectionResolution resolution) {
      switch(resolution.getStatus().getStatusCode()) {
        case ConnectionsStatusCodes.STATUS_OK:
          Log.d(TAG, "Connection to endpoint " + endpointId + " was successful.");
          break;
        case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
          Log.d(TAG, "Connection rejected");
          break;
        case ConnectionsStatusCodes.STATUS_ERROR:
          Log.d(TAG, "There was an error connecting to endpoint " + endpointId);
          break;
      }
    }

    @Override
    public void onDisconnected(String endpointId) {
      Log.d(TAG, "Disconnected from endpoint: " + endpointId);
      endpoints.remove(endpointId);
    }
  };

  private final EndpointDiscoveryCallback endpointDiscoveryCallback = new EndpointDiscoveryCallback() {
    @Override
    public void onEndpointFound(String endpointId, DiscoveredEndpointInfo discoveredEndpointInfo) {
      Log.d(TAG, "Discovered endpoint: " + endpointId + ", name: " + discoveredEndpointInfo.getEndpointName()
        + ", service: " + discoveredEndpointInfo.getServiceId());

      endpoints.put(endpointId, discoveredEndpointInfo.getEndpointName());
      JSONObject json = new JSONObject(endpoints);
      MessagePayload payload = new MessagePayload(json.toString(),
        discoveredEndpointInfo.getEndpointName(), identifier);
      PluginResult result = new PluginResult(Status.OK, payload.toJSON());
      result.setKeepCallback(true);
      endpointCbContext.sendPluginResult(result);

      try {
        JSONObject obj = new JSONObject();
        obj.put("token", token);
        connectionsClient.requestConnection(obj.toString(), endpointId, connectionLifecycleCallback);
      } catch (JSONException ex) {
        Log.d(TAG, "JSON Exception: " + ex.getMessage());
      }
    }

    @Override
    public void onEndpointLost(String endpointId) {
      Log.d(TAG, "Lost endpoint: " + endpointId);
    }
  };

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);

    if (!cordova.hasPermission(Manifest.permission.ACCESS_COARSE_LOCATION)) {
      cordova.requestPermission(this, REQUEST_CODE, Manifest.permission.ACCESS_COARSE_LOCATION);
    }

    connectionsClient = Nearby.getConnectionsClient(cordova.getActivity().getApplicationContext());
    Log.d(TAG, "Initializing Nearby");
  }

  @Override
  public void onRequestPermissionResult(int requestCode, String[] permissions,
      int[] grantResults) throws JSONException {
    for (int r : grantResults) {
      if (r == PackageManager.PERMISSION_DENIED) {
        Log.e(TAG, "Permission denied for ACCESS_COARSE_LOCATION");
        return;
      }
    }
  }

  @Override
  public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
    if(action.equals("startAdvertising")) {
      this.userName = args.getString(0);
      this.connectionsClient.startAdvertising(args.getString(0), args.getString(1),
        this.connectionLifecycleCallback, new AdvertisingOptions(Strategy.P2P_CLUSTER))
      .addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void unusedResult) {
          Log.d(TAG, "Successfully started advertising");
        }
      })
      .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
          Log.e(TAG, "Unable to start advertising: " + e.getMessage());
        }
      });
    } else if(action.equals("stopAdvertising")) {
      this.connectionsClient.stopAdvertising();
    } else if (action.equals("setToken")) {
      this.token = args.getString(0);
    } else if (action.equals("setIdentifier")) {
      this.identifier = args.getString(0);
    } else if (action.equals("startDiscovery")) {
      this.endpointCbContext = callbackContext;
      this.connectionsClient.startDiscovery(args.getString(1), this.endpointDiscoveryCallback,
        new DiscoveryOptions(Strategy.P2P_CLUSTER))
      .addOnSuccessListener(new OnSuccessListener<Void>() {
        @Override
        public void onSuccess(Void unusedResult) {
          Log.d(TAG, "Successfully started discovery");
        }
      })
      .addOnFailureListener(new OnFailureListener() {
        @Override
        public void onFailure(Exception e) {
          Log.e(TAG, "Unable to start service discovery: " + e.getMessage());
        }
      });
    } else if (action.equals("stopDiscovery")) {
      this.connectionsClient.stopDiscovery();
    } else if (action.equals("sendBytes")) {
      this.sendPayloadBytes(args.getString(0), args.getString(1));
    }
    return true;
  }

  /**
  *
  */
  private void sendPayloadBytes(String user, String data) {
    Set<String> keys = endpoints.keySet();

    try {
      this.connectionsClient.sendPayload(keys.toArray(new String[keys.size()])[0], Payload.fromBytes(data.getBytes("UTF-8")));
    } catch (UnsupportedEncodingException ex) {
      Log.d(TAG, "Unsupported UTF-8 encoding");
    }
  }

  /**
  * Check to make sure Google Play Services are available and match the required version. If they need installed
  * or updated, the user is prompted to do so.
  * @return true if available, false otherwise
  */
  private boolean checkPlayServices() {
    GoogleApiAvailability googleAPI = GoogleApiAvailability.getInstance();
    int result = googleAPI.isGooglePlayServicesAvailable(this.cordova.getActivity().getApplicationContext());
    if(result != ConnectionResult.SUCCESS) {
      if(googleAPI.isUserResolvableError(result)) {
        googleAPI.getErrorDialog(this.cordova.getActivity(), result,
          9000).show();
      }
      return false;
    }
    return true;
  }

  @Override
  public void onPause(boolean multitasking) {
    super.onPause(multitasking);
    Log.d(TAG, "Pausing NearbyPlugin");
  }

  @Override
  public void onResume(boolean multitasking) {
    super.onResume(multitasking);

    boolean services = this.checkPlayServices();
    Log.d(TAG, "Resuming NearbyPlugin");
    Log.d(TAG, "Did we find google services? " + services);
  }

  private class MessagePayload {
    public Map<String, String> description;
    public String data;

    public MessagePayload(String msg, String to, String from) {
      this.data = msg;
      this.description.put("type", "BYTES");
      this.description.put("to", to);
      this.description.put("from", from);
    }

    public String toJSON() {
      JSONObject obj = new JSONObject();
      JSONObject desc = new JSONObject(this.description);

      try {
        obj.put("description", desc.toString());
        obj.put("data", this.data);
      } catch (JSONException e) {
        Log.d(TAG, "Error converting MessagePayload: " + e.getMessage());
      }
      
      return obj.toString();
    }
  }
}
