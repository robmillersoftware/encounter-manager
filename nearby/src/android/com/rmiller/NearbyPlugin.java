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
 * @copyright 2018
 **/
public class NearbyPlugin extends CordovaPlugin {
  protected static final String TAG = "NearbyPlugin";
  protected static final int REQUEST_CODE = 0;

  protected ConnectionsClient connectionsClient;

  //These variables identify the application using NearbyPlugin
  protected String identifier;
  protected String serviceId;

  protected CallbackContext endpointCbContext;
  protected CallbackContext connectionsCallback;

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
        connectionsClient.acceptConnection(endpointId, payloadCallback);

        user.put("e", endpointId);
        PluginResult result = new PluginResult(Status.OK, user);
        result.setKeepCallback(true);
        connectionsCallback.sendPluginResult(result);
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
    }
  };

  private final EndpointDiscoveryCallback endpointDiscoveryCallback = new EndpointDiscoveryCallback() {
    @Override
    public void onEndpointFound(String endpointId, DiscoveredEndpointInfo discoveredEndpointInfo) {
      Log.d(TAG, "Discovered endpoint: " + endpointId + ", name: " + discoveredEndpointInfo.getEndpointName()
        + ", service: " + discoveredEndpointInfo.getServiceId());

      JSONObject endpointIdJson = null;

      try {
        endpointIdJson = new JSONObject(discoveredEndpointInfo.getEndpointName());
        endpointIdJson.put("e", endpointId);
      } catch(JSONException e) {
        Log.d(TAG, "Error getting identifier from endpoint: " + e.getMessage());
      }

      if (endpointIdJson == null) {
        endpointIdJson = new JSONObject();
      }

      JSONObject endpointDataJson = new JSONObject();
      try {
        endpointDataJson.put(endpointId, discoveredEndpointInfo.getEndpointName());
      } catch(JSONException e) {
        Log.d(TAG, "Error setting endpoint information: " + e.getMessage());
      }

      NearbyPayload payload = new NearbyPayload(endpointDataJson.toString(),
        endpointIdJson.toString(), identifier, "CAMPAIGN");

      PluginResult result = new PluginResult(Status.OK, payload.toJSON());
      result.setKeepCallback(true);
      endpointCbContext.sendPluginResult(result);
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
    switch(action.toLowerCase()) {
      case "startadvertising":
        this.connectionsCallback = callbackContext;
        this.startAdvertising(args.getString(0));
        break;
      case "stopadvertising":
        Log.d(TAG, "Stopping advertising.");
        this.connectionsClient.stopAdvertising();
        break;
      case "setidentifier":
        this.identifier = args.getString(0);
        break;
      case "setserviceid":
        this.serviceId = args.getString(0);
        break;
      case "startdiscovery":
        this.endpointCbContext = callbackContext;
        this.connectionsClient.startDiscovery(args.getString(0), this.endpointDiscoveryCallback,
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
        break;
      case "stopdiscovery":
        Log.d(TAG, "Turning off discovery.");
        this.connectionsClient.stopDiscovery();
        break;
      case "sendbytes":
        this.sendPayloadBytes(args.getString(0), args.getString(1));
        break;
      case "connecttocampaign":
        Log.d(TAG, "IDENTIFIER IS: " + this.identifier);
        try {
          JSONObject obj = new JSONObject();
          this.connectionsClient.requestConnection(this.identifier, args.getString(0), connectionLifecycleCallback);
        } catch (JSONException ex) {
          Log.d(TAG, "JSON Exception: " + ex.getMessage());
        }
        break;
    }

    return true;
  }

  private void startAdvertising(String broadcast) {
    this.connectionsClient.startAdvertising(broadcast, this.serviceId,
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
  }

  /**
  *
  */
  private void sendPayloadBytes(String user, String data) {
/*    try {
      this.connectionsClient.sendPayload(keys.toArray(new String[keys.size()])[0], Payload.fromBytes(data.getBytes("UTF-8")));
    } catch (UnsupportedEncodingException ex) {
      Log.d(TAG, "Unsupported UTF-8 encoding");
    }
*/
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

  public static String generateIdentifier(String name, String id, String endpoint) {
    JSONObject obj = new JSONObject();

    try {
      obj.put("n", name);
      obj.put("i", id);
      obj.put("e", endpoint);
    } catch(JSONException e) {
      Log.d(TAG, "Error generating identifier: " + e.getMessage());
    }

    return obj.toString();
  }

  public static JSONObject parseIdentifier(String id) {
    JSONObject rtn = new JSONObject();

    try {
      JSONObject obj = new JSONObject(id);
      rtn.put("name", obj.getString("n"));
      rtn.put("id", obj.getString("i"));
      rtn.put("endpoint", obj.getString("e"));
    } catch(JSONException e) {
      Log.d(TAG, "Error parsing identifier: " + e.getMessage());
    }

    return rtn;
  }

  private class NearbyPayload {
    public String payload;
    public String src;
    public String dest;
    public String type;

    public NearbyPayload(String payload, String src, String dest, String type) {
      this.payload = payload;
      this.src = src;
      this.dest = dest;
      this.type = type;
    }

    public String toJSON() {
      JSONObject obj = new JSONObject();

      try {
        obj.put("payload", this.payload);
        obj.put("src", this.src);
        obj.put("dest", this.dest);
        obj.put("type", this.type);
      } catch (JSONException e) {
        Log.d(TAG, "Error converting NearbyPayload: " + e.getMessage());
      }

      return obj.toString();
    }
  }
}
