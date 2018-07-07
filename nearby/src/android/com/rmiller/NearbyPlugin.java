package com.rmiller;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;
import android.app.Activity;
import android.content.Context;
import android.util.Log;
import java.util.Set;
import java.io.UnsupportedEncodingException;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.Strategy;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.OnFailureListener;
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
  protected CallbackContext messageHandler;

  private final NearbyPayloadCb payloadCallback = new NearbyPayloadCb();
  private NearbyConnectionLifecycleCb connectionLifecycleCallback;
  private final NearbyEndpointDiscoveryCb endpointDiscoveryCallback = new NearbyEndpointDiscoveryCb();

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);

    if (!cordova.hasPermission(Manifest.permission.ACCESS_COARSE_LOCATION)) {
      cordova.requestPermission(this, REQUEST_CODE, Manifest.permission.ACCESS_COARSE_LOCATION);
    }

    connectionsClient = Nearby.getConnectionsClient(cordova.getActivity().getApplicationContext());
    connectionLifecycleCallback = new NearbyConnectionLifecycleCb(connectionsClient);

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
        this.connectionLifecycleCallback.setCallbackContext(callbackContext);
        this.startAdvertising(args.getString(0));
        break;
      case "stopadvertising":
        Log.d(TAG, "Stopping advertising.");
        this.connectionsClient.stopAdvertising();
        break;
      case "setidentifier":
        Log.d(TAG, "Setting endpoint identifier: " + args.getString(0));
        this.identifier = args.getString(0);
        this.payloadCallback.setIdentifier(this.identifier);
        break;
      case "setserviceid":
        Log.d(TAG, "Setting service id: " + args.getString(0));
        this.serviceId = args.getString(0);
        break;
      case "startdiscovery":
        this.endpointDiscoveryCallback.setCallbackContext(callbackContext);
        this.connectionsClient.startDiscovery(this.serviceId, this.endpointDiscoveryCallback,
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
        this.connectionLifecycleCallback.setCallbackContext(callbackContext);

        try {
          JSONObject obj = new JSONObject();
          this.connectionsClient.requestConnection(this.identifier, args.getString(0), connectionLifecycleCallback);
        } catch (JSONException ex) {
          Log.d(TAG, "JSON Exception: " + ex.getMessage());
        }
        break;
      case "setmessagehandler":
        this.payloadCallback.setHandler(callbackContext);
        break;
    }

    return true;
  }

  private void startAdvertising(String broadcast) {
    JSONObject campaignInfo = new JSONObject();

    try {
      campaignInfo.put(identifier, broadcast);
    } catch(JSONException e) {
      Log.e(TAG, "Unable to create campaignInfo");
    }

    this.connectionsClient.startAdvertising(campaignInfo.toString(), this.serviceId,
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
  private void sendPayloadBytes(String endpoint, String data) {
    try {
      this.connectionsClient.sendPayload(endpoint, Payload.fromBytes(data.getBytes("UTF-8")));
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
    this.connectionsClient.stopAdvertising();
    this.connectionsClient.stopDiscovery();
    Log.d(TAG, "Pausing NearbyPlugin");
  }

  @Override
  public void onResume(boolean multitasking) {
    super.onResume(multitasking);

    boolean services = this.checkPlayServices();
    Log.d(TAG, "Resuming NearbyPlugin");
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
}
