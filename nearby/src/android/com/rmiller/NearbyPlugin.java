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
import java.util.List;
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
import com.google.gson.Gson;
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

  //This is the unique identifier for this instance of an application
  protected String identifier;

  //This is a string that uniquely identifies the application as a whole. This allows users of an
  //application find each other
  protected String serviceId;

  //These are callbacks executed on the Javascript side
  protected CallbackContext endpointCbContext;
  protected CallbackContext messageHandler;

  //This callback is executed when a payload is received
  private final NearbyPayloadCb payloadCallback = new NearbyPayloadCb();

  //This callback is executed when there is a change to a connection
  private NearbyConnectionLifecycleCb connectionLifecycleCallback;

  //This callback is executed when a new endpoint is discovered
  private final NearbyEndpointDiscoveryCb endpointDiscoveryCallback = new NearbyEndpointDiscoveryCb();

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);

    //Location is required for Google Nearby to work
    if (!cordova.hasPermission(Manifest.permission.ACCESS_COARSE_LOCATION)) {
      cordova.requestPermission(this, REQUEST_CODE, Manifest.permission.ACCESS_COARSE_LOCATION);
    }

    connectionsClient = Nearby.getConnectionsClient(cordova.getActivity().getApplicationContext());
    connectionLifecycleCallback = new NearbyConnectionLifecycleCb(connectionsClient);

    Log.d(TAG, "Initializing Nearby");
  }

  @Override
  public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
    switch(action.toLowerCase()) {
      case "startadvertising":
        this.startAdvertising(args.getString(0));
        break;
      case "stopadvertising":
        Log.d(TAG, "Stopping advertising.");
        this.connectionsClient.stopAdvertising();
        break;
      case "setserviceid":
        Log.d(TAG, "Setting service id: " + args.getString(0));
        this.serviceId = args.getString(0);
        break;
      case "startdiscovery":
        Log.d(TAG, "Starting discovery");
        this.startDiscovery();
        break;
      case "stopdiscovery":
        Log.d(TAG, "Turning off discovery.");
        this.connectionsClient.stopDiscovery();
        break;
      case "send":
        Gson gson = new Gson();
        List<String> endpoints = gson.fromJson(args.getString(0), List.class);
        Log.d(TAG, "Sending payload " + args.getString(1) + " to endpoints: " + endpoints.toString());

        try {
          this.connectionsClient.sendPayload(endpoints, Payload.fromBytes(args.getString(1).getBytes("UTF-8")));
        } catch (UnsupportedEncodingException ex) {
          Log.d(TAG, "Unsupported UTF-8 encoding");
        }
        break;
      case "connect":
        Log.d(TAG, "Connecting to endpoint: " + args.getString(0));
        this.connectionsClient.requestConnection(this.serviceId, args.getString(0), connectionLifecycleCallback);
        break;
      case "disconnect":
        Log.d(TAG, "Disconnecting from endpoint: " + args.getString(0));
        this.connectionsClient.disconnectFromEndpoint(args.getString(0));
        break;
      case "disconnectall":
        Log.d(TAG, "Disconnecting from all endpoints.");
        this.connectionsClient.stopAllEndpoints();
        break;
      case "setdatahandler":
        Log.d(TAG, "Setting handlers for the various lifecycle callbacks.");
        this.payloadCallback.setHandler(callbackContext);
        this.connectionLifecycleCallback.setHandler(callbackContext);
        this.endpointDiscoveryCallback.setHandler(callbackContext);
        break;
    }

    return true;
  }

  /**
  * Advertises the given broadcast message
  */
  private void startAdvertising(String broadcast) {
    this.connectionsClient.startAdvertising(broadcast, this.serviceId,
      this.connectionLifecycleCallback, new AdvertisingOptions(Strategy.P2P_CLUSTER))
    .addOnSuccessListener(new OnSuccessListener<Void>() {
      @Override
      public void onSuccess(Void unusedResult) {
        Log.d(TAG, "Successfully started advertising: " + broadcast);
      }
    })
    .addOnFailureListener(new OnFailureListener() {
      @Override
      public void onFailure(Exception e) {
        Log.e(TAG, "Unable to start advertising: " + e.getMessage());
      }
    });
  }

  private void startDiscovery() {
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
  public void onRequestPermissionResult(int requestCode, String[] permissions,
      int[] grantResults) throws JSONException {
    for (int r : grantResults) {
      //We only care if the permission was denied
      if (r == PackageManager.PERMISSION_DENIED) {
        Log.e(TAG, "Permission denied for ACCESS_COARSE_LOCATION");
        return;
      }
    }
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
    this.checkPlayServices();
    Log.d(TAG, "Resuming NearbyPlugin");
  }
}
