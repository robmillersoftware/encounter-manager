package com.rmiller;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import android.app.Activity;
import android.content.Context;
import android.util.Log;
import java.util.Set;
import java.util.List;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.ConnectionResult;
import com.google.gson.Gson;
import android.Manifest;
import android.content.pm.PackageManager;
import org.apache.cordova.PluginResult;
import org.apache.cordova.PluginResult.Status;

/**
 * A Cordova plugin that wraps the Wifi P2P Android API
 * @author Rob Miller
 * @copyright 2018
 **/
public class NearbyPlugin extends CordovaPlugin {
  protected static final String TAG = "NearbyPlugin";
  protected static final int REQUEST_CODE = 0;

  //This is the unique identifier for this instance of an application
  protected String identifier;

  private CordovaWebView webView;
  private NearbyTaskExecutor taskExecutor;

  @Override
  public void initialize(CordovaInterface cordova, CordovaWebView webView) {
    super.initialize(cordova, webView);

    this.webView = webView;

    //Location is required for Google Nearby to work
    if (!cordova.hasPermission(Manifest.permission.ACCESS_COARSE_LOCATION)) {
      cordova.requestPermission(this, REQUEST_CODE, Manifest.permission.ACCESS_COARSE_LOCATION);
    }

    Context context = cordova.getActivity().getApplicationContext();
    this.taskExecutor = new NearbyTaskExecutorImpl(context);

    Log.d(TAG, "Initializing Nearby");
  }

  @Override
  public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
    switch(action.toLowerCase()) {
      case "startadvertising":
        this.taskExecutor.startAdvertising(args.getString(0));
        break;
      case "stopadvertising":
        Log.d(TAG, "Stopping advertising.");
        this.taskExecutor.stopAdvertising();
        break;
      case "setserviceid":
        Log.d(TAG, "Setting service id: " + args.getString(0));
        this.taskExecutor.setServiceId(args.getString(0));
        break;
      case "startdiscovery":
        Log.d(TAG, "Starting discovery");
        this.taskExecutor.startDiscovery();
        break;
      case "stopdiscovery":
        Log.d(TAG, "Turning off discovery.");
        this.taskExecutor.stopDiscovery();
        break;
      case "send":
        Gson gson = new Gson();
        List<String> endpoints = gson.fromJson(args.getString(0), List.class);
        Log.d(TAG, "Sending payload " + args.getString(1) + " to endpoints: " + endpoints.toString());
        this.taskExecutor.sendMessage(endpoints, args.getString(1));
        break;
      case "connect":
        Log.d(TAG, "Connecting to endpoint: " + args.getString(0));
        this.taskExecutor.connect(args.getString(0));
        break;
      case "disconnect":
        Log.d(TAG, "Disconnecting from endpoint: " + args.getString(0));
        this.taskExecutor.disconnectFromEndpoint(args.getString(0));
        break;
      case "disconnectall":
        Log.d(TAG, "Disconnecting from all endpoints.");
        this.taskExecutor.disconnectFromAllEndpoints();
        break;
      /*case "setcallback":
        Log.d(TAG, "Setting javascript callback.");
        this.connectionLifecycleCallback.setCallback(callbackContext);
        this.endpointDiscoveryCallback.setCallback(callbackContext);
        break;
      case "checkmessages":
        Log.d(TAG, "Getting messages from queue.");

        MessageQueue queue = MessageQueue.getInstance();

        if (queue.hasMessages()) {
          Log.d(TAG, "Found " + queue.getMessages().size() + " messages in the queue.");
          PluginResult result = new PluginResult(Status.OK, queue.getMessagesAsJSON());
          callbackContext.sendPluginResult(result);
        }
        break;*/
    }

    return true;
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
    this.taskExecutor.stopAdvertising();
    this.taskExecutor.stopDiscovery();
    Log.d(TAG, "Pausing NearbyPlugin");
  }

  @Override
  public void onResume(boolean multitasking) {
    super.onResume(multitasking);
    this.checkPlayServices();
    Log.d(TAG, "Resuming NearbyPlugin");
  }
}
